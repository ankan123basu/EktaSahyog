import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Globe, Users, MessageSquare, ShoppingBag, Map as MapIcon, BookOpen, Heart, Sparkles, Gamepad2 } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import { Link } from 'react-router-dom';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import ElectricBorder from '../Components/ui/ElectricBorder';
import bg1 from '../Images/wmremove-transformed.png';
import bg2 from '../Images/bg2.jpg';
import bg3 from '../Images/bg3.webp';
import Ballpit from '../Components/ui/Ballpit';
import LiquidChrome from '../Components/ui/LiquidChrome';
import VariableProximity from '../Components/ui/VariableProximity';

const Landing = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    const [totalUsers, setTotalUsers] = useState(0);

    useEffect(() => {
        fetch('http://localhost:5001/auth/users/count')
            .then(res => res.json())
            .then(data => {
                if (data.count) setTotalUsers(data.count);
            })
            .catch(err => console.error("Error fetching user count:", err));
    }, []);

    const features = [
        {
            icon: <ShoppingBag className="w-8 h-8 text-unity-saffron" />,
            title: "Cultural Marketplace",
            desc: "Buy & sell authentic handicrafts, handlooms, and regional products from artisans across India."
        },
        {
            icon: <MessageSquare className="w-8 h-8 text-unity-emerald" />,
            title: "Universal Chatroom",
            desc: "Talk across India with live translation. Join Global or Regional rooms (e.g., Punjab Room, Kerala Room)."
        },
        {
            icon: <BookOpen className="w-8 h-8 text-unity-coral" />,
            title: "Learn My Culture",
            desc: "Discover food, festivals, and traditions through community-curated knowledge cards that bring India's rich heritage to life."
        },
        {
            icon: <Users className="w-8 h-8 text-unity-indigo" />,
            title: "Unity Projects",
            desc: "Collaborate on cross-state initiatives like 'North-East Silk Awareness' or 'Eco-Friendly Diwali'."
        },
        {
            icon: <Gamepad2 className="w-8 h-8 text-purple-500" />,
            title: "Cultural Arcade",
            desc: "Play heritage-themed games like Chaturanga and Fortune Wheel. Earn points to redeem authentic rewards in the marketplace."
        },
        {
            icon: <Heart className="w-8 h-8 text-pink-500" />,
            title: "Story Exchange",
            desc: "Share 'Voices of Unity' - personal stories, family traditions, and festival memories that celebrate our shared human connection."
        }
    ];

    const floatingTerms = [
        { text: "Punjab", x: "10%", delay: 0, color: "text-orange-400" },
        { text: "Kathakali", x: "85%", delay: 2, color: "text-green-400" },
        { text: "Assam Tea", x: "75%", delay: 4, color: "text-emerald-400" },
        { text: "Pashmina", x: "20%", delay: 1, color: "text-purple-400" },
        { text: "Madhubani", x: "60%", delay: 3, color: "text-red-400" },
        { text: "Rajasthan", x: "5%", delay: 5, color: "text-yellow-500" },
        { text: "Bharatanatyam", x: "90%", delay: 6, color: "text-pink-400" },
        { text: "Warli Art", x: "30%", delay: 7, color: "text-white" },
        { text: "Bengal", x: "50%", delay: 2.5, color: "text-red-500" },
        { text: "Goa", x: "15%", delay: 8, color: "text-cyan-400" },
        { text: "Bandhani", x: "40%", delay: 4.5, color: "text-orange-300" },
        { text: "Tamil Nadu", x: "80%", delay: 9, color: "text-yellow-300" },
    ];

    const containerRef = React.useRef(null);

    const user = JSON.parse(localStorage.getItem('user'));
    const destination = user ? '/marketplace' : '/auth';

    return (
        <div className="min-h-screen pt-20 overflow-hidden relative bg-unity-dark">
            <BackgroundBeams />

            {/* Shared Background Wrapper for Hero and Cultural Showcase */}
            <div className="relative">
                <div className="absolute inset-0 z-0 opacity-[0.70]">
                    <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/40 to-unity-dark" />
                </div>

                {/* Hero Section with Parallax Background */}
                <section ref={containerRef} className="relative px-4 sm:px-6 lg:px-8 pt-10 pb-20 lg:pt-20 lg:pb-32 flex flex-col items-center text-center z-10 min-h-[80vh] justify-center">
                    {/* Falling Diversity Terms (Restricted to Hero) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        {floatingTerms.map((item, i) => (
                            <motion.div
                                key={i}
                                className={`absolute font-display text-2xl md:text-4xl opacity-30 font-bold ${item.color} select-none`}
                                style={{ left: item.x, top: -100 }}
                                animate={{
                                    y: ['0vh', '120vh'],
                                    opacity: [0, 0.5, 0],
                                    rotate: [0, 10, -10, 0]
                                }}
                                transition={{
                                    duration: 15 + (i % 5) * 2,
                                    repeat: Infinity,
                                    delay: item.delay,
                                    ease: "linear"
                                }}
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="max-w-5xl mx-auto space-y-8 relative z-10 flex flex-col items-center"
                    >
                        <div className="mb-8 cursor-default">
                            <VariableProximity
                                label="UNITY IN DIVERSITY"
                                className="text-xl md:text-3xl font-display font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"
                                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                                toFontVariationSettings="'wght' 900, 'opsz' 40"
                                containerRef={containerRef}
                                radius={100}
                                falloff="linear"
                            />
                        </div>

                        <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm animate-pulse-slow">
                            <Sparkles className="w-4 h-4 text-unity-saffron" />
                            <span className="text-sm text-gray-300 font-medium tracking-wide">Fostering Unity & Collaboration</span>
                        </div>

                        <div className="cursor-default">
                            <VariableProximity
                                label="EKTA SAHYOG"
                                className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl"
                                fromFontVariationSettings="'wght' 400, 'opsz' 9"
                                toFontVariationSettings="'wght' 900, 'opsz' 40"
                                containerRef={containerRef}
                                radius={150}
                                falloff="linear"
                            />
                        </div>

                        <div className="cursor-default max-w-4xl mx-auto">
                            <VariableProximity
                                label="One platform where many communities connect, collaborate, and create impact, fostering a vibrant ecosystem of shared culture and heritage. Together, we bridge gaps, empower local artisans, and celebrate the rich tapestry of traditions that make India truly unique."
                                className="text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] font-medium leading-relaxed"
                                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                                toFontVariationSettings="'wght' 700, 'opsz' 40"
                                containerRef={containerRef}
                                radius={100}
                                falloff="linear"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
                            <Link to={destination}>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        y: [0, -10, 0],
                                        boxShadow: ["0px 0px 0px rgba(255,153,51,0)", "0px 0px 20px rgba(255,153,51,0.5)", "0px 0px 0px rgba(255,153,51,0)"]
                                    }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Button variant="accent" size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-gradient-to-r from-[#FF9933] to-[#FF9933]/80 hover:to-[#138808] transition-all duration-500 border-none">
                                        Join the Movement <ArrowRight className="ml-2 w-6 h-6" />
                                    </Button>
                                </motion.div>
                            </Link>

                        </div>
                    </motion.div>
                </section>

                {/* Cultural Showcase Section (New) */}
                <section className="relative py-20 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 100, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                            className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl perspective-1000 group"
                        >
                            <img src={bg3} alt="Diversity" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8">
                                <h3 className="text-3xl font-display text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808]">Celebrate Diversity</h3>
                            </div>
                        </motion.div>
                        <div className="space-y-6">
                            <h2 className="text-4xl md:text-5xl font-display text-white">
                                Discover the <span className="text-unity-emerald">Unseen India</span>
                            </h2>
                            <p className="text-gray-300 text-lg leading-relaxed">
                                From the intricate Madhubani paintings of Bihar to the vibrant Kanchipuram silks of Tamil Nadu.
                                EktaSahyog brings the hidden gems of Indian culture to the forefront.
                            </p>
                            <ul className="space-y-4">
                                {['Direct from Artisans', 'Verified Stories', 'Cross-Cultural Events'].map((item, i) => (
                                    <motion.li
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.2 }}
                                        className="flex items-center text-gray-200"
                                    >
                                        <div className="w-2 h-2 bg-unity-saffron rounded-full mr-3" />
                                        {item}
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            </div>

            {/* Features Grid */}
            <section className="relative px-4 sm:px-6 lg:px-8 py-24 bg-black/10 backdrop-blur-sm z-10 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30">
                    <Ballpit count={30} gravity={0.5} friction={0.9} wallBounce={0.9} followCursor={true} colors={[0xff9933, 0xffffff, 0x138808]} />
                </div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl mb-6 font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808]">
                            6 KADAM, EKTA KI AUR
                        </h2>
                        <div className="h-1.5 w-32 bg-gradient-to-r from-unity-saffron to-unity-emerald mx-auto rounded-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -10, rotate: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="h-full"
                            >
                                <ElectricBorder color={index % 2 === 0 ? "#FF9933" : "#138808"} className="h-full">
                                    <div className="relative h-full bg-unity-dark/60 p-8 rounded-xl backdrop-blur-md overflow-hidden">
                                        {/* Spotlight Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                        <div className="mb-6 p-4 bg-white/5 w-fit rounded-2xl group-hover:scale-110 transition-transform duration-300 border border-white/10">
                                            {feature.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-4 font-display text-sm tracking-widest uppercase">
                                            {feature.title}
                                        </h3>
                                        <p className="text-gray-400 leading-relaxed text-base">
                                            {feature.desc}
                                        </p>
                                    </div>
                                </ElectricBorder>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Floating Testimonials Section - Infinite Marquee */}
            <section className="relative py-32 overflow-hidden bg-black/10">
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/80 to-black/50 z-0" />
                <div className="absolute inset-0 z-0 opacity-30">
                    <Ballpit count={35} gravity={0.2} friction={0.95} wallBounce={0.95} followCursor={true} colors={[0xff9933, 0xffffff, 0x138808]} />
                </div>
                <div className="relative z-10 w-full">
                    <div className="text-center mb-16 px-4">
                        <h2 className="text-3xl md:text-5xl mb-6 font-display font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808]">
                            DIL KI BAAT, DESH KE SAATH
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Real stories from real people connecting across borders.
                        </p>
                    </div>

                    {/* Marquee Container */}
                    <div className="flex overflow-hidden relative w-full mask-gradient-x">
                        <motion.div
                            className="flex gap-8 px-8 w-max"
                            animate={{ x: ["0%", "-50%"] }}
                            transition={{
                                duration: 40,
                                repeat: Infinity,
                                ease: "linear",
                                repeatType: "loop"
                            }}
                        >
                            {/* Duplicate items for seamless loop */}
                            {[...Array(2)].map((_, setIndex) => (
                                <React.Fragment key={setIndex}>
                                    {[
                                        {
                                            name: "Priya Sharma",
                                            role: "Artisan, Rajasthan",
                                            text: "I sold my blue pottery to a family in Kerala through EktaSahyog. It felt like my art traveled further than I ever could.",
                                            color: "border-unity-saffron",
                                            bg: "bg-orange-950/20"
                                        },
                                        {
                                            name: "Rahul Menon",
                                            role: "Student, Kerala",
                                            text: "The 'Learn My Culture' cards helped me understand Bihu. Now I have 3 pen-pals from Assam!",
                                            color: "border-unity-emerald",
                                            bg: "bg-green-950/20"
                                        },
                                        {
                                            name: "Tashi Dorjee",
                                            role: "NGO Lead, Sikkim",
                                            text: "We found volunteers for our eco-project from 5 different states. The Unity Projects feature is a game changer.",
                                            color: "border-unity-coral",
                                            bg: "bg-red-950/20"
                                        },
                                        {
                                            name: "Anjali Gupta",
                                            role: "Chef, Lucknow",
                                            text: "Sharing my Awadhi recipes on the Culture hub connected me with foodies in Gujarat. Food truly has no borders!",
                                            color: "border-unity-saffron",
                                            bg: "bg-yellow-950/20"
                                        },
                                        {
                                            name: "Vikram Singh",
                                            role: "Musician, Punjab",
                                            text: "The Cultural Arcade's music quiz introduced me to Carnatic rhythms. It's inspiring my new fusion track.",
                                            color: "border-purple-500",
                                            bg: "bg-purple-950/20"
                                        }
                                    ].map((testimonial, i) => (
                                        <div
                                            key={`${setIndex}-${i}`}
                                            className="w-[350px] md:w-[450px] flex-shrink-0"
                                        >
                                            <ElectricBorder color={testimonial.color.includes('saffron') ? '#FF9933' : testimonial.color.includes('emerald') ? '#138808' : '#f43f5e'}>
                                                <div className={`p-8 rounded-2xl backdrop-blur-md border border-white/5 hover:border-white/20 transition-all h-full flex flex-col justify-between group hover:scale-[1.02] duration-300 ${testimonial.bg}`}>
                                                    <div className="relative">
                                                        <div className="absolute -top-4 -left-4 text-4xl opacity-20 font-serif">"</div>
                                                        <p className="text-gray-200 italic mb-6 text-lg leading-relaxed relative z-10 pl-2">
                                                            {testimonial.text}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-black ${testimonial.color.includes('saffron') ? 'bg-unity-saffron' : testimonial.color.includes('emerald') ? 'bg-unity-emerald' : 'bg-unity-coral'}`}>
                                                            {testimonial.name[0]}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-bold font-display text-sm">{testimonial.name}</h4>
                                                            <p className={`text-xs uppercase tracking-wider ${testimonial.color.includes('saffron') ? 'text-unity-saffron' : testimonial.color.includes('emerald') ? 'text-unity-emerald' : 'text-unity-coral'}`}>
                                                                {testimonial.role}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </ElectricBorder>
                                        </div>
                                    ))}
                                </React.Fragment>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Detailed Info / CTA Section */}
            <section className="relative py-24 bg-unity-indigo/10 border-y border-white/5 overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-30">
                    <LiquidChrome speed={0.3} amplitude={0.4} interactive={true} />
                </div>
                <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl text-white font-display mb-8">
                        READY TO BRIDGE THE GAP?
                    </h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                        Join {totalUsers > 0 ? totalUsers.toLocaleString() : "10,000"}+ Indians who are already sharing resources, learning new cultures, and building a stronger, more united nation.
                    </p>
                    <Link to={destination}>
                        <Button variant="accent" size="lg" className="text-xl px-12 py-8 rounded-full shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:shadow-[0_0_60px_rgba(245,158,11,0.6)] hover:scale-105 transition-all">
                            Start Your Journey Now
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
