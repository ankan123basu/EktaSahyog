
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import ElectricBorder from '../Components/ui/ElectricBorder';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

import bg1 from '../Images/wmremove-transformed.png';

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const { data } = await axios.post(`http://localhost:5001/auth/reset-password/${token}`, { password });
            setMessage(data.message);
            setTimeout(() => navigate('/auth'), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password. Link might be expired.");
        } finally {
            setIsLoading(false);
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <ElectricBorder color="#10b981">
                    <div className="bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-white/10 shadow-2xl">
                        <h2 className="text-3xl font-display text-white mb-2">Reset Password 🔄</h2>
                        <p className="text-gray-400 text-sm mb-6">Create a strong new password for your account.</p>

                        <AnimatePresence>
                            {message && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-200 text-sm"
                                >
                                    <h4 className="flex items-center gap-2 font-bold mb-1"><CheckCircle className="w-4 h-4" /> Success!</h4>
                                    {message}
                                    <p className="mt-2 text-xs opacity-70">Redirecting to login...</p>
                                </motion.div>
                            )}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-sm"
                                >
                                    ❌ {error}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {!message && (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-unity-emerald transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="New Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:border-unity-emerald focus:ring-1 focus:ring-unity-emerald focus:outline-none transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-3 top-3.5 text-gray-500 w-5 h-5 group-focus-within:text-unity-emerald transition-colors" />
                                    <input
                                        type="password"
                                        placeholder="Confirm New Password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:border-unity-emerald focus:ring-1 focus:ring-unity-emerald focus:outline-none transition-all"
                                        required
                                    />
                                </div>

                                <Button
                                    variant="primary" // Changed to primary green style if available or default
                                    className="w-full py-4 relative group overflow-hidden bg-unity-emerald hover:bg-unity-emerald/90 text-black font-bold"
                                    disabled={isLoading}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Set New Password <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </form>
                        )}
                    </div>
                </ElectricBorder>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
