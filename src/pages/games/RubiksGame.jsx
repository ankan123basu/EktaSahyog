import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Target, Grid, BookOpen, XCircle } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

const VarnaVyuha = () => {
    const navigate = useNavigate();
    const [grid, setGrid] = useState([]);
    const [targetPattern, setTargetPattern] = useState([]);
    const [moves, setMoves] = useState(0);
    const [colors] = useState(['#FF9933', '#FFFFFF', '#138808', '#0000FF']);
    const [winner, setWinner] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const gridSize = 3;

    useEffect(() => {
        startNewGame();
    }, []);

    const generatePattern = () => {
        const pattern = [];
        for (let i = 0; i < gridSize; i++) {
            const row = [];
            for (let j = 0; j < gridSize; j++) {
                row.push(colors[Math.floor(Math.random() * colors.length)]);
            }
            pattern.push(row);
        }
        return pattern;
    };

    const startNewGame = () => {
        setWinner(false);
        setMoves(0);
        const newTarget = generatePattern();
        setTargetPattern(newTarget);
        setGrid(generatePattern());
    };

    const handleCellClick = (r, c) => {
        if (winner) return;

        setMoves(prev => prev + 1);
        const newGrid = grid.map(row => [...row]);

        const toggleColor = (row, col) => {
            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                const currentColorIndex = colors.indexOf(newGrid[row][col]);
                const nextColorIndex = (currentColorIndex + 1) % colors.length;
                newGrid[row][col] = colors[nextColorIndex];
            }
        };

        toggleColor(r, c);
        toggleColor(r - 1, c);
        toggleColor(r + 1, c);
        toggleColor(r, c - 1);
        toggleColor(r, c + 1);

        setGrid(newGrid);
        checkWin(newGrid);
    };

    const checkWin = async (currentGrid) => {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (currentGrid[i][j] !== targetPattern[i][j]) return;
            }
        }

        setWinner(true);
        await awardPoints();
    };

    const awardPoints = async () => {
        if (!user) return;
        try {
            await axios.post('http://localhost:5001/games/update-score', {
                userId: user._id,
                points: 1000
            });
        } catch (err) {
            console.error("Error awarding points:", err);
        }
    };

    const [showRules, setShowRules] = useState(false);

    return (
        <div className="min-h-screen pt-24 px-4 flex flex-col items-center relative bg-unity-dark overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/60 to-unity-dark" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mb-8 flex items-center justify-between px-4">
                <Button variant="ghost" onClick={() => navigate('/games')} className="z-10">
                    <ArrowLeft className="mr-2" /> Back to Arcade
                </Button>

                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-500 w-full pointer-events-none">
                    Varna Vyuha
                </h1>

                <div className="flex items-center gap-4 z-10">
                    <span className="text-white font-mono bg-white/10 px-3 py-1 rounded hidden sm:inline-block">Moves: {moves}</span>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => setShowRules(true)}>
                            <BookOpen className="mr-2 w-4 h-4" /> Rules
                        </Button>
                        <Button variant="outline" onClick={startNewGame}>
                            <RefreshCw className="mr-2" /> <span className="hidden sm:inline">Reset</span>
                        </Button>
                    </div>
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
                                <li><strong>Goal:</strong> Match 'Your Grid' to the 'Target Pattern'.</li>
                                <li><strong>Mechanic:</strong> Clicking a cell toggles the color of:
                                    <ul className="pl-6 list-square mt-1">
                                        <li>The clicked cell</li>
                                        <li>Top, Bottom, Left, and Right neighbors</li>
                                    </ul>
                                </li>
                                <li><strong>Colors:</strong> It cycles through Saffron → White → Green → Blue.</li>
                                <li>Plan your moves to replicate the Target!</li>
                            </ul>
                            <Button className="w-full mt-6" onClick={() => setShowRules(false)}>Got it!</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <div className="bg-unity-dark border-2 border-unity-emerald p-8 rounded-2xl text-center max-w-md shadow-[0_0_50px_rgba(16,185,129,0.5)]">
                            <Trophy className="w-20 h-20 text-emerald-400 mx-auto mb-4" />
                            <h2 className="text-4xl font-display font-bold text-white mb-2">Pattern Matched!</h2>
                            <p className="text-xl text-unity-saffron font-bold mb-6">+1000 Points Awarded</p>
                            <Button variant="accent" size="lg" onClick={startNewGame}>Next Level</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                {/* Target */}
                <div className="flex flex-col items-center justify-center bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                        <Target className="text-red-400" /> Target
                    </h3>
                    <div className="grid grid-cols-3 gap-2 p-2 bg-black/40 rounded-lg">
                        {targetPattern.map((row, r) => (
                            row.map((color, c) => (
                                <div
                                    key={`target-${r}-${c}`}
                                    className="w-12 h-12 rounded-md shadow-inner border border-white/5"
                                    style={{ backgroundColor: color }}
                                />
                            ))
                        ))}
                    </div>
                </div>

                {/* Player */}
                <div className="flex flex-col items-center justify-center bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
                    <h3 className="text-white mb-4 flex items-center gap-2 font-bold uppercase tracking-wider">
                        <Grid className="text-blue-400" /> Your Grid
                    </h3>
                    <div className="grid grid-cols-3 gap-2 p-2 bg-black/40 rounded-lg">
                        {grid.length > 0 && grid.map((row, r) => (
                            row.map((color, c) => (
                                <motion.div
                                    key={`player-${r}-${c}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleCellClick(r, c)}
                                    className="w-20 h-20 rounded-lg cursor-pointer shadow-lg border-2 border-transparent hover:border-white/50 transition-colors"
                                    style={{ backgroundColor: color }}
                                />
                            ))
                        ))}
                    </div>
                    <p className="mt-4 text-gray-400 text-sm text-center">Click to toggle colors (Cross pattern).</p>
                </div>
            </div>
        </div>
    );
};

export default VarnaVyuha;
