import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

/* PROFESSIONAL EMAIL TEMPLATE */
const getEmailTemplate = (title, bodyContent) => {
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


/* REGISTER USER */
export const register = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            region, // { type: "Point", coordinates: [lon, lat] }
            location,
            language,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: passwordHash,
            region,
            location,
            language,
            role: email === 'admin@ektasahyog.com' ? 'admin' : 'user',
            otp: Math.floor(100000 + Math.random() * 900000).toString(), // 6 digit OTP
            otpExpires: Date.now() + 10 * 60 * 1000 // 10 Minutes
        });

        const savedUser = await newUser.save();

        // Send Email with OTP
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"EktaSahyog Verification" <${process.env.EMAIL_USER}>`,
            to: savedUser.email,
            subject: "Verify Your Email - EktaSahyog",
            html: getEmailTemplate("Verify Your Email", `
                <p>Welcome to EktaSahyog! We are thrilled to have you join our community.</p>
                <p>Please use the verification code below to activate your account:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; background-color: #fff4e6; color: #ff9933; padding: 15px 30px; border-radius: 8px; border: 1px dashed #ff9933; letter-spacing: 5px;">${savedUser.otp}</span>
                </div>
                <p style="text-align: center; color: #666; font-size: 13px;">This code expires in 10 minutes.</p>
            `)
        });

        res.status(201).json({ message: "OTP sent to email", email: savedUser.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* LOGIN USER */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if (!user) return res.status(400).json({ msg: "User does not exist. " });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

        // Check if verified
        // Check if verified
        if (!user.isVerified) {
            // Allow Legacy Users: Created before Dec 12, 2025
            const cutoffDate = new Date('2025-12-12T00:00:00.000Z');
            if (user.createdAt && user.createdAt < cutoffDate) {
                user.isVerified = true;
                await user.save();
            } else {
                return res.status(403).json({ error: "Email not verified. Please verify your email.", notVerified: true });
            }
        }

        // Force Admin Role for specific email (Fix for existing user)
        if (email === 'admin@ektasahyog.com' && user.role !== 'admin') {
            user.role = 'admin';
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const userObj = user.toObject();
        delete userObj.password;

        // Send Login Success Email
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            // Don't await this to avoid slowing down login
            transporter.sendMail({
                from: `"EktaSahyog Security" <${process.env.EMAIL_USER}>`,
                to: user.email,
                subject: "Login Alert - EktaSahyog",
                html: getEmailTemplate("New Login Detected", `
                    <p>Hello <strong>${user.name}</strong>,</p>
                    <p>We detected a new login to your account.</p>
                    <table style="width: 100%; margin: 20px 0; background-color: #f8f9fa; border-radius: 8px; padding: 15px;">
                        <tr>
                            <td style="color: #666; font-size: 13px; padding-bottom: 5px;">Time:</td>
                            <td style="font-weight: bold; color: #333;">${new Date().toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td style="color: #666; font-size: 13px;">Status:</td>
                            <td style="font-weight: bold; color: #2ecc71;">Successful</td>
                        </tr>
                    </table>
                    <p>If this was you, you can safely ignore this email.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 20px;">If you did not sign in, please reset your password immediately.</p>
                `)
            });
        } catch (emailErr) {
            console.error("Login email failed:", emailErr);
        }

        res.status(200).json({ token, user: userObj });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
/* GET USER STATS */
export const getUserStats = async (req, res) => {
    try {
        const stats = await User.aggregate([
            {
                $group: {
                    _id: "$location", // Group by region name
                    count: { $sum: 1 }
                }
            }
        ]);

        // Format for frontend: [{ name: 'Punjab', value: 10 }, ...]
        const formattedStats = stats.map(s => ({
            name: s._id || 'Unknown',
            value: s.count
        }));

        res.status(200).json(formattedStats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET TOTAL USER COUNT */
export const getUserCount = async (req, res) => {
    try {
        const count = await User.countDocuments();
        res.status(200).json({ count });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET ACTIVITY STATS */
export const getActivityStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        // Generate 12 points of data ending at current time
        const data = [];
        const now = new Date();
        for (let i = 11; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 5 * 60000); // 5 min intervals
            // Simulate slight fluctuation around totalUsers
            const fluctuation = Math.floor(Math.random() * 20) - 10;
            data.push({
                time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                count: Math.max(0, totalUsers + fluctuation)
            });
        }
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* FORGOT PASSWORD */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            // Security: Don't reveal user doesn't exist? 
            // For now, let's be explicit for better UX in this project.
            return res.status(404).json({ error: "User with this email does not exist." });
        }

        // Generate Token
        // 32 bytes hex string
        const resetToken = crypto.randomBytes(32).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 Hour
        await user.save();

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Use Client URL for link
        const resetUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

        const mailOptions = {
            from: `"EktaSahyog Security" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "Reset Your Password - EktaSahyog",
            html: getEmailTemplate("Password Reset Request", `
                <p>We received a request to reset your password. No worries, it happens!</p>
                <p>Click the button below to reset your password and verify your identity:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #ff9933; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
                </div>
                <p style="text-align: center; color: #666; font-size: 13px;">This link expires in 1 hour.</p>
                <p style="margin-top: 30px; font-size: 13px; color: #999;">If you didn't request a password reset, you can safely ignore this message.</p>
            `)
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset link sent to your email." });

    } catch (err) {
        console.error("Forgot Password Error:", err);
        res.status(500).json({ error: "Email could not be sent." });
    }
};

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // Token must not be expired
        });

        if (!user) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        // Hash new password
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        user.password = passwordHash;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.status(200).json({ message: "Password reset successful! You can now login." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/* VERIFY EMAIL OTP */
export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found." });

        if (user.isVerified) {
            return res.status(400).json({ error: "Email already verified. Please login." });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        // Verify User
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        // Login User
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ token, user: userObj, message: "Email Verified Successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* RESEND OTP */
export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found." });
        if (user.isVerified) return res.status(400).json({ error: "Email already verified." });

        // Generate New OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        // Send Email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"EktaSahyog Verification" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: "New Verification Code - EktaSahyog",
            html: getEmailTemplate("New Verification Code", `
                <p>You requested a new verification code. Here it is:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="display: inline-block; font-size: 32px; font-weight: bold; background-color: #fff4e6; color: #ff9933; padding: 15px 30px; border-radius: 8px; border: 1px dashed #ff9933; letter-spacing: 5px;">${otp}</span>
                </div>
                <p style="text-align: center; color: #666; font-size: 13px;">This code expires in 10 minutes.</p>
            `)
        });

        res.status(200).json({ message: "New OTP sent to email." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GOOGLE AUTH CALLBACK */
export const googleCallback = async (req, res) => {
    try {
        const user = req.user;
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // Sanitize User
        const userObj = user.toObject();
        delete userObj.password;
        const userStr = encodeURIComponent(JSON.stringify(userObj));

        // Redirect to frontend with token AND user
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        res.redirect(`${clientUrl}/auth?token=${token}&user=${userStr}&success=true`);
    } catch (err) {
        console.error("Google Auth Error:", err);
        res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/auth?error=GoogleAuthFailed`);
    }
};
