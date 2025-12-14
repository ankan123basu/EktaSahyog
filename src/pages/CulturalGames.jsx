import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Gift, Palette, Music, Map as MapIcon, Sparkles, Star, ArrowRight, Grid, Box } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import Ballpit from '../Components/ui/Ballpit';
import axios from 'axios';
import bg1 from '../Images/wmremove-transformed.png';
import { useNavigate } from 'react-router-dom';

const CulturalGames = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [score, setScore] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [isSpinning, setIsSpinning] = useState(false);
    const [wheelResult, setWheelResult] = useState(null);
    const wheelRef = useRef(null);

    const wheelCategories = [
        { label: "Ancient Wisdom", color: "#FF9933", points: 50, icon: <Palette /> },
        { label: "Raga Rhythm", color: "#138808", points: 20, icon: <Music /> },
        { label: "Try Again", color: "#ef4444", points: 0, icon: <XIcon /> },
        { label: "Royal Treasury", color: "#FFD700", points: 500, icon: <Trophy /> },
        { label: "Mythic Tales", color: "#3b82f6", points: 30, icon: <BookIcon /> },
        { label: "Weaver's Knot", color: "#ec4899", points: 40, icon: <ShirtIcon /> },
    ];

    useEffect(() => {
        fetchScore();
        fetchLeaderboard();
    }, []);

    const fetchScore = async () => {
        if (!user) return;
        try {
            const res = await axios.get(`http://localhost:5001/games/score/${user._id}`);
            setScore(res.data);
        } catch (err) {
            console.error("Error fetching score:", err);
        }
    };

    const fetchLeaderboard = async () => {
        try {
            const res = await axios.get('http://localhost:5001/games/leaderboard');
            setLeaderboard(res.data);
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
        }
    };

    const spinWheel = async () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setWheelResult(null);

        // Random rotation
        const randomDeg = Math.floor(5000 + Math.random() * 5000);
        const wheel = wheelRef.current;
        wheel.style.transition = 'all 5s cubic-bezier(0.25, 0.1, 0.25, 1)';
        wheel.style.transform = `rotate(${randomDeg}deg)`;

        // Calculate result
        setTimeout(async () => {
            setIsSpinning(false);
            wheel.style.transition = 'none';
            const actualDeg = randomDeg % 360;
            wheel.style.transform = `rotate(${actualDeg}deg)`;

            // Determine segment (simplified logic)
            const segmentAngle = 360 / wheelCategories.length;
            const index = Math.floor((360 - actualDeg) / segmentAngle) % wheelCategories.length;
            const result = wheelCategories[index];

            setWheelResult(result);

            if (result.points > 0) {
                try {
                    await axios.post('http://localhost:5001/games/spin-wheel', {
                        userId: user._id,
                        points: result.points
                    });
                    fetchScore();
                    fetchLeaderboard();
                } catch (err) {
                    console.error("Error updating score:", err);
                }
            }
        }, 5000);
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative bg-unity-dark overflow-hidden">
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            <BackgroundBeams />

            {/* Header */}
            <div className="relative z-10 mb-12 max-w-7xl mx-auto">
                <div className="text-center md:text-left mb-6">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-4">
                        CULTURAL ARCADE
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-6">
                    <div className="max-w-2xl">
                        <p className="text-xl text-gray-300">
                            Play, Learn, and Win! Explore India's heritage through interactive games and earn points.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto space-y-12 relative z-10">

                {/* Top Section: Spin Wheel & Leaderboard */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]"> {/* Fixed height for alignment */}

                    {/* Left: Spin Wheel */}
                    <div className="lg:col-span-2 h-full">
                        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-xl border border-white/10 relative overflow-hidden h-full flex flex-col items-center justify-center">
                            <div className="absolute inset-0 z-0 opacity-20">
                                <Ballpit count={20} gravity={0.5} friction={0.9} followCursor={false} colors={[0xff9933, 0xffffff, 0x138808]} />
                            </div>

                            <div className="relative z-10 flex flex-col items-center">
                                <h2 className="text-3xl font-display text-white mb-6 flex items-center gap-2">
                                    <Sparkles className="text-unity-saffron" /> FORTUNE WHEEL
                                </h2>

                                <div className="relative w-72 h-72 md:w-80 md:h-80 mb-6">
                                    {/* Pointer */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 z-20 w-8 h-8 bg-white rotate-45 border-4 border-unity-dark shadow-xl" />

                                    {/* Wheel */}
                                    <div
                                        ref={wheelRef}
                                        className="w-full h-full rounded-full border-8 border-white/10 shadow-2xl relative overflow-hidden transition-transform"
                                        style={{ background: 'conic-gradient(#FF9933 0deg 60deg, #138808 60deg 120deg, #ef4444 120deg 180deg, #FFD700 180deg 240deg, #3b82f6 240deg 300deg, #ec4899 300deg 360deg)' }}
                                    >
                                        {/* Labels (Simplified positioning) */}
                                        {wheelCategories.map((cat, i) => (
                                            <div
                                                key={i}
                                                className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 flex items-start justify-center pt-4 font-bold text-white text-xs sm:text-sm uppercase tracking-wider"
                                                style={{ transform: `rotate(${i * 60 + 30}deg)` }}
                                            >
                                                <span className="bg-black/20 px-2 py-1 rounded backdrop-blur-sm">{cat.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Center Knob */}
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center border-4 border-unity-dark z-10">
                                        <Gift className="text-unity-dark w-8 h-8" />
                                    </div>
                                </div>

                                <Button
                                    variant="accent"
                                    size="lg"
                                    onClick={spinWheel}
                                    disabled={isSpinning}
                                    className="px-8 py-4 text-lg shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                                >
                                    {isSpinning ? "Spinning..." : "SPIN & WIN"}
                                </Button>

                                <AnimatePresence>
                                    {wheelResult && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute bottom-4 bg-black/80 backdrop-blur text-center p-3 rounded-lg border border-white/20 z-20"
                                        >
                                            <h3 className="text-xl font-bold text-white mb-1">{wheelResult.label}</h3>
                                            <p className="text-unity-saffron font-bold">+{wheelResult.points} Points!</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Right: Leaderboard & Stats */}
                    <div className="flex flex-col gap-4 h-full overflow-hidden">
                        {/* User Stats (Fixed) */}
                        <div className="bg-unity-dark/50 border border-white/10 p-6 rounded-xl backdrop-blur-md flex-shrink-0">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-unity-saffron to-unity-emerald p-[2px]">
                                    <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-2xl font-bold text-white">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg">{user?.name || "Guest User"}</h3>
                                    <p className="text-unity-saffron font-bold text-xl flex items-center gap-1">
                                        <Trophy className="w-4 h-4" /> {score?.totalPoints || 0} PTS
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" className="w-full" onClick={() => navigate('/marketplace')}>Go to Marketplace</Button>
                        </div>

                        {/* Leaderboard (Scrollable) */}
                        <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-unity-saffron scrollbar-track-transparent">
                            <h3 className="text-xl font-display text-white mb-4 flex items-center justify-center gap-2 sticky top-0 bg-[#0d0d0d] z-10 py-2 border-b border-white/10">
                                <Trophy className="text-yellow-500" /> TOP PLAYERS
                            </h3>
                            <div className="space-y-4">
                                {leaderboard.map((player, i) => (
                                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-700 text-white' : 'bg-white/10 text-gray-400'}`}>
                                                {i + 1}
                                            </span>
                                            <span className="text-gray-200 font-medium">{player.userName}</span>
                                        </div>
                                        <span className="text-unity-emerald font-bold">{player.totalPoints}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Games Grid (Full Width, Side-by-Side) */}
                <div>
                    <h2 className="text-3xl font-display text-white mb-8 border-l-4 border-unity-saffron pl-4">Explore More Games</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[
                            { title: "Chaturanga", desc: "Ancient strategy game. Capture the King!", icon: <Grid className="w-6 h-6 text-yellow-400" />, color: "#eab308", path: "/games/chess" },
                            { title: "Varna Vyuha", desc: "Test your logic in this color pattern puzzle.", icon: <Box className="w-6 h-6 text-purple-400" />, color: "#a855f7", path: "/games/rubiks" },
                            { title: "Moksha Patam", desc: "The original Snakes & Ladders. Race to Moksha!", icon: <Trophy className="w-6 h-6 text-green-400" />, color: "#22c55e", path: "/games/moksha" },
                            { title: "Pallanguzhi", desc: "Traditional Mancala. Capture seeds!", icon: <Grid className="w-6 h-6 text-red-500" />, color: "#ef4444", path: "/games/pallanguzhi" },
                            { title: "Ganjifa Legends", desc: "Memory match with Mughal art.", icon: <Palette className="w-6 h-6 text-orange-400" />, color: "#f97316", path: "/games/ganjifa" },
                            { title: "Jnana Yatra", desc: "Heritage Quiz. Test your wisdom!", icon: <BookIcon className="w-6 h-6 text-blue-400" />, color: "#3b82f6", path: "/games/quiz" },
                            { title: "Aadu Puli Aattam", desc: "Goats vs Tigers. Strategy!", icon: <Grid className="w-6 h-6 text-red-500" />, color: "#ef4444", path: "/games/aadupuli" },
                            { title: "Chakravyuha", desc: "Break the labyrinth formation!", icon: <MapIcon className="w-6 h-6 text-cyan-400" />, color: "#06b6d4", path: "/games/chakravyuha" },
                        ].map((game, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => game.path && navigate(game.path)}
                                className={`bg-white/5 border border-white/10 p-6 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group flex flex-col justify-between ${!game.path ? 'opacity-70' : ''}`}
                            >
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <div className={`p-3 rounded-lg bg-opacity-20`} style={{ backgroundColor: `${game.color}33` }}>
                                            {game.icon}
                                        </div>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider group-hover:text-white transition-colors">
                                            {game.path ? "Play Now" : "Coming Soon"}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{game.title}</h3>
                                    <p className="text-gray-400 text-sm">{game.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper Icons
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>;
const BookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const ShirtIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.38 3.4a2 2 0 0 0-1.2-1.28l-3.11-1.2a2 2 0 0 0-1.34 0l-3.11 1.2a2 2 0 0 1-1.34 0l-3.11-1.2a2 2 0 0 0-1.34 0l-3.11 1.2a2 2 0 0 0-1.2 1.28l.6 3.18a2 2 0 0 0 .59 1.14l9.4 9.4a2 2 0 0 0 2.83 0l9.4-9.4a2 2 0 0 0 .6-1.14z" /></svg>;

export default CulturalGames;
