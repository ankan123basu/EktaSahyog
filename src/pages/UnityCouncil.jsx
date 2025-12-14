
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
import { Send, ChevronLeft, Quote, Sparkles, Volume2, StopCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '../Components/ui/Button';
import bgImage from '../Images/wmremove-transformed.png';
import unityThemeBg from '../Images/unity_theme.png';

// Persona Images
import patelImg from '../Images/Sardar_patel_(cropped).jpg';
import tagoreImg from '../Images/1926_Rabindrath_Tagore.jpg';
import azadImg from '../Images/Maulana_Abul_Kalam_Azad.jpg';
import ambedkarImg from '../Images/Dr_Bhim_Rao_Ambedkar.jpg';
import naiduImg from '../Images/sn_4bd133749c.jpg';
// New imports from User
import laxmiImg from '../Images/sngine_40b788ce83c27efe0669ee3f8df3088a.jpg';
import ashokaImg from '../Images/IMG_20230718_083215_n-765x1024.jpg';

// ----------------------------------------------------------------------
// HOW TO ADD YOUR OWN PHOTOS:
// 1. Upload photo to src/Images (e.g., 'patel.jpg')
// 2. Import it above: import patelImg from '../Images/patel.jpg';
// 3. Replace the 'image' string below with your variable (image: patelImg)
// ----------------------------------------------------------------------

const PERSONAS = [
    {
        id: 'patel',
        name: 'Sardar Vallabhbhai Patel',
        title: 'POLITICAL UNITY',
        desc: 'The Iron Man who united 562 princely states into one Indestructible Union.',
        quote: "Manpower without unity is not a strength unless it is harmonized and united properly, then it becomes a spiritual power.",
        image: patelImg,
        color: 'from-orange-600 to-orange-900',
        glow: 'shadow-orange-500/50',
        imgPos: 'object-center'
    },
    {
        id: 'tagore',
        name: 'Rabindranath Tagore',
        title: 'CULTURAL UNITY',
        desc: 'The Bard who taught us that the world is one nest (Vasudhaiva Kutumbakam).',
        quote: "The highest education is that which does not merely give us information but makes our life in harmony with all existence.",
        image: tagoreImg,
        color: 'from-amber-500 to-yellow-700',
        glow: 'shadow-yellow-500/50'
    },
    {
        id: 'azad',
        name: 'Maulana Abul Kalam Azad',
        title: 'EDUCATIONAL UNITY',
        desc: 'The First Education Minister who built bridges through knowledge and secularism.',
        quote: "Educationists should build the capacities of the spirit of inquiry, creativity, entrepreneurial and moral leadership.",
        image: azadImg,
        color: 'from-green-600 to-teal-800',
        glow: 'shadow-green-500/50',
        imgFit: 'object-contain',
        imgPos: 'object-center',
        scale: 1.25
    },
    {
        id: 'vivekananda',
        name: 'Swami Vivekananda',
        title: 'SPIRITUAL UNITY',
        desc: 'The Monk who introduced Indian philosophies to the West and awakened the youth.',
        quote: "Arise, awake, and stop not till the goal is reached.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Swami_Vivekananda-1893-09-signed.jpg/480px-Swami_Vivekananda-1893-09-signed.jpg",
        color: "from-orange-500 to-red-800",
        glow: "shadow-red-500/50",
        imgPos: 'object-[50%_15%]'
    },
    {
        id: 'ambedkar',
        name: 'Dr. B.R. Ambedkar',
        title: 'SOCIAL UNITY',
        desc: 'The Architect of the Constitution who fought for Equality and Justice for all.',
        quote: "I measure the progress of a community by the degree of progress which women have achieved.",
        image: ambedkarImg,
        color: 'from-blue-600 to-indigo-900',
        glow: 'shadow-blue-500/50',
        imgPos: 'object-[50%_25%]'
    },
    {
        id: 'naidu',
        name: 'Sarojini Naidu',
        title: 'UNITY IN DIVERSITY',
        desc: 'The Nightingale of India who unified hearts through poetry and patriotism.',
        quote: "We want deeper sincerity of motive, a greater courage in speech and earnestness in action.",
        image: naiduImg,
        color: 'from-pink-600 to-rose-800',
        glow: 'shadow-pink-500/50'
    },
    {
        id: 'kalam',
        name: 'Dr. APJ Abdul Kalam',
        title: 'SCIENTIFIC UNITY',
        desc: 'The Missile Man who dreamed of a developed, united India and ignited minds.',
        quote: "Dreams transform into thoughts, and thoughts result in action.",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/A._P._J._Abdul_Kalam.jpg/480px-A._P._J._Abdul_Kalam.jpg",
        color: "from-indigo-600 to-violet-900",
        glow: "shadow-indigo-500/50",
        imgPos: 'object-[50%_15%]'
    },
    {
        id: 'laxmibai',
        name: 'Rani Laxmi Bai',
        title: 'UNITY IN COURAGE',
        desc: 'The Warrior Queen who fought for freedom till her last breath.',
        quote: "I shall not surrender my Jhansi.",
        image: laxmiImg,
        color: "from-red-700 to-red-950",
        glow: "shadow-red-600/50"
    },
    {
        id: 'ashoka',
        name: 'Emperor Ashoka',
        title: 'UNITY IN PEACE',
        desc: 'The Emperor who turned from war to Dhamma and unified India through peace.',
        quote: "True conquest is the conquest of the heart.",
        image: ashokaImg,
        color: "from-stone-500 to-stone-800",
        glow: "shadow-stone-500/50"
    }
];

// --- 3D TILT CARD + SPOTLIGHT COMPONENT ---
const TiltCard = ({ persona, onClick, index }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Spotlight Gradient
    const spotlightX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
    const spotlightY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

    // We need pixel values for the spotlight position to work well with radial-gradient
    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);

        // Update CSS variables for spotlight
        e.currentTarget.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
            className="group relative cursor-pointer h-[420px] w-full perspective-1000"
        >
            {/* Ambient Glow */}
            <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${persona.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${persona.glow}`} />

            <div className="relative h-full w-full rounded-3xl bg-black/60 backdrop-blur-md border border-white/10 overflow-hidden shadow-2xl transition-all duration-300 group-hover:border-white/30">

                {/* Spotlight Overlay */}
                <div
                    className="absolute inset-0 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.4), transparent 40%)`
                    }}
                />

                {/* Image Section */}
                <div className="h-[60%] w-full relative overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10`} />
                    <div className="w-full h-full" style={{ transform: `scale(${persona.scale || 1})` }}>
                        <img
                            src={persona.image}
                            alt={persona.name}
                            className={`w-full h-full ${persona.imgFit || 'object-cover'} ${persona.imgPos || 'object-top'} transition-transform duration-700 ease-out group-hover:scale-110 grayscale group-hover:grayscale-0`}
                        />
                    </div>
                    {/* Living Portrait - Subtle Breathing Effect */}
                    <div className="absolute inset-0 bg-black/20 animate-pulse pointer-events-none mix-blend-multiply" />
                </div>

                {/* Content Section */}
                <div className="h-[40%] p-6 flex flex-col justify-between bg-gradient-to-b from-black/80 to-black/95 relative z-20">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <motion.div
                                className="h-0.5 w-8 bg-unity-saffron rounded-full"
                                layoutId={`line - ${persona.id} `}
                            />
                            <span className="text-unity-saffron text-xs font-bold uppercase tracking-widest">{persona.title}</span>
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2 leading-tight group-hover:text-unity-saffron transition-colors">
                            {persona.name}
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                            {persona.desc}
                        </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center gap-2">
                        <Quote size={14} className="text-gray-500" />
                        <p className="text-xs text-gray-400 italic truncate">
                            "{persona.quote}"
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};


