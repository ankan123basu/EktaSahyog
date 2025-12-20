import { sendEmail, getEmailTemplate } from '../services/email.js';
import dotenv from 'dotenv';
dotenv.config();

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        await sendEmail({
            from: `"EktaSahyog Newsletter" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Welcome to EktaSahyog Newsletter! 🇮🇳",
            html: getEmailTemplate("Subscription Confirmed!", `
                <p>Namaste,</p>
                <p>Thank you for subscribing to our newsletter. You are now part of a community dedicated to unity and cultural preservation.</p>
                <p>We'll keep you updated with the latest stories, marketplace gems, and volunteer opportunities.</p>
                <p><strong>Jai Hind!</strong></p>
            `)
        });

        res.status(200).json({ message: "Subscription successful! Check your email." });
    } catch (err) {
        console.error("Newsletter Error:", err);
        res.status(500).json({ error: "Failed to subscribe. Please try again." });
    }
};
