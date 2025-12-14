import React, { useState, useEffect, useRef } from 'react';
import { Send, Languages, MoreVertical, Smile, Paperclip, Mic, X, Sparkles, Globe, Palette, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import chatbotImage from '../../Images/chatbot_preview.png';

// Theme Imports
import themeBg1 from '../../Images/unity_theme.png';
import themeBg2 from '../../Images/unity-in-diversity-stockcake.webp';
import themeBg3 from '../../Images/c382a7f8-faf0-49c3-8c3f-1c1b674db4f1.webp';

const THEMES = [
    { id: 'default', name: 'Classic Unity', bg: themeBg1 },
    { id: 'diversity', name: 'Diversity Art', bg: themeBg2 },
    { id: 'abstract', name: 'Future Connect', bg: themeBg3 },
];

const ChatInterface = ({ channelId, socket }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [showTranslation, setShowTranslation] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [inputLang, setInputLang] = useState('en-US');
    const [suggestion, setSuggestion] = useState("");
    const [summary, setSummary] = useState(null); // For AI Summary Modal
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [readingLanguage, setReadingLanguage] = useState('Original');

    // Theme State
    const [currentTheme, setCurrentTheme] = useState(THEMES[0]);
    const [showThemePicker, setShowThemePicker] = useState(false);

    const fileInputRef = useRef(null);

    const messagesEndRef = useRef(null);
    const user = JSON.parse(localStorage.getItem('user'));

    // Languages list
    const languages = [
        { code: 'Original', name: 'Original' },
        { code: 'English', name: 'English' },
        { code: 'Hindi', name: 'Hindi' },
        { code: 'Bengali', name: 'Bengali' },
        { code: 'Tamil', name: 'Tamil' },
        { code: 'Telugu', name: 'Telugu' },
        { code: 'Marathi', name: 'Marathi' },
        { code: 'Gujarati', name: 'Gujarati' },
        { code: 'Kannada', name: 'Kannada' },
        { code: 'Malayalam', name: 'Malayalam' },
        { code: 'Punjabi', name: 'Punjabi' },
    ];

    useEffect(() => {
        if (channelId && socket) {
            socket.emit('join_room', { room: channelId, userName: user ? user.name : 'Guest' });
            fetchHistory();
        }
    }, [channelId, socket]);

    const fetchHistory = async () => {
        try {
            const res = await fetch(`http://localhost:5001/chat/history/${channelId}`);
            const data = await res.json();
            setMessages(data);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } catch (err) {
            console.error("Failed to fetch chat history", err);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleReceiveMessage = (data) => {
            setMessages((prev) => [...prev, data]);
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);

            // Auto-translate if reading language is set and not Original
            if (readingLanguage !== 'Original' && readingLanguage !== 'English') {
                socket.emit('translate_message', {
                    text: data.text,
                    targetLang: readingLanguage,
                    messageId: data.id
                });
            }
        };

        const handleMessageTranslated = (data) => {
            setMessages(prev => prev.map(msg =>
                msg.id === data.messageId
                    ? { ...msg, translation: data.translation, translationLang: data.lang }
                    : msg
            ));
        };

        socket.on('receive_message', handleReceiveMessage);
        socket.on('message_translated', handleMessageTranslated);
        socket.on('message_blocked', (data) => {
            alert(data.error); // Simple alert for now, can be upgraded to toast
        });

        return () => {
            socket.off('receive_message', handleReceiveMessage);
            socket.off('message_translated', handleMessageTranslated);
            socket.off('message_blocked');
        };
    }, [socket, readingLanguage]);

    // Handle manual language change - translate visible messages
    const handleReadingLanguageChange = (lang) => {
        setReadingLanguage(lang);
        if (lang === 'Original' || lang === 'English') return;

        // Trigger translation for recent messages
        messages.forEach(msg => {
            socket.emit('translate_message', {
                text: msg.text,
                targetLang: lang,
                messageId: msg.id
            });
        });
    };

    // Transliteration Logic
    const handleInputChange = async (e) => {
        const val = e.target.value;
        setNewMessage(val);

        // Simple Transliteration Trigger (on space)
        if (inputLang !== 'en-US' && val.endsWith(' ')) {
            const words = val.trim().split(' ');
            const lastWord = words[words.length - 1];

            if (lastWord) {
                try {
                    // Map inputLang to Google Input Tools code (e.g., hi-IN -> hi-t-i0-und)
                    const langCodeMap = {
                        'hi-IN': 'hi-t-i0-und',
                        'bn-IN': 'bn-t-i0-und',
                        'te-IN': 'te-t-i0-und',
                        'ta-IN': 'ta-t-i0-und',
                        'mr-IN': 'mr-t-i0-und',
                        'gu-IN': 'gu-t-i0-und',
                        'pa-IN': 'pa-t-i0-und',
                        'ml-IN': 'ml-t-i0-und',
                        'kn-IN': 'kn-t-i0-und',
                    };
                    const itc = langCodeMap[inputLang];
                    if (itc) {
                        const res = await fetch(`https://inputtools.google.com/request?text=${lastWord}&itc=${itc}&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8`);
                        const data = await res.json();
                        if (data[0] === 'SUCCESS' && data[1][0] && data[1][0][1][0]) {
                            const transliteratedWord = data[1][0][1][0];
                            const newText = val.slice(0, -lastWord.length - 1) + transliteratedWord + ' ';
                            setNewMessage(newText);
                        }
                    }
                } catch (err) {
                    console.error("Transliteration failed", err);
                }
            }
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msgData = {
            room: channelId,
            user: user ? user.name : 'Guest',
            userId: user ? user._id : null,
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            lang: inputLang, // Use selected input lang
            id: Date.now(),
        };

        await socket.emit('send_message', msgData);
        setNewMessage("");
    };

    const startListening = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.lang = inputLang;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setNewMessage(prev => prev + " " + transcript);
            };

            recognition.start();
        } else {
            alert("Voice input not supported in this browser.");
        }
    };

    const handleSummarize = async () => {
        if (messages.length === 0) return;
        setIsSummarizing(true);
        try {
            const res = await fetch('http://localhost:5001/ai/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages })
            });
            const data = await res.json();
            setSummary(data.summary);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div
            className="flex flex-col h-full relative bg-cover bg-center transition-all duration-500 ease-in-out"
            style={{ backgroundImage: `url(${currentTheme.bg})` }}
        >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
                            <img src={chatbotImage} alt="Chatbot" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <h3 className="text-white font-bold text-lg capitalize flex items-center gap-2">
                                # {channelId.replace('-', ' ')}
                            </h3>
                            <p className="text-xs text-gray-400">
                                {channelId === 'global' ? 'Unity in Diversity' : `Community Channel for ${channelId}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 relative">
                            {/* Theme Picker Button */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-gray-400 hover:text-white"
                                onClick={() => setShowThemePicker(!showThemePicker)}
                            >
                                <Palette size={18} />
                            </Button>

                            {/* Theme Picker Dropdown */}
                            <AnimatePresence>
                                {showThemePicker && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-10 right-0 w-64 bg-unity-dark border border-white/10 rounded-xl shadow-2xl p-3 z-50"
                                    >
                                        <h4 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Select Theme</h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {THEMES.map(theme => (
                                                <button
                                                    key={theme.id}
                                                    onClick={() => {
                                                        setCurrentTheme(theme);
                                                        setShowThemePicker(false);
                                                    }}
                                                    className={`flex items-center gap-3 p-2 rounded-lg transition-all border ${currentTheme.id === theme.id ? 'bg-white/10 border-unity-saffron' : 'hover:bg-white/5 border-transparent'}`}
                                                >
                                                    <div className="w-12 h-8 rounded overflow-hidden relative">
                                                        <img src={theme.bg} alt={theme.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <span className="text-sm text-gray-200 flex-1 text-left">{theme.name}</span>
                                                    {currentTheme.id === theme.id && <Check size={14} className="text-unity-saffron" />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>


                            {/* Read Language Selector */}
                            <div className="hidden md:flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                                <Globe size={14} className="text-unity-emerald" />
                                <span className="text-xs text-gray-400">Read in:</span>
                                <select
                                    value={readingLanguage}
                                    onChange={(e) => handleReadingLanguageChange(e.target.value)}
                                    className="bg-transparent text-xs text-white focus:outline-none cursor-pointer border-none focus:ring-0"
                                >
                                    {languages.map(lang => (
                                        <option key={lang.code} value={lang.name} className="bg-gray-900 text-white">
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleSummarize}
                                isLoading={isSummarizing}
                                className="text-xs border-unity-saffron/50 text-unity-saffron hover:bg-unity-saffron/10"
                            >
                                <Sparkles size={14} className="mr-1" /> Summarize
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTranslation(!showTranslation)}
                                className={`text-xs ${showTranslation ? 'bg-unity-indigo/20 border-unity-indigo' : ''}`}
                                title="We automatically translate Indic languages to English for everyone to understand."
                            >
                                <Languages size={14} className="mr-1" />
                                {showTranslation ? 'Translation ON' : 'Translation OFF'}
                            </Button>

                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 mt-10">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    )}

                    {messages.map((msg, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex flex-col ${msg.user === (user?.name || 'You') ? 'items-end' : 'items-start'}`}
                        >
                            <div className="flex items-baseline gap-2 mb-1">
                                <span className={`text-sm font-bold ${msg.user === (user?.name || 'You') ? 'text-unity-saffron' : 'text-unity-emerald'}`}>
                                    {msg.user}
                                </span>
                                <span className="text-xs text-gray-300">{msg.time}</span>
                            </div>

                            <div className={`max-w-[80%] p-3 rounded-2xl ${msg.user === (user?.name || 'You')
                                ? 'bg-unity-indigo text-white rounded-tr-none'
                                : 'bg-white/10 text-gray-200 rounded-tl-none'
                                }`}>
                                <div className="flex justify-between items-start gap-2">
                                    <p>{msg.text}</p>
                                    {msg.sentiment && (
                                        <span title={`Sentiment: ${msg.sentiment.label}`} className="text-sm select-none cursor-help">
                                            {msg.sentiment.label === 'POSITIVE' && '🙂'}
                                            {msg.sentiment.label === 'NEGATIVE' && '🙁'}
                                            {msg.sentiment.label === 'NEUTRAL' && '😐'}
                                        </span>
                                    )}
                                </div>

                                {/* Translation */}
                                {showTranslation && msg.translation && (
                                    <div className="mt-2 pt-2 border-t border-white/10 text-xs text-gray-400 italic flex items-start gap-1">
                                        <Languages size={10} className="mt-0.5 shrink-0" />
                                        <span>{msg.translation}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-sm relative">
                    {/* Emoji Picker */}
                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="absolute bottom-20 right-4 bg-unity-dark border border-white/10 rounded-xl p-3 shadow-xl grid grid-cols-6 gap-2 z-50 w-64"
                            >
                                {['😀', '😂', '😍', '🥺', '😎', '😭', '😡', '👍', '👎', '🎉', '🔥', '❤️', '🕉️', '🇮🇳', '🙏', '✨', '👋', '🤝'].map(emoji => (
                                    <button
                                        key={emoji}
                                        onClick={() => {
                                            setNewMessage(prev => prev + emoji);
                                            setShowEmojiPicker(false);
                                        }}
                                        className="text-xl hover:bg-white/10 p-1 rounded transition-colors"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSend} className="flex gap-2 items-end">
                        <div className="flex-1 bg-black/40 border border-white/10 rounded-xl flex items-center p-2 focus-within:border-unity-saffron transition-colors relative">
                            {/* File Upload */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        // For now, just append filename to message as a placeholder for real upload
                                        setNewMessage(prev => prev + ` [Attached: ${file.name}] `);
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                                title="Attach File"
                            >
                                <Paperclip size={18} />
                            </button>

                            <input
                                type="text"
                                value={newMessage}
                                onChange={handleInputChange}
                                placeholder={`Message #${channelId} (Type in Hindi, Tamil, etc.)...`}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 px-2"
                            />

                            <select
                                value={inputLang}
                                onChange={(e) => setInputLang(e.target.value)}
                                className="bg-transparent text-xs text-gray-400 border-none focus:ring-0 cursor-pointer w-12"
                                title="Select language for Transliteration & Voice"
                            >
                                <option value="en-US">EN</option>
                                <option value="hi-IN">HI</option>
                                <option value="bn-IN">BN</option>
                                <option value="te-IN">TE</option>
                                <option value="ta-IN">TA</option>
                                <option value="mr-IN">MR</option>
                                <option value="gu-IN">GU</option>
                                <option value="pa-IN">PA</option>
                                <option value="ml-IN">ML</option>
                                <option value="kn-IN">KN</option>
                            </select>

                            <button
                                type="button"
                                onClick={startListening}
                                className={`p-2 transition-colors ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-white'}`}
                                title="Hold to Speak"
                            >
                                <Mic size={18} />
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                className={`p-2 transition-colors ${showEmojiPicker ? 'text-unity-saffron' : 'text-gray-400 hover:text-white'}`}
                                title="Add Emoji"
                            >
                                <Smile size={18} />
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="h-12 w-12 rounded-xl bg-unity-saffron text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform hover:bg-amber-400"
                        >
                            <Send size={20} />
                        </button>
                    </form>
                </div>

                {/* AI Summary Modal */}
                <AnimatePresence>
                    {summary && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-unity-dark border border-unity-saffron/30 rounded-2xl p-6 max-w-md w-full shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setSummary(null)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-unity-saffron/10 rounded-lg">
                                        <Sparkles className="text-unity-saffron" size={24} />
                                    </div>
                                    <h3 className="text-xl font-display text-white">Chat Summary</h3>
                                </div>
                                <div className="prose prose-invert prose-sm max-h-60 overflow-y-auto custom-scrollbar">
                                    <p className="whitespace-pre-wrap text-gray-300">{summary}</p>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <Button variant="primary" size="sm" onClick={() => setSummary(null)}>
                                        Close
                                    </Button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatInterface;
