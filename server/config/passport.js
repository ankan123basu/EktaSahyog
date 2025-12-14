
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // 1. Check if user exists by googleId
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                return done(null, user);
            }

            // 2. Check if user exists by email (link accounts)
            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
                user.googleId = profile.id;
                // Mark as verified if verified by Google (usually yes)
                if (profile.emails[0].verified) {
                    user.isVerified = true;
                }
                await user.save();
                return done(null, user);
            }

            // 3. Create new user
            // Note: Google might not provide all fields like region, so verification might fail validation?
            // User schema has region required? No, region default Point.
            // Name required. Email required.
            const newUser = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                password: '', // No password
                isVerified: true, // Google emails are verified
                region: { type: 'Point', coordinates: [0, 0] }, // Default
                location: 'India', // Generic default
            });

            await newUser.save();
            return done(null, newUser);

        } catch (err) {
            console.error("Google Auth Error:", err);
            return done(err, null);
        }
    }
));

// Serialization needed for sessions (or just token handling?)
// Since we use JWT content handling in controller, we might not need session?
// But Passport usually requires serialize/deserialize if using session: false?
// We will use session: false in the route.
