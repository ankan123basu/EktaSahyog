import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create Singleton Transporter with Connection Pooling
const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true, // Use pooled connections
    maxConnections: 5, // Limit concurrent connections
    maxMessages: 100, // Limit messages per connection
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Send Email with Retry Logic
 * @param {Object} mailOptions - { from, to, subject, html }
 * @param {number} retries - Number of retries left
 */
export const sendEmail = async (mailOptions, retries = 3) => {
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        if (retries > 0) {
            console.warn(`⚠️ Email failed. Retrying... (${retries} attempts left)`);
            await new Promise(res => setTimeout(res, 1000)); // Wait 1s
            return sendEmail(mailOptions, retries - 1);
        } else {
            console.error("❌ Email sending completely failed:", error);
            throw error; // Let the caller handle/log the final failure
        }
    }
};

/* PROFESSIONAL EMAIL TEMPLATE BUILDER */
export const getEmailTemplate = (title, bodyContent) => {
    return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <!-- Header -->
            <div style="background-color: #1a1a1a; padding: 25px; text-align: center; border-bottom: 4px solid #ff9933;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">EktaSahyog</h1>
                <p style="color: #aaaaaa; margin: 5px 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">United for Change</p>
            </div>
            
            <!-- Body -->
            <div style="padding: 40px 30px; color: #333333; line-height: 1.6;">
                <h2 style="color: #2c3e50; margin-top: 0; font-size: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">${title}</h2>
                <div style="margin-top: 20px;">
                    ${bodyContent}
                </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #888888; font-size: 12px;">
                <p style="margin: 0;">&copy; ${new Date().getFullYear()} EktaSahyog. All rights reserved.</p>
                <p style="margin: 5px 0 0;">This brings us together.</p>
            </div>
        </div>
    </div>
    `;
};
