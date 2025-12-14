import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, BookOpen, XCircle } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

const SEEDS_PER_HOLE = 5;

const Pallanguzhi = () => {
    const navigate = useNavigate();
    const [board, setBoard] = useState(Array(14).fill(SEEDS_PER_HOLE));
    const [playerStore, setPlayerStore] = useState(0);
    const [aiStore, setAiStore] = useState(0);
    const [turn, setTurn] = useState('player');
    const [winner, setWinner] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (turn === 'ai' && !winner) {
            const timer = setTimeout(makeAiMove, 1500);
            return () => clearTimeout(timer);
        }
    }, [turn, winner]);

    const checkWin = (currentBoard, pStore, aStore) => {
        const playerEmpty = currentBoard.slice(0, 7).every(n => n === 0);
        const aiEmpty = currentBoard.slice(7, 14).every(n => n === 0);

        if (playerEmpty || aiEmpty) {
            let finalP = pStore;
            let finalA = aStore;
            finalP += currentBoard.slice(0, 7).reduce((a, b) => a + b, 0);
            finalA += currentBoard.slice(7, 14).reduce((a, b) => a + b, 0);

            if (finalP > finalA) {
                setWinner('Player');
                awardPoints();
            } else if (finalA > finalP) {
                setWinner('AI');
            } else {
                setWinner('Draw');
            }
            return true;
        }
        return false;
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

    const handleHoleClick = (index) => {
        if (turn !== 'player' || animating || winner) return;
        if (index < 0 || index > 6) return;
        if (board[index] === 0) return;

        playTurn(index, 'player');
    };

    const makeAiMove = () => {
        const validIndices = [];
        for (let i = 7; i <= 13; i++) {
            if (board[i] > 0) validIndices.push(i);
        }

        if (validIndices.length === 0) {
            setWinner('Player');
            return;
        }

        const move = validIndices[Math.floor(Math.random() * validIndices.length)];
        playTurn(move, 'ai');
    };

    const playTurn = async (startIndex, currentTurn) => {
        setAnimating(true);
        let currentBoard = [...board];
        let pStore = playerStore;
        let aStore = aiStore;

        let hand = currentBoard[startIndex];
        currentBoard[startIndex] = 0;
        setBoard([...currentBoard]);

        let currentIndex = startIndex;
        let loops = 0;
        const process = async () => {
            while (hand > 0) {
                loops++;
                if (loops > 200) break;

                currentIndex = (currentIndex + 1) % 14;
                currentBoard[currentIndex]++;
                hand--;

                setBoard([...currentBoard]);
                await new Promise(r => setTimeout(r, 200));
            }

            if (currentBoard[currentIndex] > 1) {
                const newHand = currentBoard[currentIndex];
                currentBoard[currentIndex] = 0;
                hand = newHand;
                setBoard([...currentBoard]);
                await new Promise(r => setTimeout(r, 300));
                await process();
            } else {
                const oppositeIndex = 13 - currentIndex;
                const captureAmount = currentBoard[oppositeIndex];

                if (captureAmount > 0) {
                    currentBoard[oppositeIndex] = 0;
                    currentBoard[currentIndex] = 0;

                    if (currentTurn === 'player') {
                        pStore += captureAmount + 1;
                    } else {
                        aStore += captureAmount + 1;
                    }
                    setPlayerStore(pStore);
                    setAiStore(aStore);
                    setBoard([...currentBoard]);
                }
            }
        };

        await process();
        setAnimating(false);

        if (!checkWin(currentBoard, pStore, aStore)) {
            setTurn(currentTurn === 'player' ? 'ai' : 'player');
        }
    };

    const resetGame = () => {
        setBoard(Array(14).fill(SEEDS_PER_HOLE));
        setPlayerStore(0);
        setAiStore(0);
        setTurn('player');
        setWinner(null);
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
                    Pallanguzhi
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
                                <li><strong>Goal:</strong> Collect more seeds than your opponent.</li>
                                <li><strong>Sowing:</strong> Click a hole on your side (bottom) to pick up all seeds. They are distributed one-by-one counter-clockwise.</li>
                                <li><strong>Continuity:</strong> If the last seed lands in a non-empty hole, you pick up all seeds from that hole and continue.</li>
                                <li><strong>Capture:</strong> If the last seed lands in an empty hole, you capture the seeds in the hole <em>opposite</em> to it.</li>
                                <li>Game ends when a player has no moves.</li>
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
                            <h2 className="text-4xl font-display font-bold text-white mb-2">{winner} Wins!</h2>
                            <p className="text-gray-300 mb-4">Player: {playerStore} - AI: {aiStore}</p>
                            {winner === 'Player' ? (
                                <p className="text-xl text-unity-saffron font-bold mb-6">+1000 Points Awarded</p>
                            ) : (
                                <p className="text-xl text-red-400 font-bold mb-6">Strategy needs work!</p>
                            )}
                            <Button variant="accent" size="lg" onClick={resetGame}>Rematch</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 flex flex-col items-center gap-12 w-full max-w-4xl">
                <div className="flex justify-between w-full px-12">
                    <div className="text-center">
                        <h3 className="text-blue-400 font-bold mb-2">AI Store</h3>
                        <div className="w-24 h-24 rounded-full border-4 border-blue-500 flex items-center justify-center bg-black/40 text-3xl font-bold text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                            {aiStore}
                        </div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-red-400 font-bold mb-2">Your Store</h3>
                        <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center bg-black/40 text-3xl font-bold text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                            {playerStore}
                        </div>
                    </div>
                </div>

                <div className="bg-[#3e2723] p-8 rounded-[3rem] border-8 border-[#5d4037] shadow-2xl relative">
                    <div className="grid grid-rows-2 gap-y-8 gap-x-4">
                        <div className="flex gap-4">
                            {[13, 12, 11, 10, 9, 8, 7].map(i => (
                                <motion.div
                                    key={`ai-${i}`}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1a120b] shadow-inner flex items-center justify-center relative border-2 ${turn === 'ai' && board[i] > 0 ? 'border-blue-400/50' : 'border-[#2d1b15]'}`}
                                >
                                    <div className="grid grid-cols-3 gap-1 p-2">
                                        {[...Array(board[i])].map((_, s) => (
                                            <div key={s} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-white shadow-sm" />
                                        ))}
                                    </div>
                                    <span className="absolute -top-6 text-xs text-gray-500">#{i}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex gap-4">
                            {[0, 1, 2, 3, 4, 5, 6].map(i => (
                                <motion.div
                                    key={`player-${i}`}
                                    onClick={() => handleHoleClick(i)}
                                    whileHover={{ scale: (turn === 'player' && board[i] > 0) ? 1.1 : 1 }}
                                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#1a120b] shadow-inner flex items-center justify-center relative cursor-pointer border-2 transition-colors ${turn === 'player' ? 'hover:border-red-400 border-red-900/50' : 'border-[#2d1b15]'}`}
                                >
                                    <div className="grid grid-cols-3 gap-1 p-2">
                                        {[...Array(board[i])].map((_, s) => (
                                            <div key={s} className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-unity-saffron shadow-md" />
                                        ))}
                                    </div>
                                    <span className="absolute -bottom-6 text-xs text-gray-500">#{i}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pallanguzhi;
