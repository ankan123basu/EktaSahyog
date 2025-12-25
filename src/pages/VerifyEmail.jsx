import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import bg1 from '../Images/wmremove-transformed.png';

// --- SHARED VISUAL COMPONENTS ---
const TiltCard = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXVal = e.clientX - rect.left;
        const mouseYVal = e.clientY - rect.top;
        const xPct = mouseXVal / width - 0.5;
        const yPct = mouseYVal / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="relative"
        >
            {children}
        </motion.div>
    );
};

const FloatingParticles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
            <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: 0 }}
                animate={{ y: [null, Math.random() * -100], opacity: [0, 0.8, 0] }}
                transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, ease: "linear", delay: Math.random() * 5 }}
            />
        ))}
    </div>
);

const VerifyEmail = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [email, setEmail] = useState(location.state?.email || '');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const inputRefs = useRef([]);

    // Auto-focus first input
    useEffect(() => {
        if (inputRefs.current[0]) inputRefs.current[0].focus();
    }, []);

    const handleChange = (index, value) => {
        if (isNaN(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value && index < 5) inputRefs.current[index + 1].focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const data = e.clipboardData.getData('text').slice(0, 6).split('');
        if (data.length === 0) return;

        const newOtp = [...otp];
        data.forEach((val, i) => {
            if (i < 6 && !isNaN(val)) newOtp[i] = val;
        });
        setOtp(newOtp);
        const nextIndex = Math.min(data.length, 5);
        inputRefs.current[nextIndex].focus();
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
        <div className="min-h-screen pt-28 flex items-center justify-center px-4 relative overflow-hidden bg-unity-dark">
            {/* RICH BACKGROUND */}
            <div className="fixed inset-0 z-0 opacity-70 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/50 to-unity-dark" />
            </div>
            <BackgroundBeams />
            <FloatingParticles />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg relative z-10 perspective-1000"
            >
                <TiltCard>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 relative overflow-hidden ring-1 ring-white/10">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 text-blue-600 mb-4 shadow-sm">
                                <ShieldCheck className="w-7 h-7" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 font-display mb-2">Verify Email</h2>
                            <p className="text-gray-500 text-sm">
                                We sent a 6-digit code to <br />
                                <span className="text-gray-900 font-semibold">{email || "your email address"}</span>
                            </p>
                        </div>

                        {/* Feedback Messages */}
                        <AnimatePresence>
                            {message && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-green-50 text-green-700 border-l-4 border-green-500 rounded-r text-sm font-medium text-center">
                                    {message}
                                </motion.div>
                            )}
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r text-sm font-medium text-center">
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* OTP Form */}
                        <form onSubmit={handleVerify} className="space-y-8">
                            <div className="flex justify-center gap-2 md:gap-3" onPaste={handlePaste}>
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        ref={el => inputRefs.current[index] = el}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-10 h-10 md:w-12 md:h-14 text-center text-xl md:text-2xl font-bold bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm focus:scale-105"
                                    />
                                ))}
                            </div>

                            <Button
                                className="w-full h-12 bg-gray-900 hover:bg-black text-white rounded-lg shadow-xl text-base font-semibold tracking-wide transition-all active:scale-[0.98] group"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2 w-5 h-5 ml-auto mr-auto" /> : (
                                    <span className="flex items-center justify-center">
                                        Verify & Login <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </Button>
                        </form>

                        {/* Footer */}
                        <div className="mt-8 text-center space-y-4">
                            <button
                                onClick={handleResend}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-2 w-full transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" /> Resend Code
                            </button>

                            <div className="pt-6 border-t border-gray-100">
                                <button
                                    onClick={() => navigate('/auth')}
                                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center justify-center gap-1 mx-auto transition-colors"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to Login
                                </button>
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
