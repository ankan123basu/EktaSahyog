import Product from '../models/Product.js';
import GameScore from '../models/GameScore.js';
import Order from '../models/Order.js';
import { sendEmail, getEmailTemplate } from '../services/email.js';

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
export const buyWithPoints = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;

        // Use dynamic import for User to avoid circular dependency issues if any, or just keep legacy style
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

        await sendEmail({
            from: `"EktaSahyog Marketplace" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Action Required: Complete Your Shipping Details",
            html: getEmailTemplate("Order Successful! One Last Step...", `
                <p>Congratulations! You have successfully redeemed <strong>${product.title}</strong> for ${product.pointsPrice} points.</p>
                <div style="text-align: center; margin: 20px 0;">
                    <img src="${product.image}" alt="${product.title}" style="max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                </div>
                <p>To receive your item, please verify and complete your shipping address:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${shippingLink}" style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Enter Shipping Address</a>
                </div>
            `)
        });

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
        await sendEmail({
            from: `"EktaSahyog Marketplace" <${process.env.EMAIL_USER}>`,
            to: order.userId.email,
            subject: "Order Shipped! 🚚",
            html: getEmailTemplate("Your Reward is on the Way!", `
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
            `)
        });

        res.status(200).json({ message: "Address updated and order shipped!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
