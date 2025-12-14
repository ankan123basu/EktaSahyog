import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const getEmailTemplate = (title, bodyContent) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #ff9933;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">EktaSahyog</h1>
                <p style="color: #aaaaaa; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">United for Change</p>
            </div>
            <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                <h2 style="color: #2c3e50; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${title}</h2>
                <div style="margin-top: 20px;">
                    ${bodyContent}
                </div>
            </div>
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #888888; font-size: 12px;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} EktaSahyog. All rights reserved.</p>
            </div>
        </div>
    </div>
    `;
};

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
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
