import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, AlertTriangle, BookOpen, XCircle } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

// Game Constants
const RINGS = 7; // 0 (Center) to 6 (Outer)
const SECTORS = 12; // 12 Radial sectors (clock positions)

const Chakravyuha = () => {
    const navigate = useNavigate();

    // State
    const [playerPos, setPlayerPos] = useState({ ring: 6, sector: 0 }); // Start outer
    const [enemies, setEnemies] = useState([]);
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [won, setWon] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // Initialize Level
    useEffect(() => {
        startLevel(1);
    }, []);

    const startLevel = (lvl) => {
        setGameOver(false);
        setWon(false);
        setLevel(lvl);

        // Random Start Position on Outer Ring
        const startSector = Math.floor(Math.random() * SECTORS);
        setPlayerPos({ ring: 6, sector: startSector });

        // Spawn Enemies based on Level
        // Enemies patrol specific rings
        const newEnemies = [];
        const enemyCount = 2 + lvl; // Level 1: 3 enemies, Lvl 2: 4...

        for (let i = 0; i < enemyCount; i++) {
            newEnemies.push({
                id: i,
                ring: Math.floor(Math.random() * 5) + 1, // Rings 1-5 (avoid 0 and 6 initially)
                sector: Math.floor(Math.random() * SECTORS),
                speed: 1000 - (lvl * 100), // Faster each level
                direction: Math.random() > 0.5 ? 1 : -1
            });
        }
        setEnemies(newEnemies);
    };

    // Enemy Movement Loop
    useEffect(() => {
        if (gameOver || won) return;

        const moveEnemies = () => {
            setEnemies(prev => prev.map(enemy => ({
                ...enemy,
                sector: (enemy.sector + enemy.direction + SECTORS) % SECTORS
            })));
        };

        const interval = setInterval(moveEnemies, 1000 - (level * 50)); // Global tick for simplicity or individual?
        // Let's use global tick.
        return () => clearInterval(interval);
    }, [level, gameOver, won]);

    // Collision Detection
    useEffect(() => {
        if (gameOver || won) return;

        // Check if player touched enemy
        const hit = enemies.some(e => e.ring === playerPos.ring && e.sector === playerPos.sector);
        if (hit) {
            setGameOver(true);
        }

        // Check Win (Reach Center: Ring 0)
        if (playerPos.ring === 0) {
            setWon(true);
            setScore(prev => prev + 1000 * level);
            awardPoints(1000 * level);
        }
    }, [playerPos, enemies, gameOver, won, level]);

    const awardPoints = async (points) => {
        if (!user) return;
        try {
            await axios.post('http://localhost:5001/games/update-score', {
                userId: user._id,
                points: points
            });
        } catch (err) {
            console.error("Error awarding points:", err);
        }
    };

    // Player Movement
    const handleKeyDown = useCallback((e) => {
        if (gameOver || won) return;

        setPlayerPos(prev => {
            let newRing = prev.ring;
            let newSector = prev.sector;

            switch (e.key) {
                case 'ArrowUp':
                    // Move Inwards
                    if (newRing > 0) newRing--;
                    break;
                case 'ArrowDown':
                    // Move Outwards
                    if (newRing < 6) newRing++;
                    break;
                case 'ArrowLeft':
                    // Move CCW
                    newSector = (newSector - 1 + SECTORS) % SECTORS;
                    break;
                case 'ArrowRight':
                    // Move CW
                    newSector = (newSector + 1) % SECTORS;
                    break;
                default: return prev;
            }
            return { ring: newRing, sector: newSector };
        });
    }, [gameOver, won]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Mobile Controls
    const move = (dir) => {
        const event = { key: dir };
        handleKeyDown(event);
    };

    // Rendering Helpers
    const getPolarCoords = (ring, sector) => {
        const radius = (ring / 6) * 45; // 45% max radius
        const angle = (sector / SECTORS) * 2 * Math.PI - Math.PI / 2; // Start at top
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return { x, y };
    };

    const [showRules, setShowRules] = useState(false);

    return (
        <div className="min-h-screen pt-24 px-4 flex flex-col items-center relative bg-unity-dark overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/60 to-unity-dark" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mb-4 flex items-center justify-between px-4">
                <Button variant="ghost" onClick={() => navigate('/games')} className="z-10">
                    <ArrowLeft className="mr-2" /> Back
                </Button>

                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-500 w-full pointer-events-none drop-shadow-sm">
                    Chakravyuha
                </h1>

                <div className="flex gap-2 z-10">
                    <Button variant="outline" onClick={() => setShowRules(true)}>
                        <BookOpen className="mr-2 w-4 h-4" /> Rules
                    </Button>
                    <Button variant="outline" onClick={() => startLevel(1)}>
                        <RefreshCw className="mr-2 w-4 h-4" /> Restart
                    </Button>
                </div>
            </div>

            {/* Rules Modal */}
            <AnimatePresence>
                {showRules && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <div className="bg-unity-dark border border-white/20 p-6 rounded-2xl max-w-md w-full shadow-2xl relative">
                            <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                                <XCircle />
                            </button>
                            <h2 className="text-2xl font-bold text-unity-saffron mb-4">How to Play</h2>
                            <ul className="text-gray-300 space-y-2 list-disc list-inside text-sm">
                                <li><strong>Goal:</strong> Reach the center (Green Zone) of the Labyrinth.</li>
                                <li><strong>Controls:</strong>
                                    <ul className="pl-6 list-square mt-1">
                                        <li><strong>Arrow Up/Down:</strong> Move Inner/Outer Rings.</li>
                                        <li><strong>Arrow Left/Right:</strong> Move along the current Ring.</li>
                                    </ul>
                                </li>
                                <li><strong>Enemies:</strong> Red dots are enemy warriors. Avoid them!</li>
                                <li>Win levels to score points.</li>
                            </ul>
                            <Button className="w-full mt-6" onClick={() => setShowRules(false)}>Got it!</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Game Status */}
            <div className="relative z-10 text-white mb-4 font-mono">
                LEVEL: <span className="text-unity-saffron">{level}</span> | SCORE: <span className="text-unity-emerald">{score}</span>
            </div>

            {/* Game Area */}
            <div className="relative w-full max-w-[600px] aspect-square bg-black/40 rounded-full border-4 border-white/10 shadow-2xl overflow-hidden backdrop-blur-sm p-4">

                {/* SVG Render Layer */}
                <div className="w-full h-full relative">
                    {/* Rings */}
                    {[6, 5, 4, 3, 2, 1].map(r => (
                        <div
                            key={`ring-${r}`}
                            className="absolute rounded-full border border-white/10 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all"
                            style={{
                                width: `${(r / 6) * 100}%`,
                                height: `${(r / 6) * 100}%`
                            }}
                        />
                    ))}
                    {/* Center Safe Zone */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[10%] h-[10%] bg-unity-emerald/20 rounded-full border border-unity-emerald animate-pulse flex items-center justify-center">
                        <Trophy className="w-4 h-4 text-unity-emerald" />
                    </div>

                    {/* Sectors (Lines) */}
                    {[...Array(SECTORS)].map((_, i) => (
                        <div
                            key={`line-${i}`}
                            className="absolute top-1/2 left-1/2 w-full h-[1px] bg-white/5 origin-left"
                            style={{ transform: `rotate(${(i / SECTORS) * 360 - 90}deg)` }}
                        />
                    ))}

                    {/* Logic Render: Player & Enemies */}
                    {/* We use percentage based absolute positioning */}

                    {/* Player */}
                    {(() => {
                        const { x, y } = getPolarCoords(playerPos.ring, playerPos.sector);
                        return (
                            <motion.div
                                layoutId="player"
                                className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-unity-saffron rounded-full border-2 border-white z-20 shadow-[0_0_15px_rgba(245,158,11,0.8)] flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                <span className="text-[10px] text-black font-bold">You</span>
                            </motion.div>
                        );
                    })()}

                    {/* Enemies */}
                    {enemies.map(e => {
                        const { x, y } = getPolarCoords(e.ring, e.sector);
                        return (
                            <motion.div
                                key={`enemy-${e.id}`}
                                className="absolute w-5 h-5 sm:w-6 sm:h-6 bg-red-600 rounded-full border border-red-400 z-10 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 linear"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                            </motion.div>
                        );
                    })}
                </div>

                {/* Overlays */}
                <AnimatePresence>
                    {gameOver && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                            <h2 className="text-4xl font-display font-bold text-red-500 mb-4">CAUGHT!</h2>
                            <p className="text-gray-300 mb-6">The labyrinth claimed you.</p>
                            <Button onClick={() => startLevel(1)} variant="accent">Try Again</Button>
                        </motion.div>
                    )}
                    {won && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
                            <h2 className="text-4xl font-display font-bold text-unity-emerald mb-4">ESCAPED!</h2>
                            <p className="text-gray-300 mb-6">You broke the Chakravyuha!</p>
                            <Button onClick={() => startLevel(level + 1)} variant="accent">Next Level</Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls Info */}
            <div className="relative z-10 mt-8 grid grid-cols-2 gap-4 sm:flex sm:gap-8">
                {/* D-Pad for Mobile */}
                <div className="col-span-2 sm:hidden flex flex-col items-center gap-2 mb-4">
                    <Button variant="outline" onClick={() => move('ArrowUp')}><ArrowLeft className="rotate-90" /></Button>
                    <div className="flex gap-8">
                        <Button variant="outline" onClick={() => move('ArrowLeft')}><ArrowLeft /></Button>
                        <Button variant="outline" onClick={() => move('ArrowRight')}><ArrowLeft className="rotate-180" /></Button>
                    </div>
                    <Button variant="outline" onClick={() => move('ArrowDown')}><ArrowLeft className="-rotate-90" /></Button>
                </div>

                <p className="hidden sm:block text-gray-400 text-sm border border-white/10 p-4 rounded-lg bg-black/40">
                    Use Arrow Keys to Move<br />
                    <span className="text-unity-saffron">UP/DOWN</span>: Change Ring (In/Out)<br />
                    <span className="text-unity-saffron">LEFT/RIGHT</span>: Move Circularly
                </p>
            </div>
            <p className="text-xs text-gray-500 mt-4 relative z-10">Goal: Reach the Center (Green Zone). Avoid Red Warriors.</p>
        </div>
    );
};

export default Chakravyuha;
