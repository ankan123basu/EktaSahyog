import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

import ektaSaathiIcon from '../../Images/ekta_saathi_icon.png';

const AIAssistant = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Namaste! I am Ekta Saathi. How can I help you collaborate today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isOpen]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5001/ai/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: input })
            });
            const data = await response.json();

            const botMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: data.text || "I'm having trouble connecting to my brain right now."
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMsg = {
                id: Date.now() + 1,
                role: 'assistant',
                text: "Sorry, I couldn't reach the server. Please try again later."
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Trigger Button */}
            <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-24 right-6 z-40 p-0 rounded-full shadow-lg border-2 border-unity-saffron ${isOpen ? 'hidden' : 'flex'} items-center justify-center bg-unity-dark text-unity-saffron overflow-hidden w-16 h-16`}
            >
                <img src={ektaSaathiIcon} alt="Ekta Saathi" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-unity-dark border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-unity-indigo to-purple-900 flex justify-between items-center border-b border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="p-0 rounded-full overflow-hidden w-10 h-10 border border-white/20">
                                    <img src={ektaSaathiIcon} alt="Ekta Saathi" className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-display text-white text-sm">Ekta Saathi</h3>
                                    <p className="text-[10px] text-gray-300 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" /> Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user'
                                            ? 'bg-unity-indigo text-white rounded-br-none'
                                            : 'bg-white/10 text-gray-200 rounded-bl-none border border-white/5'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-unity-saffron" />
                                        <span className="text-xs text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-4 bg-unity-dark border-t border-white/10">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask me anything..."
                                    className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-unity-saffron transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-unity-saffron hover:bg-white/5 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={18} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIAssistant;
