import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RefreshCw, Trophy, BookOpen, XCircle } from 'lucide-react';
import { Button } from '../../Components/ui/Button';
import { useNavigate } from 'react-router-dom';
import bg1 from '../../Images/wmremove-transformed.png';
import axios from 'axios';

const ChessGame = () => {
    const navigate = useNavigate();

    // Initial Board Layout (Standard Chess)
    // using unicode chess pieces for simplicity
    const initialBoard = [
        ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
        ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
        Array(8).fill(''),
        Array(8).fill(''),
        Array(8).fill(''),
        Array(8).fill(''),
        ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
        ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖']
    ];

    const [board, setBoard] = useState(initialBoard);
    const [selected, setSelected] = useState(null); // {row, col}
    const [turn, setTurn] = useState('white'); // 'white' or 'black'
    const [winner, setWinner] = useState(null);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    // Helper to identify piece color
    const isWhite = (piece) => '♙♖♘♗♕♔'.includes(piece);
    const isBlack = (piece) => '♟♜♞♝♛♚'.includes(piece);

    // Simplified Valid Move Logic
    const isValidMove = (startR, startC, endR, endC, piece) => {
        const dx = Math.abs(endC - startC);
        const dy = Math.abs(endR - startR);
        const target = board[endR][endC];

        // Cannot capture own piece
        if (target && isWhite(target) === isWhite(piece)) return false;

        const type = piece.charCodeAt(0);

        // Pawn (9817 White, 9823 Black)
        if (type === 9817) { // White Pawn
            // Move forward 1
            if (dx === 0 && endR === startR - 1 && !target) return true;
            // Move forward 2 (first move)
            if (dx === 0 && endR === startR - 2 && startR === 6 && !target && !board[startR - 1][startC]) return true;
            // Capture diagonal
            if (dx === 1 && endR === startR - 1 && target) return true;
            return false;
        }
        if (type === 9823) { // Black Pawn
            // Move forward 1
            if (dx === 0 && endR === startR + 1 && !target) return true;
            // Move forward 2
            if (dx === 0 && endR === startR + 2 && startR === 1 && !target && !board[startR + 1][startC]) return true;
            // Capture diagonal
            if (dx === 1 && endR === startR + 1 && target) return true;
            return false;
        }

        // Rook (9814, 9820) - Straight lines
        if (type === 9814 || type === 9820) {
            if (dx !== 0 && dy !== 0) return false;
            return true;
        }

        // Knight (9816, 9822) - L shape
        if (type === 9816 || type === 9822) {
            return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
        }

        // Bishop (9815, 9821) - Diagonals
        if (type === 9815 || type === 9821) {
            return dx === dy;
        }

        // Queen (9813, 9819) - Rook + Bishop
        if (type === 9813 || type === 9819) {
            return dx === dy || dx === 0 || dy === 0;
        }

        // King (9812, 9818) - 1 step any direction
        if (type === 9812 || type === 9818) {
            return dx <= 1 && dy <= 1;
        }

        return false;
    };

    // AI Logic
    useEffect(() => {
        if (turn === 'black' && !winner) {
            const timer = setTimeout(() => {
                makeAIMove();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [turn, winner, board]);

    const getAllValidMoves = (color) => {
        const moves = [];
        const isColor = color === 'white' ? isWhite : isBlack;

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = board[r][c];
                if (piece && isColor(piece)) {
                    for (let tr = 0; tr < 8; tr++) {
                        for (let tc = 0; tc < 8; tc++) {
                            if (isValidMove(r, c, tr, tc, piece)) {
                                moves.push({
                                    from: { r, c },
                                    to: { r: tr, c: tc },
                                    piece: piece,
                                    target: board[tr][tc]
                                });
                            }
                        }
                    }
                }
            }
        }
        return moves;
    };

    const makeAIMove = async () => {
        const possibleMoves = getAllValidMoves('black');

        if (possibleMoves.length === 0) {
            setTurn('white');
            return;
        }

        // Simple Greedy Strategy
        let bestMove = null;
        let bestScore = -1;

        const shuffledMoves = possibleMoves.sort(() => Math.random() - 0.5);

        for (const move of shuffledMoves) {
            let score = 0;
            if (move.target) {
                if (move.target === '♔') score = 1000; // Capture King
                else score = 10;
            } else {
                score = 1;
            }

            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        if (bestMove) {
            const newBoard = board.map(r => [...r]);
            newBoard[bestMove.to.r][bestMove.to.c] = bestMove.piece;
            newBoard[bestMove.from.r][bestMove.from.c] = '';

            setBoard(newBoard);
            setTurn('white');

            if (bestMove.target === '♔') {
                setWinner('Black');
            }
        }
    };

    const handleSquareClick = async (row, col) => {
        if (winner) return;
        if (turn === 'black') return;

        if (!selected) {
            const piece = board[row][col];
            if (piece && isWhite(piece)) {
                setSelected({ row, col });
            }
            return;
        }

        if (selected.row === row && selected.col === col) {
            setSelected(null);
            return;
        }

        const piece = board[selected.row][selected.col];
        const target = board[row][col];

        if (isValidMove(selected.row, selected.col, row, col, piece)) {
            const newBoard = board.map(r => [...r]);
            newBoard[row][col] = piece;
            newBoard[selected.row][selected.col] = '';

            setBoard(newBoard);
            setSelected(null);
            setTurn('black');

            if (target && target === '♚') {
                setWinner('White');
                await awardPoints();
            }
        } else {
            if (target && isWhite(target)) {
                setSelected({ row, col });
            } else {
                setSelected(null);
            }
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
        setBoard(initialBoard);
        setTurn('white');
        setSelected(null);
        setWinner(null);
    };

    const [showRules, setShowRules] = useState(false);

    // ... (existing code)

    return (
        <div className="min-h-screen pt-24 px-4 flex flex-col items-center relative bg-unity-dark overflow-hidden">
            {/* Shared Background */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/60 to-unity-dark" />
            </div>

            <div className="relative z-10 w-full max-w-6xl mb-8 flex items-center justify-between px-4">
                <Button variant="ghost" onClick={() => navigate('/games')} className="z-10">
                    <ArrowLeft className="mr-2" /> Back to Arcade
                </Button>

                <h1 className="absolute left-1/2 -translate-x-1/2 text-3xl md:text-5xl font-display font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-white to-green-500 w-full pointer-events-none drop-shadow-sm">
                    Chaturanga
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
                                <li><strong>Goal:</strong> Capture the opponent's King (Checkmate).</li>
                                <li><strong>Pawn (Soldier):</strong> Moves forward 1 step, captures diagonally.</li>
                                <li><strong>Rook (Elephant/Chariot):</strong> Moves straight horizontally or vertically.</li>
                                <li><strong>Knight (Horse):</strong> Moves in an 'L' shape (2 straight, 1 side).</li>
                                <li><strong>Bishop (Camel/Minister):</strong> Moves diagonally.</li>
                                <li><strong>Queen (Vizier):</strong> Moves in any direction straight.</li>
                                <li><strong>King (Raja):</strong> Moves 1 step in any direction.</li>
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
                            {winner === 'White' ? (
                                <p className="text-xl text-unity-emerald font-bold mb-6">+1000 Points Awarded</p>
                            ) : (
                                <p className="text-xl text-red-400 font-bold mb-6">Better luck next time!</p>
                            )}
                            <Button variant="accent" size="lg" onClick={resetGame}>Play Again</Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative z-10 bg-white/5 p-8 rounded-xl border border-white/10 backdrop-blur-sm shadow-2xl">
                <div className="mb-6 flex justify-between items-center bg-black/30 p-4 rounded-lg">
                    <div className={`text-xl font-bold px-4 py-2 rounded ${turn === 'white' ? 'bg-white text-black shadow-lg' : 'text-gray-500'}`}>
                        White Turn
                    </div>
                    <div className={`text-xl font-bold px-4 py-2 rounded ${turn === 'black' ? 'bg-black text-white shadow-lg border border-white/20' : 'text-gray-500'}`}>
                        Black Turn
                    </div>
                </div>

                <div className="grid grid-cols-8 border-[10px] border-[#5d4037] bg-[#DEB887] shadow-xl">
                    {board.map((row, rIndex) => (
                        row.map((piece, cIndex) => {
                            const isBlackSquare = (rIndex + cIndex) % 2 === 1;
                            const isSelected = selected?.row === rIndex && selected?.col === cIndex;

                            return (
                                <div
                                    key={`${rIndex}-${cIndex}`}
                                    onClick={() => handleSquareClick(rIndex, cIndex)}
                                    className={`
                                        w-10 h-10 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-5xl cursor-pointer select-none transition-all
                                        ${isBlackSquare ? 'bg-[#8B4513]/90' : 'bg-[#eecfa1]/90'}
                                        ${isSelected ? 'ring-inset ring-4 ring-yellow-400 bg-yellow-500/50' : ''}
                                        hover:opacity-90
                                    `}
                                >
                                    <span
                                        className={`transform transition-transform hover:scale-110 drop-shadow-lg ${piece && piece.charCodeAt(0) > 9817 ? 'text-black' : 'text-white text-shadow-black'}`}
                                        style={piece && piece.charCodeAt(0) <= 9817 ? { textShadow: '0px 2px 2px rgba(0,0,0,0.8)' } : {}}
                                    >
                                        {piece}
                                    </span>
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>

            <p className="mt-8 text-gray-400 text-xs max-w-2xl text-center relative z-10">
                *Simplified Rules: Standard piece movements apply. Win by capturing the enemy King.
            </p>
        </div>
    );
};

export default ChessGame;
