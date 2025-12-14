import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, BookOpen, XCircle } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

const CARD_DATA = [
    { id: 1, content: '🐅', label: 'Bengal Tiger' },
    { id: 2, content: '🦚', label: 'Peacock' },
    { id: 3, content: '🥭', label: 'Mango' },
    { id: 4, content: '🧘', label: 'Yoga' },
    { id: 5, content: '🕌', label: 'Taj Mahal' },
    { id: 6, content: '🐘', label: 'Elephant' },
];

const Ganjifa = () => {
    const navigate = useNavigate();
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [moves, setMoves] = useState(0);
    const [winner, setWinner] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showRules, setShowRules] = useState(false);

    const startNewGame = () => {
        const shuffled = [...CARD_DATA, ...CARD_DATA]
            .sort(() => Math.random() - 0.5)
            .map((card, index) => ({ ...card, uniqueId: index }));
        setCards(shuffled);
        setFlipped([]);
        setMatched([]);
        setMoves(0);
        setWinner(false);
    };

    useEffect(() => {
        startNewGame();
    }, []);

    const handleCardClick = (index) => {
        if (flipped.length === 2 || matched.includes(index) || flipped.includes(index)) return;

        setFlipped(prev => [...prev, index]);

        if (flipped.length === 1) {
            setMoves(prev => prev + 1);
            const firstIndex = flipped[0];
            const secondIndex = index;

            if (cards[firstIndex].id === cards[secondIndex].id) {
                setMatched(prev => [...prev, firstIndex, secondIndex]);
                setFlipped([]);
                if (matched.length + 2 === cards.length) {
                    handleWin();
                }
            } else {
                setTimeout(() => setFlipped([]), 1000);
            }
        }
    };

    const handleWin = async () => {
        setWinner(true);
        if (user) {
            try {
                await axios.post('http://localhost:5001/games/update-score', {
                    userId: user._id,
                    points: 1000
                });
            } catch (err) {
                console.error("Error awarding points:", err);
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 flex flex-col items-center relative bg-unity-dark overflow-hidden">
            {/* Shared Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/60 to-unity-dark" />
            </div>

            <div className="relative z-10 w-full max-w-4xl mb-8 flex items-center justify-between px-4">
                <Button variant="ghost" onClick={() => navigate('/games')} className="z-10">
                    <ArrowLeft className="mr-2" /> Back
                </Button>
                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-500 w-full pointer-events-none drop-shadow-sm">
                    Ganjifa Legends
                </h1>
                <div className="flex gap-2 z-10">
                    <Button variant="outline" onClick={() => setShowRules(true)}>
                        <BookOpen className="mr-2 w-4 h-4" /> Rules
                    </Button>
                    <Button variant="outline" onClick={startNewGame}>
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
                                <li><strong>Goal:</strong> Find all matching pairs of cards.</li>
                                <li><strong>Gameplay:</strong> Click a card to flip it and reveal the symbol.</li>
                                <li>If you find a pair, they stay visible.</li>
                                <li>If they don't match, they flip back over.</li>
                                <li>Memorize the locations to win!</li>
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
                        <div className="bg-unity-dark border-2 border-unity-emerald p-8 rounded-2xl text-center max-w-md shadow-2xl">
                            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                            <h2 className="text-4xl font-display font-bold text-white mb-2">Legends Matched!</h2>
                            <p className="text-xl text-unity-saffron font-bold mb-6">+1000 Points Awarded</p>
                            <Button variant="accent" size="lg" onClick={startNewGame}>Play Again</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 grid grid-cols-3 sm:grid-cols-4 gap-4 w-full max-w-2xl">
                {cards.map((card, index) => {
                    const isFlipped = flipped.includes(index) || matched.includes(index);
                    return (
                        <motion.div
                            key={index}
                            className={`aspect-[3/4] rounded-lg cursor-pointer transform transition-all duration-300 perspective-1000 ${isFlipped ? 'rotate-y-180' : ''}`}
                            onClick={() => handleCardClick(index)}
                        >
                            <div className={`w-full h-full rounded-lg border-2 shadow-xl flex items-center justify-center text-4xl backface-hidden transition-all duration-500 
                                ${isFlipped
                                    ? 'bg-unity-saffron border-yellow-300 rotate-y-180'
                                    : 'bg-gradient-to-br from-red-800 to-black border-red-900'}
                            `}>
                                {isFlipped ? (
                                    <div className="text-center">
                                        <div>{card.content}</div>
                                        <div className="text-xs font-bold text-black mt-2">{card.label}</div>
                                    </div>
                                ) : (
                                    <div className="text-white/20 text-2xl font-serif">♠</div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
            <p className="mt-8 text-gray-400 text-xs max-w-xl text-center relative z-10">
                *Ganjifa: Traditional playing cards of India, historically hand-painted.
            </p>
        </div>
    );
};

export default Ganjifa;
