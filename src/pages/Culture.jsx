import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Heart, Share2, Plus, Search, Filter } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import AddCultureModal from '../Components/features/AddCultureModal';
import CultureDetailsModal from '../Components/features/CultureDetailsModal';
import bg1 from '../Images/wmremove-transformed.png';

const Culture = () => {
    const [cultureCards, setCultureCards] = useState([]);
    const [allCultureCards, setAllCultureCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCulture, setSelectedCulture] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Festival", "Art", "Food", "Dance", "Music", "Heritage"];

    const fetchCulture = async () => {
        try {
            const res = await fetch('http://localhost:5001/culture');
            const data = await res.json();
            setAllCultureCards(data);
            setCultureCards(data);
        } catch (err) {
            console.error("Failed to fetch culture cards", err);
        }
    };

    useEffect(() => {
        fetchCulture();
    }, []);

    useEffect(() => {
        let filtered = allCultureCards;

        if (selectedCategory !== "All") {
            filtered = filtered.filter(card => card.category === selectedCategory);
        }

        if (searchQuery) {
            filtered = filtered.filter(card =>
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setCultureCards(filtered);
    }, [searchQuery, selectedCategory, allCultureCards]);

    const handleLike = async (card) => {
        if (!user) {
            alert("Please login to like.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/culture/${card._id}/like`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            if (res.ok) {
                const updatedCard = await res.json();

                // Update local state without refetching all
                const updateState = (prevCards) => prevCards.map(c =>
                    c._id === updatedCard._id ? updatedCard : c
                );

                setAllCultureCards(updateState);
                setCultureCards(updateState);

                // Also update selected culture if open
                if (selectedCulture && selectedCulture._id === updatedCard._id) {
                    setSelectedCulture(updatedCard);
                }
            }
        } catch (err) {
            console.error("Failed to like", err);
        }
    };

    const handleShare = async (card) => {
        const shareData = {
            title: `Unveiling ${card.title}`,
            text: `Discover ${card.title} from ${card.region} on Ekta Sahyog!\n\n${card.description}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: Copy to clipboard
            const text = `${shareData.title}\n\n${shareData.text}\n\nCheck it out here: ${shareData.url}`;
            navigator.clipboard.writeText(text);
            alert('Link and details copied to clipboard! You can paste it in WhatsApp or Email.');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-unity-dark relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-unity-indigo/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-unity-saffron/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center md:text-left mb-6">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] mb-4">
                        LEARN MY CULTURE
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-6">
                    <div className="max-w-2xl">
                        <p className="text-xl text-gray-300">
                            Discover the rich traditions, festivals, art, and food of India, one card at a time.
                        </p>
                    </div>

                    <div className="flex gap-3 items-center w-full md:w-auto flex-wrap">
                        {/* Filter Dropdown */}
                        <div className="relative">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="appearance-none bg-black/40 border border-white/10 rounded-full py-2.5 pl-4 pr-10 text-white focus:border-unity-saffron focus:outline-none cursor-pointer hover:bg-white/5 transition-colors"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3 top-3 text-gray-400 pointer-events-none w-4 h-4" />
                        </div>

                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search culture..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white focus:border-unity-saffron focus:outline-none"
                            />
                        </div>
                        <Button variant="accent" onClick={() => setIsModalOpen(true)} className="whitespace-nowrap shadow-lg hover:shadow-unity-saffron/20">
                            <Plus className="mr-2 h-4 w-4" /> Share Culture
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cultureCards.map((card, index) => {
                        const isLiked = user && Array.isArray(card.likes) && card.likes.includes(user._id);
                        const likesCount = Array.isArray(card.likes) ? card.likes.length : (typeof card.likes === 'number' ? card.likes : 0);

                        return (
                            <motion.div
                                key={card._id || index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="h-full"
                            >
                                <div className="h-full bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col border border-white/10 hover:border-unity-saffron/50 transition-colors">
                                    <div className="h-48 overflow-hidden relative group cursor-pointer" onClick={() => setSelectedCulture(card)}>
                                        <img
                                            src={card.image}
                                            alt={card.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20">
                                            {card.category}
                                        </div>
                                    </div>

                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-xl font-display text-white">{card.title}</h3>
                                            <span className="text-xs font-bold text-unity-saffron bg-unity-saffron/10 px-2 py-1 rounded border border-unity-saffron/20">
                                                {card.region}
                                            </span>
                                        </div>

                                        <p className="text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                                            {card.description}
                                        </p>

                                        <div className="flex justify-between items-center pt-4 border-t border-white/10">
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleLike(card)}
                                                    className={`hover:text-red-500 transition-colors flex items-center gap-1.5 text-xs group ${isLiked ? 'text-red-500' : 'text-gray-400'}`}
                                                >
                                                    <Heart size={16} className={`group-hover:fill-red-500 ${isLiked ? 'fill-red-500' : ''}`} />
                                                    {likesCount}
                                                </button>
                                                <button
                                                    onClick={() => handleShare(card)}
                                                    className="text-gray-400 hover:text-unity-indigo transition-colors flex items-center gap-1.5 text-xs"
                                                >
                                                    <Share2 size={16} /> Share
                                                </button>
                                            </div>
                                            <Button variant="ghost" size="sm" className="text-xs hover:bg-white/5" onClick={() => setSelectedCulture(card)}>
                                                Read More
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <AddCultureModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCultureAdded={fetchCulture}
            />

            <CultureDetailsModal
                isOpen={!!selectedCulture}
                onClose={() => setSelectedCulture(null)}
                culture={selectedCulture}
                currentUser={user}
                onLike={handleLike}
            />
        </div>
    );
};

export default Culture;
