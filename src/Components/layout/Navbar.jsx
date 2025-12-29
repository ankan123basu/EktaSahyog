import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import LiquidChrome from '../ui/LiquidChrome';
import logoImage from '../../Images/unity_theme.png';
import { useCart } from '../../context/CartContext';
import CartDrawer from '../features/CartDrawer';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { cartCount, setIsCartOpen } = useCart();

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const isAdmin = user?.email === 'admin@ektasahyog.com';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem('user')));
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('user-login', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('user-login', handleStorageChange);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.dispatchEvent(new Event('user-login'));
        navigate('/auth');
    };

    const navLinks = [
        { name: 'Marketplace', path: '/marketplace' },
        { name: 'Projects', path: '/projects' },
        { name: 'Stories', path: '/stories' },
        { name: 'Culture', path: '/culture' },
        { name: 'Games', path: '/games' },
        { name: 'Hotspots', path: '/hotspots' },
        { name: 'Unity Council', path: '/council' },
        { name: 'Chat', path: '/chat' },
        { name: 'About Us', path: '/about' },
        ...(isAdmin ? [
            { name: 'Map', path: '/map' },
            { name: 'Dashboard', path: '/dashboard' }
        ] : []),
    ];

    return (
        <>
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-unity-dark/40 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
                {/* Liquid Chrome Background for Navbar */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                    <LiquidChrome
                        baseColor={[0.1, 0.1, 0.1]}
                        speed={0.2}
                        amplitude={0.1}
                        interactive={false}
                    />
                </div>

                <div className="w-full px-6 md:px-12 relative z-10">
                    <div className="flex items-center justify-between h-20 gap-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group shrink-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-unity-saffron shadow-[0px_0px_10px_rgba(245,158,11,0.5)] group-hover:shadow-[0px_0px_15px_rgba(245,158,11,0.8)] transition-all">
                                <img src={logoImage} alt="EktaSahyog Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-white font-display text-lg tracking-wider hidden sm:block">
                                EKTA<span className="text-unity-saffron">SAHYOG</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center space-x-6">
                            {/* Standard Links */}
                            {[
                                { name: 'Marketplace', path: '/marketplace' },
                                { name: 'Projects', path: '/projects' },
                                { name: 'Stories', path: '/stories' },
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors duration-300 uppercase tracking-wide whitespace-nowrap ${location.pathname === link.path
                                        ? 'text-unity-saffron'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Discover Dropdown */}
                            <div className="relative group" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
                                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wide transition-colors py-2">
                                    <span>Discover</span>
                                    <ChevronDown size={14} className="group-hover:text-unity-saffron transition-colors" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top">
                                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col gap-1">
                                        {[
                                            { name: 'Culture Hub', path: '/culture' },
                                            { name: 'Arcade Games', path: '/games' },
                                            { name: 'Cultural Hotspots', path: '/hotspots' },
                                            { name: 'Unity Council', path: '/council' },
                                            { name: 'Metaverse (Beta)', path: '/metaverse' }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className={`block px-4 py-2 text-sm rounded-lg transition-colors ${location.pathname === item.path
                                                    ? 'bg-white/10 text-unity-saffron'
                                                    : item.highlight
                                                        ? 'text-unity-saffron hover:bg-unity-saffron/10'
                                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Connect Dropdown (Chat + Video) */}
                            <div className="relative group">
                                <button className="flex items-center space-x-1 text-sm font-medium text-gray-300 hover:text-white uppercase tracking-wide transition-colors py-2">
                                    <span>Connect</span>
                                    <ChevronDown size={14} className="group-hover:text-unity-saffron transition-colors" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top">
                                    <div className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col gap-1">
                                        {[
                                            { name: '💬 Text Chat', path: '/chat', desc: 'Multi-language messaging' },
                                            { name: '📹 Drishti-Milan', path: '/drishti-milan', desc: 'Cultural video calls' }
                                        ].map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.path}
                                                className={`block px-4 py-2 rounded-lg transition-colors ${location.pathname === item.path
                                                    ? 'bg-white/10 text-unity-saffron'
                                                    : item.highlight
                                                        ? 'text-unity-saffron hover:bg-unity-saffron/10'
                                                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                <div className="font-medium text-sm">{item.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Remaining Links */}
                            {[
                                { name: 'About Us', path: '/about' },
                                ...(isAdmin ? [
                                    { name: 'Map', path: '/map' },
                                    { name: 'Dashboard', path: '/dashboard' }
                                ] : []),
                            ].map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`text-sm font-medium transition-colors duration-300 uppercase tracking-wide whitespace-nowrap ${location.pathname === link.path
                                        ? 'text-unity-saffron'
                                        : 'text-gray-300 hover:text-white'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>

                        {/* Right Side Actions */}
                        <div className="hidden md:flex items-center gap-6">
                            {/* Cart Icon - Only for logged in users */}
                            {user && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <ShoppingBag size={24} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-unity-saffron text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-unity-dark">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-400 max-w-[100px] truncate" title={user.name}>Hi, {user.name}</span>
                                    <Button variant="outline" size="sm" onClick={handleLogout} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                        Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <Link to="/auth">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <Button variant="ghost" size="sm" className="hover:bg-white/10">Login</Button>
                                        </motion.div>
                                    </Link>
                                    <Link to="/auth">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            animate={{
                                                boxShadow: ["0px 0px 0px rgba(255,153,51,0)", "0px 0px 10px rgba(255,153,51,0.3)", "0px 0px 0px rgba(255,153,51,0)"]
                                            }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <Button variant="accent" size="sm" className="shadow-lg shadow-orange-500/20">Join Now</Button>
                                        </motion.div>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="flex md:hidden items-center gap-4">
                            {user && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                                >
                                    <ShoppingBag size={24} />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-unity-saffron text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-unity-dark">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="text-gray-300 hover:text-white p-2"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-unity-dark border-b border-white/10 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-6 space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-3 py-2 text-base font-medium rounded-md ${location.pathname === link.path
                                            ? 'text-unity-saffron bg-white/5'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-4 flex flex-col space-y-3 border-t border-white/10 mt-2">
                                    {user ? (
                                        <Button variant="outline" onClick={handleLogout} className="w-full justify-start text-red-400 border-red-500/50">
                                            Logout
                                        </Button>
                                    ) : (
                                        <>
                                            <Link to="/auth" onClick={() => setIsOpen(false)}>
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Button variant="ghost" className="w-full justify-start">Login</Button>
                                                </motion.div>
                                            </Link>
                                            <Link to="/auth" onClick={() => setIsOpen(false)}>
                                                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                    <Button variant="accent" className="w-full">Join Now</Button>
                                                </motion.div>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <CartDrawer />
        </>
    );
};

export default Navbar;
