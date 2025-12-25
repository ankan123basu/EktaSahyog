import React, { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, ArrowRight, Loader2, ArrowLeft, KeyRound } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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

const InputField = ({ type, placeholder, value, onChange, icon: Icon }) => (
    <div className="relative group">
        <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-orange-500 transition-colors">
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 block p-3 pl-10 transition-all placeholder-gray-400"
            required
        />
    </div>
);

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post('http://localhost:5001/auth/forgot-password', { email });
            setMessage(data.message);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send reset email.");
        } finally {
            setIsLoading(false);
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
                className="w-full max-w-md relative z-10 perspective-1000"
            >
                <TiltCard>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden ring-1 ring-white/10">
                        {/* Header */}
                        <div className="mb-8">
                            <button onClick={() => navigate('/auth')} className="text-sm text-gray-400 hover:text-gray-900 flex items-center gap-1 mb-6 transition-colors font-medium">
                                <ArrowLeft className="w-4 h-4" /> Back to Login
                            </button>

                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50 text-orange-600 mb-4 shadow-sm">
                                <KeyRound className="w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 font-display">Forgot Password?</h2>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                                Don't worry! It happens. Please enter the email associated with your account.
                            </p>
                        </div>

                        {/* Feedback Messages */}
                        <AnimatePresence>
                            {message && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-green-50 text-green-700 border-l-4 border-green-500 rounded-r text-sm font-medium">
                                    {message}
                                </motion.div>
                            )}
                            {error && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mb-6 p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r text-sm font-medium">
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <InputField
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={Mail}
                            />

                            <Button
                                className="w-full h-11 bg-gray-900 hover:bg-black text-white rounded-lg shadow-lg text-sm font-semibold tracking-wide transition-all active:scale-[0.98] group"
                                disabled={isLoading || message}
                            >
                                {isLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4 mx-auto" /> : (
                                    <span className="flex items-center justify-center gap-2">
                                        {message ? 'Email Sent' : 'Send Reset Link'}
                                        {!message && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                                    </span>
                                )}
                            </Button>
                        </form>
                    </div>
                </TiltCard>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
