import express from 'express';
import { login, register, getUserStats, getUserCount, getActivityStats, googleCallback, forgotPassword, resetPassword, verifyEmail, resendOTP } from '../controllers/auth.js';
import passport from 'passport';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOTP);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' }));
router.get('/google/callback', passport.authenticate('google', { session: false }), googleCallback);
router.get('/stats', getUserStats);
router.get('/users/count', getUserCount);
router.get('/stats/activity', getActivityStats);

export default router;
