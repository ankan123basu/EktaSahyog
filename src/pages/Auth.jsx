import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ScanLine, Mail, Lock, User, MapPin, Globe, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import OCRModal from '../Components/features/OCRModal';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import ElectricBorder from '../Components/ui/ElectricBorder';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import bg1 from '../Images/wmremove-transformed.png';

const TiltCard = ({ children }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

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
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative"
        >
            {children}
        </motion.div>
    );
};

const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white/40 rounded-full"
                    initial={{
                        x: Math.random() * window.innerWidth,
                        y: Math.random() * window.innerHeight,
                        opacity: 0,
                    }}
                    animate={{
                        y: [null, Math.random() * -100],
                        opacity: [0, 0.8, 0],
                    }}
                    transition={{
                        duration: Math.random() * 5 + 5,
                        repeat: Infinity,
                        ease: "linear",
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showOCR, setShowOCR] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(""); // Added Success State
    const navigate = useNavigate();
    const location = useLocation();

    // Handle Google Login Callback & Redirect Messages
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userStr = params.get('user');
        const errorMsg = params.get('error');

        // Check for state message from VerifyEmail
        if (location.state?.successMessage) {
            setSuccess(location.state.successMessage);
            // Clear state so refresh doesn't show it again
            window.history.replaceState({}, document.title);
        }
        // Also check if passed via email logic redirect
        if (location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
        }


        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                window.dispatchEvent(new Event('user-login'));

                // Clear URL
                window.history.replaceState({}, document.title, window.location.pathname);

                // Redirect
                if (user.role === 'admin') navigate('/dashboard');
                else navigate('/projects');
            } catch (e) {
                console.error("Failed to parse user data", e);
                setError("Login failed. Please try again.");
            }
        } else if (errorMsg) {
            setError("Google Login failed. Please try again.");
        }
    }, [navigate, location]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        region: '',
        language: ''
    });

    const handleOCRComplete = (data) => {
        setFormData(prev => ({
            ...prev,
            name: data.name,
            region: data.region,
            language: data.language
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setSuccess("");

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const url = `http://localhost:5001${endpoint}`;

            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : {
                    ...formData,
                    location: formData.region, // Send the string region as 'location'
                    region: { type: "Point", coordinates: [0, 0] } // Mock coordinates for now
                };

            const { data } = await axios.post(url, payload);

            if (!isLogin) {
                // Registration Logic: Redirect to Verify
                navigate('/verify-email', { state: { email: formData.email } });
                return;
            }

            // Login Logic
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('user-login')); // Trigger Navbar update

            if (data.user.email === 'admin@ektasahyog.com') {
                navigate('/dashboard');
            } else {
                navigate('/projects');
            }

        } catch (err) {
            setError(err.response?.data?.msg || err.response?.data?.error || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-unity-dark overflow-x-hidden">
            {/* Fixed Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 opacity-60">
                    <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
                </div>
                <BackgroundBeams />
                <FloatingParticles />
                {/* Animated Orbs */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-unity-indigo/30 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-unity-emerald/20 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
            </div>

            {/* Scrollable Content Container */}
            <div className="min-h-screen flex items-center justify-center px-4 pt-32 pb-20 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md perspective-1000 my-auto"
                >
                    <TiltCard>
                        <ElectricBorder color={isLogin ? "#4338ca" : "#f59e0b"}>
                            <div className="bg-black/40 backdrop-blur-xl p-6 rounded-xl border border-white/10 shadow-2xl">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 mb-3 border border-white/10">
                                        <Sparkles className={`w-5 h-5 ${isLogin ? 'text-unity-indigo' : 'text-unity-saffron'}`} />
                                    </div>
                                    <h2 className="text-2xl font-display text-white mb-1 tracking-wide">
                                        {isLogin ? 'WELCOME BACK' : 'JOIN THE MOVEMENT'}
                                    </h2>
                                    <p className="text-gray-400 text-xs">
                                        {isLogin ? 'Continue your journey of unity' : 'Start connecting with communities'}
                                    </p>
                                </div>

                                {/* Toggle Switch */}
                                <div className="relative flex p-1 bg-black/40 rounded-lg mb-6 border border-white/5">
                                    <motion.div
                                        className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-md ${isLogin ? 'bg-unity-indigo' : 'bg-unity-saffron'}`}
                                        animate={{ x: isLogin ? 0 : '100%' }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                    <button
                                        onClick={() => setIsLogin(true)}
                                        className={`flex-1 py-1.5 text-xs font-medium relative z-10 transition-colors ${isLogin ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        LOGIN
                                    </button>
                                    <button
                                        onClick={() => setIsLogin(false)}
                                        className={`flex-1 py-1.5 text-xs font-medium relative z-10 transition-colors ${!isLogin ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        SIGN UP
                                    </button>
                                </div>

                                {/* Messages */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-200 text-xs text-center flex items-center justify-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                            {error}
                                        </motion.div>
                                    )}
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-4 p-2 bg-green-500/10 border border-green-500/20 rounded-lg text-green-200 text-xs text-center flex items-center justify-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                            {success}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Form */}
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <AnimatePresence mode="wait">
                                        {!isLogin && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="space-y-3 overflow-hidden"
                                            >
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="w-full py-2 text-xs border-dashed border-unity-saffron/30 text-unity-saffron hover:bg-unity-saffron/10 hover:border-unity-saffron"
                                                    onClick={() => setShowOCR(true)}
                                                >
                                                    <ScanLine className="mr-2 w-3 h-3" /> Auto-fill with ID Card
                                                </Button>

                                                <div className="relative group">
                                                    <User className="absolute left-3 top-3 text-gray-500 w-4 h-4 group-focus-within:text-unity-saffron transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 pl-9 text-sm text-white placeholder-gray-500 focus:border-unity-saffron focus:ring-1 focus:ring-unity-saffron focus:outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="relative group">
                                        <Mail className={`absolute left-3 top-3 text-gray-500 w-4 h-4 transition-colors ${isLogin ? 'group-focus-within:text-unity-indigo' : 'group-focus-within:text-unity-saffron'}`} />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className={`w-full bg-black/20 border border-white/10 rounded-lg p-2.5 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${isLogin ? 'focus:border-unity-indigo focus:ring-1 focus:ring-unity-indigo' : 'focus:border-unity-saffron focus:ring-1 focus:ring-unity-saffron'}`}
                                            required
                                        />
                                    </div>

                                    <div className="relative group">
                                        <Lock className={`absolute left-3 top-3 text-gray-500 w-4 h-4 transition-colors ${isLogin ? 'group-focus-within:text-unity-indigo' : 'group-focus-within:text-unity-saffron'}`} />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className={`w-full bg-black/20 border border-white/10 rounded-lg p-2.5 pl-9 text-sm text-white placeholder-gray-500 focus:outline-none transition-all ${isLogin ? 'focus:border-unity-indigo focus:ring-1 focus:ring-unity-indigo' : 'focus:border-unity-saffron focus:ring-1 focus:ring-unity-saffron'}`}
                                            required
                                        />
                                        {isLogin && (
                                            <div className="text-right mt-1.5">
                                                <a href="/forgot-password" className="text-[10px] text-unity-saffron hover:text-white transition-colors">
                                                    Forgot Password?
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!isLogin && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="grid grid-cols-2 gap-3 overflow-hidden"
                                            >
                                                <div className="relative group">
                                                    <MapPin className="absolute left-3 top-3 text-gray-500 w-4 h-4 group-focus-within:text-unity-saffron transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Region"
                                                        value={formData.region}
                                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 pl-9 text-sm text-white placeholder-gray-500 focus:border-unity-saffron focus:ring-1 focus:ring-unity-saffron focus:outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <Globe className="absolute left-3 top-3 text-gray-500 w-4 h-4 group-focus-within:text-unity-saffron transition-colors" />
                                                    <input
                                                        type="text"
                                                        placeholder="Language"
                                                        value={formData.language}
                                                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 pl-9 text-sm text-white placeholder-gray-500 focus:border-unity-saffron focus:ring-1 focus:ring-unity-saffron focus:outline-none transition-all"
                                                        required
                                                    />
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <Button
                                        variant={isLogin ? "primary" : "accent"}
                                        className="w-full mt-4 py-3 text-sm shadow-lg hover:shadow-xl transition-all relative overflow-hidden group"
                                        disabled={isLoading}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                        {isLoading ? <Loader2 className="animate-spin mr-2 w-4 h-4" /> : null}
                                        {isLogin ? 'Login' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
                                    </Button>

                                    {/* Google Login Button */}
                                    <div className="relative my-4">
                                        <div className="absolute inset-0 flex items-center">
                                            <div className="w-full border-t border-white/10"></div>
                                        </div>
                                        <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                                            <span className="px-2 bg-black/40 text-gray-500">Or continue with</span>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full bg-white text-gray-800 hover:bg-gray-100 flex items-center justify-center gap-2 py-2.5 text-sm"
                                        onClick={() => window.location.href = "http://localhost:5001/auth/google"}
                                    >
                                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        Google
                                    </Button>
                                </form>
                            </div>
                        </ElectricBorder>
                    </TiltCard>
                </motion.div>

                <OCRModal
                    isOpen={showOCR}
                    onClose={() => setShowOCR(false)}
                    onScanComplete={handleOCRComplete}
                />
            </div>
        </div>
    );
};

export default Auth;
