import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, XCircle, Trophy, BookOpen, RefreshCw } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

const questions = [
    {
        id: 1,
        question: "Which Indian monument was built by Emperor Shah Jahan in memory of his wife Mumtaz Mahal?",
        options: ["Qutub Minar", "Red Fort", "Taj Mahal", "Hawa Mahal"],
        answer: 2
    },
    {
        id: 2,
        question: "What is the traditional classical dance form of Tamil Nadu?",
        options: ["Kathak", "Bharatanatyam", "Odissi", "Kuchipudi"],
        answer: 1
    },
    {
        id: 3,
        question: "Which festival is known as the 'Festival of Lights'?",
        options: ["Holi", "Eid", "Diwali", "Christmas"],
        answer: 2
    },
    {
        id: 4,
        question: "The 'Iron Man of India' refers to which leader?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Vallabhbhai Patel", "Subhas Chandra Bose"],
        answer: 2
    },
    {
        id: 5,
        question: "Which ancient university was a center of learning in ancient India?",
        options: ["Oxford", "Nalanda", "Harvard", "Cambridge"],
        answer: 1
    },
    {
        id: 6,
        question: "Who wrote the Indian national anthem 'Jana Gana Mana'?",
        options: ["Bankim Chandra Chatterjee", "Rabindranath Tagore", "Sarojini Naidu", "Subramania Bharati"],
        answer: 1
    },
    {
        id: 7,
        question: "Which state is known as the 'Spice Garden of India'?",
        options: ["Kerala", "Rajasthan", "Punjab", "Assam"],
        answer: 0
    },
    {
        id: 8,
        question: "The famous 'Hornbill Festival' is celebrated in which state?",
        options: ["Manipur", "Nagaland", "Mizoram", "Meghalaya"],
        answer: 1
    },
    {
        id: 9,
        question: "Which Indian practice focuses on breath control?",
        options: ["Asana", "Pranayama", "Dhyana", "Yama"],
        answer: 1
    },
    {
        id: 10,
        question: "The preamble of the Indian Constitution declares India as a...",
        options: ["Sovereign Socialist Secular Democratic Republic", "Federal Kingdom", "Communist State", "Capitalist Economy"],
        answer: 0
    }
];

const JnanaYatra = () => {
    const navigate = useNavigate();
    const [currentQ, setCurrentQ] = useState(0);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [selected, setSelected] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [showRules, setShowRules] = useState(false);

    const handleAnswer = (index) => {
        if (selected !== null) return;
        setSelected(index);
        const correct = index === questions[currentQ].answer;

        if (correct) setScore(prev => prev + 1);

        setTimeout(() => {
            if (currentQ < questions.length - 1) {
                setCurrentQ(prev => prev + 1);
                setSelected(null);
            } else {
                setShowResult(true);
                if (score + (correct ? 1 : 0) >= 7) {
                    awardPoints();
                }
            }
        }, 1500);
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
        setCurrentQ(0);
        setScore(0);
        setShowResult(false);
        setSelected(null);
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
                    Jnana Yatra
                </h1>
                <div className="flex gap-2 z-10">
                    <Button variant="outline" onClick={() => setShowRules(true)}>
                        <BookOpen className="mr-2 w-4 h-4" /> Rules
                    </Button>
                    <Button variant="outline" onClick={resetGame} className="z-10">
                        <RefreshCw className="mr-2" /> Restart
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
                                <li><strong>Goal:</strong> Test your knowledge of India.</li>
                                <li><strong>Scoring:</strong> Correct answers give you 1 point.</li>
                                <li><strong>Winning:</strong> Score 7 or more out of 10 to win points.</li>
                                <li>Good luck!</li>
                            </ul>
                            <Button className="w-full mt-6" onClick={() => setShowRules(false)}>Got it!</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showResult && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    >
                        <div className={`bg-unity-dark border-2 ${score >= 7 ? 'border-unity-emerald' : 'border-red-400'} p-8 rounded-2xl text-center max-w-md shadow-2xl`}>
                            {score >= 7 ? (
                                <>
                                    <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                                    <h2 className="text-4xl font-display font-bold text-white mb-2">Wisdom Achieved!</h2>
                                    <p className="text-xl text-unity-saffron font-bold mb-6">+1000 Points Awarded</p>
                                </>
                            ) : (
                                <>
                                    <BookOpen className="w-20 h-20 text-red-400 mx-auto mb-4" />
                                    <h2 className="text-3xl font-display font-bold text-white mb-2">Keep Learning</h2>
                                    <p className="text-gray-300 mb-6">You scored {score}/{questions.length}. Try again!</p>
                                </>
                            )}
                            <Button variant="accent" size="lg" onClick={resetGame}>Try Again</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 w-full max-w-2xl">
                {!showResult && (
                    <div className="bg-white/5 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                        <div className="flex justify-between items-center mb-6 text-gray-400 text-sm">
                            <span>Question {currentQ + 1} of {questions.length}</span>
                            <span>Score: {score}</span>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-8 leading-relaxed">
                            {questions[currentQ].question}
                        </h2>

                        <div className="grid gap-4">
                            {questions[currentQ].options.map((option, index) => {
                                let stateStyles = "bg-black/40 hover:bg-white/10 border-white/5";
                                if (selected !== null) {
                                    if (index === questions[currentQ].answer) {
                                        stateStyles = "bg-green-500/20 border-green-500 text-green-400";
                                    } else if (index === selected) {
                                        stateStyles = "bg-red-500/20 border-red-500 text-red-400";
                                    } else {
                                        stateStyles = "opacity-50";
                                    }
                                }

                                return (
                                    <motion.button
                                        key={index}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleAnswer(index)}
                                        disabled={selected !== null}
                                        className={`w-full text-left p-4 rounded-xl border transition-all ${stateStyles}`}
                                    >
                                        <span className="font-bold opacity-50 mr-4">{String.fromCharCode(65 + index)}.</span>
                                        {option}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
            <p className="mt-8 text-gray-400 text-xs max-w-xl text-center relative z-10">
                *Jnana Yatra: "Journey of Wisdom". Test your knowledge of India's vast cultural heritage.
            </p>
        </div>
    );
};

export default JnanaYatra;
