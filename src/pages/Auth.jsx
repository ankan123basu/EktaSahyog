import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, User, MapPin, Globe, Loader2, Sparkles, ArrowRight, ScanLine } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import OCRModal from '../Components/features/OCRModal';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import bg1 from '../Images/wmremove-transformed.png';
import unityImage from '../Images/unity-in-diversity-stockcake.webp';

// --- VISUAL COMPONENTS RESTORED ---
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

// --- FIX: InputField Moved OUTSIDE Component to prevent focus loss ---
const InputField = ({ type, placeholder, value, onChange, icon: Icon }) => (
    <div className="relative group">
        <div className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-unity-saffron transition-colors">
            <Icon className="w-5 h-5" />
        </div>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-unity-saffron/50 focus:border-unity-saffron block p-3 pl-10 transition-all placeholder-gray-400"
            required
        />
    </div>
);

const Auth = () => {
    // --- AUTH LOGIC (PRESERVED) ---
    const [isLogin, setIsLogin] = useState(true);
    const [showOCR, setShowOCR] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userStr = params.get('user');
        const errorMsg = params.get('error');

        if (location.state?.successMessage) {
            setSuccess(location.state.successMessage);
            window.history.replaceState({}, document.title);
        }
        if (location.state?.email) {
            setFormData(prev => ({ ...prev, email: location.state.email }));
        }

        if (token && userStr) {
            try {
                const user = JSON.parse(decodeURIComponent(userStr));
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(user));
                window.dispatchEvent(new Event('user-login'));
                window.history.replaceState({}, document.title, window.location.pathname);
                navigate(user.role === 'admin' ? '/dashboard' : '/marketplace');
            } catch (e) {
                console.error("Failed to parse", e);
                setError("Login failed.");
            }
        } else if (errorMsg) {
            setError("Google Login failed.");
        }
    }, [navigate, location]);

    const [formData, setFormData] = useState({ name: '', email: '', password: '', region: '', language: '' });

    const handleOCRComplete = (data) => setFormData(prev => ({ ...prev, ...data }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const url = `http://localhost:5001${endpoint}`;
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { ...formData, location: formData.region, region: { type: "Point", coordinates: [0, 0] } };

            const { data } = await axios.post(url, payload);

            if (!isLogin) {
                navigate('/verify-email', { state: { email: formData.email } });
                return;
            }

            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('user-login'));
            navigate(data.user.email === 'admin@ektasahyog.com' ? '/dashboard' : '/marketplace');

        } catch (err) {
            // Displays backend error message (e.g., "User already exists")
            let msg = err.response?.data?.msg || err.response?.data?.error || "An error occurred";
            if (msg.includes("E11000") || msg.includes("duplicate key")) {
                msg = "This email is already registered. Please login.";
            }
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-unity-dark overflow-x-hidden pt-28 pb-12 flex items-center justify-center px-4">

            {/* --- RICH BACKGROUND (RESTORED) --- */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.70]">
                    <img src={bg1} alt="Rich Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/50 to-unity-dark" />
                </div>
                <BackgroundBeams />
                <FloatingParticles />
            </div>

            {/* --- MAIN CONTENT (COMPACT CARD, Z-INDEX 10) --- */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-4xl perspective-1000"
            >
                {/* TILT EFFECT Wrapper */}
                <TiltCard>
                    <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/10 opacity-95 hover:opacity-100 transition-opacity">

                        {/* LEFT: User's Requested Image */}
                        <div className="w-full md:w-5/12 relative bg-gray-900 overflow-hidden hidden md:block">
                            <img
                                src={unityImage}
                                alt="Unity in Diversity"
                                className="absolute inset-0 w-full h-full object-cover opacity-90 transition-transform duration-[10s] hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                                <h2 className="text-2xl font-display font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-unity-saffron via-white to-unity-emerald">
                                    Unity in Diversity
                                </h2>
                                <p className="text-sm text-gray-300 leading-relaxed font-light">
                                    Join the movement connecting a billion hearts.
                                </p>
                            </div>
                        </div>

                        {/* RIGHT: Compact Form */}
                        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white relative">
                            <div className="text-center mb-8">
                                <div className="inline-block p-3 rounded-full bg-gray-50 mb-4 shadow-sm">
                                    <Sparkles className={`w-6 h-6 ${isLogin ? 'text-unity-indigo' : 'text-unity-saffron'}`} />
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1 font-display tracking-tight">
                                    {isLogin ? 'Welcome Back' : 'Create Account'}
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {isLogin ? 'Enter your credentials to continue' : 'Start your journey with us today'}
                                </p>
                            </div>

                            <AnimatePresence>
                                {(error || success) && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mb-4 p-3 rounded-lg text-sm border-l-4 ${error ? 'bg-red-50 text-red-700 border-red-500' : 'bg-green-50 text-green-700 border-green-500'}`}>
                                        {error || success}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {!isLogin && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4 overflow-hidden">
                                            <Button type="button" variant="outline" className="w-full h-9 text-xs border-dashed border-unity-saffron text-unity-saffron hover:bg-orange-50" onClick={() => setShowOCR(true)}>
                                                <ScanLine className="mr-2 w-3 h-3" /> Auto-fill with ID
                                            </Button>
                                            <InputField type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} icon={User} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <InputField type="email" placeholder="example@email.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} icon={Mail} />
                                <InputField type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} icon={Lock} />

                                {isLogin && (
                                    <div className="flex justify-end">
                                        <a href="/forgot-password" className="text-xs font-semibold text-unity-saffron hover:underline">Forgot password?</a>
                                    </div>
                                )}

                                <AnimatePresence mode="wait">
                                    {!isLogin && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="grid grid-cols-2 gap-3 overflow-hidden">
                                            <InputField type="text" placeholder="Region" value={formData.region} onChange={e => setFormData({ ...formData, region: e.target.value })} icon={MapPin} />
                                            <InputField type="text" placeholder="Language" value={formData.language} onChange={e => setFormData({ ...formData, language: e.target.value })} icon={Globe} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <Button className="w-full h-11 bg-gray-900 hover:bg-black text-white rounded-lg shadow-lg text-sm font-semibold tracking-wide transition-all active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin w-5 h-5 mx-auto" /> : (isLogin ? 'Sign In' : 'Sign Up')}
                                </Button>
                            </form>

                            <div className="my-6 flex items-center gap-3">
                                <div className="h-px bg-gray-200 flex-1" />
                                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Or</span>
                                <div className="h-px bg-gray-200 flex-1" />
                            </div>

                            <div className="space-y-4 text-center">
                                <button type="button" onClick={() => window.location.href = "http://localhost:5001/auth/google"} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                                    Google Account
                                </button>
                                <p className="text-sm text-gray-500">
                                    {isLogin ? "New here?" : "Joined us before?"}
                                    <button onClick={() => setIsLogin(!isLogin)} className="ml-1.5 font-bold text-unity-saffron hover:underline">
                                        {isLogin ? 'Create an account' : 'Log in'}
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </TiltCard>
            </motion.div>

            <OCRModal isOpen={showOCR} onClose={() => setShowOCR(false)} onScanComplete={handleOCRComplete} />
        </div>
    );
};

export default Auth;
