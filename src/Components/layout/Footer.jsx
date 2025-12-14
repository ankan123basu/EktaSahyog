import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Heart, Mail, MapPin, Phone, Github, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import LiquidChrome from '../ui/LiquidChrome';
import logoImage from '../../Images/unity_theme.png';
import axios from 'axios';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubscribe = async () => {
        if (!email) return;
        setIsLoading(true);
        try {
            await axios.post('http://localhost:5001/newsletter/subscribe', { email });
            setMessage('Subscribed successfully! 📧');
            setEmail('');
        } catch (err) {
            console.error(err);
            setMessage('Failed to subscribe. Try again.');
        } finally {
            setIsLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    return (
        <footer className="bg-unity-dark border-t border-white/10 pt-16 pb-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <LiquidChrome speed={0.2} amplitude={0.3} interactive={false} />
            </div>
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-unity-indigo/20 rounded-full blur-[128px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-unity-emerald/10 rounded-full blur-[128px] translate-y-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-unity-saffron shadow-[0px_0px_10px_rgba(245,158,11,0.5)] group-hover:shadow-[0px_0px_15px_rgba(245,158,11,0.8)] transition-all">
                                <img src={logoImage} alt="EktaSahyog Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-white font-display text-lg tracking-wider">
                                EKTA<span className="text-unity-saffron">SAHYOG</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            India's first unity platform. Connecting communities, fostering collaboration, and multiplying impact across every state and union territory.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://github.com/ankan123basu" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-unity-saffron hover:text-black transition-all duration-300">
                                <Github size={18} />
                            </a>
                            <a href="https://www.linkedin.com/in/ankanbasu10/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300">
                                <Linkedin size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-blue-400 hover:text-white transition-all duration-300">
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-display text-sm tracking-wider mb-6">PLATFORM</h3>
                        <ul className="space-y-4">
                            <li><Link to="/marketplace" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Marketplace</Link></li>
                            <li><Link to="/projects" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Unity Projects</Link></li>
                            <li><Link to="/map" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Diversity Map</Link></li>
                            <li><Link to="/stories" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Story Exchange</Link></li>
                            <li><Link to="/culture" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Learn My Culture</Link></li>
                        </ul>
                    </div>

                    {/* Resources & Unity */}
                    <div>
                        <h3 className="text-white font-display text-sm tracking-wider mb-6">RESOURCES</h3>
                        <ul className="space-y-4">
                            <li>
                                <a href="https://ekbharat.gov.in/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm flex items-center gap-2">
                                    Ek Bharat Shreshtha Bharat <span className="text-xs bg-white/10 px-1 rounded">GOV</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://www.indiaculture.gov.in/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm flex items-center gap-2">
                                    Ministry of Culture <span className="text-xs bg-white/10 px-1 rounded">GOV</span>
                                </a>
                            </li>
                            <li>
                                <a href="https://en.wikipedia.org/wiki/Culture_of_India" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">
                                    Indian Culture (Wiki)
                                </a>
                            </li>
                            <li><Link to="/about" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Platform Guidelines</Link></li>
                            <li><Link to="/about" className="text-gray-400 hover:text-unity-saffron transition-colors text-sm">Safety & Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-display text-sm tracking-wider mb-6">STAY CONNECTED</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Join our weekly newsletter for impact stories and unity updates.
                        </p>
                        <div className="flex flex-col space-y-3">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-unity-saffron transition-colors"
                            />
                            <Button variant="accent" className="w-full" onClick={handleSubscribe} disabled={isLoading}>
                                {isLoading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                                Subscribe
                            </Button>
                            {message && <p className="text-xs text-unity-emerald mt-2">{message}</p>}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2024 EktaSahyog. Made with <Heart className="w-4 h-4 text-unity-coral inline mx-1 animate-pulse" /> for India.
                    </p>
                    <div className="flex space-x-6 text-sm text-gray-500">
                        <Link to="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link to="/about" className="hover:text-white transition-colors">Terms of Service</Link>
                        <Link to="/about" className="hover:text-white transition-colors">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
