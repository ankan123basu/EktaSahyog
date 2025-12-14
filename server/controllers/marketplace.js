import Product from '../models/Product.js';

/* CREATE PRODUCT */
export const createProduct = async (req, res) => {
    try {
        const {
            title,
            description,
            price,
            artisan,
            region,
            category,
            size,
            image,
            pointsPrice // Added pointsPrice
        } = req.body;

        const newProduct = new Product({
            title,
            description,
            price,
            artisan,
            region,
            category,
            size,
            image,
            pointsPrice: pointsPrice || 10000, // Use provided points or default
            sellerId: req.user.id, // From auth middleware
        });

        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET ALL PRODUCTS */
export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { region: { $regex: search, $options: 'i' } },
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* BUY WITH POINTS */
import GameScore from '../models/GameScore.js';
import Order from '../models/Order.js';
import nodemailer from 'nodemailer';

// Email Helper (Simplified version of auth.js for consistency)
const sendEmail = async (to, subject, title, body) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
        <div style="background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="background: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #ff9933;">
                <h1 style="color: #fff; margin: 0; font-size: 24px;">EktaSahyog</h1>
            </div>
            <div style="padding: 40px 30px; color: #333; line-height: 1.6;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${title}</h2>
                <div style="margin-top: 20px;">${body}</div>
            </div>
            <div style="background: #f4f4f4; padding: 15px; text-align: center; color: #888; font-size: 12px;">
                &copy; ${new Date().getFullYear()} EktaSahyog
            </div>
        </div>
    </div>`;

    await transporter.sendMail({
        from: `"EktaSahyog Marketplace" <${process.env.EMAIL_USER}>`,
        to, subject, html
    });
};

export const buyWithPoints = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        const userEmail = req.user.email; // From verifyToken middleware usually, strict check might be needed

        // We need the user's email. If middleware doesn't provide it fully populated, we fetch it.
        // Assuming verifyToken populates req.user with { id: ... } 
        // Let's fetch the full user object to be safe and get the email.
        const User = (await import('../models/User.js')).default;
        const user = await User.findById(userId);

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ message: "Product not found" });

        const gameScore = await GameScore.findOne({ userId });
        if (!gameScore) return res.status(400).json({ message: "No game score found for user" });

        if (gameScore.totalPoints < product.pointsPrice) {
            return res.status(400).json({ message: "Insufficient points" });
        }

        // Deduct points
        gameScore.totalPoints -= product.pointsPrice;
        await gameScore.save();

        // Create Order
        const order = new Order({
            userId,
            productId,
            productSnapshot: {
                title: product.title,
                image: product.image,
                pointsPrice: product.pointsPrice
            },
            status: 'PENDING_ADDRESS',
            pointsPaid: product.pointsPrice
        });
        await order.save();

        // Send Initial Email
        const shippingLink = `${process.env.CLIENT_URL || "http://localhost:5173"}/shipping/${order._id}`;

        await sendEmail(
            user.email,
            "Action Required: Complete Your Shipping Details",
            "Order Successful! One Last Step...",
            `
            <p>Congratulations! You have successfully redeemed <strong>${product.title}</strong> for ${product.pointsPrice} points.</p>
            <div style="text-align: center; margin: 20px 0;">
                <img src="${product.image}" alt="${product.title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
            </div>
            <p>To receive your item, please verify and complete your shipping address:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="${shippingLink}" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Enter Shipping Address</a>
            </div>
            `
        );

        res.status(200).json({
            message: "Purchase successful! Please check your email.",
            remainingPoints: gameScore.totalPoints,
            orderId: order._id
        });
    } catch (err) {
        console.error("Purchase Error:", err);
        res.status(500).json({ error: err.message });
    }
};

/* UPDATE SHIPPING */
export const updateShipping = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { addressLine, city, state, zipCode, phone, firstName } = req.body;

        const order = await Order.findById(orderId).populate('userId');
        if (!order) return res.status(404).json({ message: "Order not found" });

        // Update Address & Status
        order.shippingAddress = { firstName, addressLine, city, state, zipCode, phone };
        order.status = 'SHIPPED'; // Auto-approving for this demo
        order.shippedAt = new Date();
        await order.save();

        // Send FINAL Confirmation Email
        await sendEmail(
            order.userId.email,
            "Order Shipped! 🚚",
            "Your Reward is on the Way!",
            `
            <p>Great news, detailed shipping instructions received!</p>
            <p>Your <strong>${order.productSnapshot.title}</strong> has been processed and will be shipped to:</p>
            <div style="background: #fff4e6; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                <strong>${firstName}</strong><br/>
                ${addressLine}<br/>
                ${city}, ${state} - ${zipCode}<br/>
                Phone: ${phone}
            </div>
            <p>You will receive it within 5-7 business days.</p>
            <p>Thank you for supporting our artisans!</p>
            `
        );

        res.status(200).json({ message: "Address updated and order shipped!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
