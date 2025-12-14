
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import ElectricBorder from '../Components/ui/ElectricBorder';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

import bg1 from '../Images/wmremove-transformed.png';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const inputRefs = React.useRef([]);

    useEffect(() => {
        if (!email) {
            // If no email passed, maybe redirect or ask for it?
            // For now, let's assume they came from Register
        }
    }, [email]);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join('');
        if (code.length < 6) {
            setError("Please enter the 6-digit code.");
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('http://localhost:5001/auth/verify-email', { email, otp: code });

            setMessage(data.message);

            // Redirect to Login instead of auto-login
            setTimeout(() => {
                navigate('/auth', { state: { successMessage: "Email Verified Successfully! Please Login." } });
            }, 1500);

        } catch (err) {
            setError(err.response?.data?.error || "Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            await axios.post('http://localhost:5001/auth/resend-otp', { email });
            setMessage("New code sent!");
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError("Failed to resend code.");
        }
    };

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4 relative overflow-hidden bg-unity-dark">
            {/* Background Image */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>

            <BackgroundBeams />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md relative z-10"
            >
                <ElectricBorder color="#3b82f6">
                    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/20 mb-4 text-blue-400">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h2 className="text-3xl font-display text-white mb-2">Verify Email 📧</h2>
                            <p className="text-gray-400 text-sm">
                                We sent a 6-digit code to <span className="text-white font-semibold">{email}</span>
                            </p>
                        </div>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-200 text-sm text-center"
                                >
                                    ✅ {message}
                                </motion.div>
                            )}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm text-center"
                                >
                                    ❌ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleVerify} className="space-y-6">
                            <div className="flex justify-between gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-2xl font-bold bg-black/30 border border-white/20 rounded-lg text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                    />
                                ))}
                            </div>

                            <Button
                                variant="primary"
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                Verify & Login <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <button
                                onClick={handleResend}
                                className="text-sm text-gray-400 hover:text-white flex items-center justify-center gap-2 w-full transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" /> Resend Code
                            </button>
                        </div>
                    </div>
                </ElectricBorder>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
