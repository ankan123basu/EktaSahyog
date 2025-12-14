import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_PLACEHOLDER');

export const createCheckoutSession = async (req, res) => {
    try {
        const { products } = req.body; // Expecting an array of products or a single product

        // Normalize to array
        const items = Array.isArray(products) ? products : [products];

        const lineItems = items.map((product) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: product.title,
                    images: [product.image], // Stripe expects an array of image URLs
                    description: product.description ? product.description.substring(0, 100) + '...' : undefined,
                },
                unit_amount: Math.round(product.price * 100), // Amount in paise
            },
            quantity: 1,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/marketplace?success=true`,
            cancel_url: `${process.env.CLIENT_URL}/marketplace?canceled=true`,
        });

        res.status(200).json({ id: session.id, url: session.url });
    } catch (error) {
        console.error("Error creating Stripe session:", error);
        res.status(500).json({ error: error.message });
    }
};