const UnityCouncil = () => {
    const [selectedPersona, setSelectedPersona] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // --- VOICE FUNCTIONALITY ---
    const speakText = (text) => {
        if (!window.speechSynthesis) {
            alert("Your browser does not support text-to-speech.");
            return;
        }

        // Cancel current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find an Indian English voice
        const voices = window.speechSynthesis.getVoices();

        // Smart Voice Selection: Try to match Gender if possible
        const isFemale = selectedPersona && ['laxmibai', 'naidu'].includes(selectedPersona.id);

        let targetVoice = voices.find(v =>
            (v.lang.includes('IN') || v.name.includes('India')) &&
            (isFemale ? (v.name.includes('Female') || v.name.includes('Zira') || v.name.includes('Heera')) : (v.name.includes('Male') || v.name.includes('Ravi') || v.name.includes('David')))
        );

        // Fallback to any Indian voice
        if (!targetVoice) {
            targetVoice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
        }

        // Fallback to any English voice
        if (!targetVoice) {
            targetVoice = voices.find(v => v.lang.includes('en'));
        }

        if (targetVoice) {
            utterance.voice = targetVoice;

            // --- VOICE PERSONALIZATION (Simulating Legends) ---
            if (selectedPersona) {
                if (['patel', 'ambedkar'].includes(selectedPersona.id)) {
                    utterance.pitch = 0.6; // Deep, authoritative
                    utterance.rate = 0.85; // Measured pace
                } else if (['tagore', 'vivekananda'].includes(selectedPersona.id)) {
                    utterance.pitch = 0.8; // Calm, philosophical
                    utterance.rate = 0.8; // Slow, poetic
                } else if (['laxmibai', 'naidu'].includes(selectedPersona.id)) {
                    utterance.pitch = 1.1; // Higher pitch
                    utterance.rate = 1.0;
                } else if (selectedPersona.id === 'kalam') {
                    utterance.pitch = 0.95; // Gentle
                    utterance.rate = 0.9;
                }
            } else {
                utterance.pitch = 1.0;
            }
        }

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    const stopSpeaking = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };
    // ---------------------------

    const handleSelectPersona = (persona) => {
        setSelectedPersona(persona);
        const introText = `Namaste. I am ${persona.name}. How can I guide you on the path of unity today?`;
        setMessages([{
            role: 'system',
            content: introText
        }]);
        // Optional: Auto-speak intro? 
        // speakText(introText); // Uncomment if you want auto-speak on entry
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5001/api/council/chat', {
                message: input,
                persona: selectedPersona.id
            });

            const rawReply = res.data.reply;
            // Clean text: remove parens (...) and asterisks *...*
            const replyText = rawReply.replace(/\([^)]*\)/g, '').replace(/\*[^*]*\*/g, '').trim();

            const aiMsg = { role: 'ai', content: replyText };
            setMessages(prev => [...prev, aiMsg]);

            // Auto-speak the response
            speakText(replyText);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "My apologies, I cannot speak right now. The connection is weak." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (selectedPersona) {
        return (
            <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden bg-unity-dark">
                {/* MATCHED BACKGROUND STYLE FROM LANDING PAGE */}
                <div className="fixed inset-0 z-0 opacity-[0.70] pointer-events-none">
                    <img src={bgImage} alt="bg" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/40 to-unity-dark" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-5xl mx-auto h-[85vh] flex flex-col relative z-10"
                >
                    {/* Chat Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    stopSpeaking();
                                    setSelectedPersona(null);
                                }}
                                className="text-white hover:text-unity-saffron border-white/20 hover:bg-white/10 backdrop-blur-sm"
                            >
                                <ChevronLeft className="w-5 h-5 mr-1" /> Return to Hall
                            </Button>
                            <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
                                <div className="w-10 h-10 rounded-full overflow-hidden border border-unity-saffron">
                                    <img src={selectedPersona.image} alt={selectedPersona.name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-display font-medium text-white">{selectedPersona.name}</h2>
                                </div>
                            </div>
                        </div>

                        {/* Speaking Controls */}
                        {isSpeaking && (
                            <Button onClick={stopSpeaking} variant="ghost" className="text-red-400 hover:bg-red-500/10">
                                <StopCircle className="w-5 h-5 mr-2" /> Silence Voice
                            </Button>
                        )}
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 flex flex-col border border-white/10 overflow-hidden shadow-2xl relative rounded-2xl">
                        {/* Background Theme */}
                        <div className="absolute inset-0 z-0">
                            <img src={unityThemeBg} alt="theme" className="w-full h-full object-cover opacity-80" />
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-unity-saffron/20 scrollbar-track-transparent relative z-10">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`max-w-[80%] p-5 rounded-2xl relative ${msg.role === 'user'
                                        ? 'bg-unity-saffron/10 text-white rounded-br-none border border-unity-saffron/20'
                                        : `bg-gradient-to-br ${selectedPersona.color} text-white rounded-bl-none shadow-lg border border-white/10`
                                        }`}>
                                        <p className="text-lg leading-relaxed font-serif tracking-wide">{msg.content}</p>

                                        {/* Re-play Button for AI messages */}
                                        {msg.role !== 'user' && (
                                            <button
                                                onClick={() => speakText(msg.content)}
                                                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/50 hover:text-white transition-colors"
                                                title="Speak this message"
                                            >
                                                <Volume2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className={`bg-white/5 p-4 rounded-2xl rounded-bl-none animate-pulse flex items-center gap-2`}>
                                        <Sparkles className="w-4 h-4 text-unity-saffron/50 animate-spin" />
                                        <span className="text-gray-400 text-sm font-medium">Consulting history...</span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 relative z-10 bg-black/40 backdrop-blur-sm">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={`Ask about Unity, Culture, or Heritage...`}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-unity-saffron/50 transition-all placeholder-gray-500 font-light"
                                />
                                <Button onClick={handleSend} disabled={isLoading} className="bg-unity-saffron hover:bg-unity-saffron/80 text-black font-medium px-6">
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 px-4 relative overflow-hidden bg-unity-dark">
            {/* MATCHED BACKGROUND STYLE FROM LANDING PAGE */}
            <div className="fixed inset-0 z-0 opacity-[0.70] pointer-events-none">
                <img src={bgImage} alt="bg" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/90 via-unity-dark/40 to-unity-dark" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl tracking-tight mb-2">
                            THE UNITY COUNCIL
                        </h1>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light leading-relaxed">
                            Connect with the immortal guiding spirits of India.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-2 perspective-2000">
                    {PERSONAS.map((persona, index) => (
                        <TiltCard
                            key={persona.id}
                            persona={persona}
                            index={index}
                            onClick={() => handleSelectPersona(persona)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UnityCouncil;
