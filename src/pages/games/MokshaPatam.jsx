import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, Dice5, BookOpen, XCircle } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

const BOARD_SIZE = 100;

const SNAKES = {
    16: 6,
    47: 26,
    49: 11,
    56: 53,
    62: 19,
    64: 60,
    87: 24,
    93: 73,
    95: 75,
    98: 78
};

const LADDERS = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100
};

const MokshaPatam = () => {
    const navigate = useNavigate();
    const [playerPos, setPlayerPos] = useState(1);
    const [aiPos, setAiPos] = useState(1);
    const [turn, setTurn] = useState('player'); // 'player' | 'ai'
    const [dice, setDice] = useState(1);
    const [rolling, setRolling] = useState(false);
    const [winner, setWinner] = useState(null);
    const [log, setLog] = useState(["Game Started. Roll the dice!"]);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (turn === 'ai' && !winner) {
            setTimeout(rollDice, 1500);
        }
    }, [turn, winner]);

    const addLog = (msg) => {
        setLog(prev => [msg, ...prev].slice(0, 5));
    };

    const rollDice = () => {
        if (rolling || winner) return;

        setRolling(true);
        const roll = Math.floor(Math.random() * 6) + 1;

        let count = 0;
        const interval = setInterval(() => {
            setDice(Math.floor(Math.random() * 6) + 1);
            count++;
            if (count > 5) {
                clearInterval(interval);
                setDice(roll);
                setRolling(false);
                movePiece(roll);
            }
        }, 100);
    };

    const movePiece = async (roll) => {
        const isPlayer = turn === 'player';
        const currentPos = isPlayer ? playerPos : aiPos;
        let nextPos = currentPos + roll;

        if (nextPos > BOARD_SIZE) {
            addLog(`${isPlayer ? 'You' : 'AI'} rolled ${roll} (Too high!)`);
            setTurn(isPlayer ? 'ai' : 'player');
            return;
        }

        addLog(`${isPlayer ? 'You' : 'AI'} rolled ${roll} -> Moves to ${nextPos}`);

        let finalPos = nextPos;
        let msg = "";

        if (LADDERS[nextPos]) {
            finalPos = LADDERS[nextPos];
            msg = " Climbed a Ladder! 🪜";
        } else if (SNAKES[nextPos]) {
            finalPos = SNAKES[nextPos];
            msg = " Bitten by a Snake! 🐍";
        }

        if (msg) addLog(msg);

        if (isPlayer) setPlayerPos(finalPos);
        else setAiPos(finalPos);

        if (finalPos === BOARD_SIZE) {
            const winnerName = isPlayer ? 'Player' : 'Computer';
            setWinner(winnerName);
            if (isPlayer) await awardPoints();
        } else {
            setTurn(isPlayer ? 'ai' : 'player');
        }
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

    const resetGame = () => {
        setPlayerPos(1);
        setAiPos(1);
        setTurn('player');
        setWinner(null);
        setLog(["Game Restarted."]);
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

                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-500 w-full pointer-events-none drop-shadow-sm">
                    Moksha Patam
                </h1>

                <div className="flex gap-2 z-10">
                    <Button variant="outline" onClick={() => setShowRules(true)}>
                        <BookOpen className="mr-2 w-4 h-4" /> Rules
                    </Button>
                    <Button variant="outline" onClick={resetGame}>
                        <RefreshCw className="mr-2 w-4 h-4" /> <span className="hidden sm:inline">Reset</span>
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
                                <li><strong>Goal:</strong> Reach square 100 first.</li>
                                <li><strong>Gameplay:</strong> Roll the dice to move forward.</li>
                                <li><strong>Ladders (Virtues):</strong> Landing on the bottom of a ladder moves you UP to the top. Good deeds elevate you!</li>
                                <li><strong>Snakes (Vices):</strong> Landing on a snake's head brings you DOWN to its tail. Bad karma pulls you down.</li>
                                <li>Win by landing exactly on 100.</li>
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
                        <div className="bg-unity-dark border-2 border-unity-saffron p-8 rounded-2xl text-center max-w-md shadow-[0_0_50px_rgba(245,158,11,0.5)]">
                            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                            <h2 className="text-4xl font-display font-bold text-white mb-2">{winner} Wins!</h2>
                            {winner === 'Player' ? (
                                <p className="text-xl text-unity-emerald font-bold mb-6">+1000 Points Awarded</p>
                            ) : (
                                <p className="text-xl text-red-400 font-bold mb-6">Better luck next time!</p>
                            )}
                            <Button variant="accent" size="lg" onClick={resetGame}>Play Again</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                <div className="lg:col-span-2 aspect-square bg-[#DEB887] rounded-lg border-[12px] border-[#8B4513] shadow-2xl relative grid grid-cols-10 grid-rows-10 p-1">
                    {[...Array(100)].map((_, i) => {
                        const row = Math.floor(i / 10);
                        let num;
                        if (row % 2 === 0) {
                            num = 100 - (row * 10) - (i % 10);
                        } else {
                            const start = (9 - row) * 10 + 1;
                            num = start + (i % 10);
                        }

                        let special = "";
                        if (SNAKES[num]) special = "🐍";
                        if (LADDERS[num]) special = "🪜";

                        const isPlayerHere = playerPos === num;
                        const isAiHere = aiPos === num;

                        return (
                            <div key={i} className={`flex items-center justify-center border border-black/10 text-xs sm:text-sm font-bold relative ${special ? 'bg-black/5' : ''}`}>
                                <span className="opacity-50">{num}</span>
                                <span className="absolute text-lg sm:text-2xl">{special}</span>

                                {isPlayerHere && (
                                    <motion.div layoutId="player" className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full border-2 border-white shadow-lg z-20 flex items-center justify-center">
                                        <span className="text-[10px] text-white">You</span>
                                    </motion.div>
                                )}
                                {isAiHere && (
                                    <motion.div layoutId="ai" className="absolute w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full border-2 border-white shadow-lg z-10 flex items-center justify-center translate-x-1 translate-y-1">
                                        <span className="text-[10px] text-white">AI</span>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-6">
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                        <h3 className="text-2xl font-display font-bold text-unity-saffron mb-4 text-center">Controls</h3>
                        <div className="flex flex-col items-center gap-6">
                            <div className={`p-6 rounded-2xl bg-black/40 border-2 ${rolling ? 'border-unity-saffron animate-pulse' : 'border-white/20'}`}>
                                <Dice5 className={`w-16 h-16 ${rolling ? 'animate-spin text-unity-saffron' : 'text-white'}`} />
                            </div>
                            <div className="text-center">
                                <p className="text-gray-400 mb-2">Current Turn</p>
                                <div className={`text-2xl font-bold ${turn === 'player' ? 'text-red-400' : 'text-blue-400'}`}>
                                    {turn === 'player' ? "YOUR TURN" : "AI THINKING..."}
                                </div>
                            </div>
                            <Button variant="accent" size="xl" className="w-full" onClick={rollDice} disabled={turn !== 'player' || rolling || winner}>
                                {rolling ? 'Rolling...' : 'Roll Dice'}
                            </Button>
                        </div>
                    </div>
                    <div className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-sm flex-grow">
                        <h3 className="text-lg font-bold text-white mb-4">Game Log</h3>
                        <div className="flex flex-col gap-2 font-mono text-sm">
                            {log.map((entry, i) => (
                                <div key={i} className="p-2 bg-black/20 rounded border-l-2 border-unity-emerald text-gray-300">
                                    {entry}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MokshaPatam;
