import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, MessageSquare, Heart, PenTool, Search } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import StoryModal from '../Components/features/StoryModal';
import WriteStoryModal from '../Components/features/WriteStoryModal';
import bg1 from '../Images/wmremove-transformed.png';

const Stories = () => {
    const [stories, setStories] = useState([]);
    const [allStories, setAllStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchStories = async () => {
        try {
            const res = await fetch('http://localhost:5001/stories');
            const data = await res.json();
            setAllStories(data);
            setStories(data);
        } catch (err) {
            console.error("Failed to fetch stories", err);
        }
    };

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = allStories.filter(s =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.region.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setStories(filtered);
        } else {
            setStories(allStories);
        }
    }, [searchQuery, allStories]);

    const handleLike = async (storyId) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) {
                alert('Please login to like stories');
                return;
            }

            const res = await fetch(`http://localhost:5001/stories/${storyId}/like`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            const updatedStory = await res.json();

            // Update local state
            setStories(prev => prev.map(s =>
                s._id === storyId ? updatedStory : s
            ));
            setAllStories(prev => prev.map(s =>
                s._id === storyId ? updatedStory : s
            ));
        } catch (err) {
            console.error('Failed to like story:', err);
        }
    };

    const isUserLiked = (story) => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && story.likedBy?.some(id => id.toString() === user._id);
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-unity-dark relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            <div className="absolute top-40 right-0 w-96 h-96 bg-unity-coral/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-unity-indigo/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center md:text-left mb-2">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl tracking-tight mb-2">
                        VOICES OF UNITY
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-6">
                    <div className="max-w-2xl">
                        <p className="text-xl text-gray-300">
                            Real stories from real people. Share your experience.
                        </p>
                    </div>

                    <div className="flex gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search stories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white focus:border-unity-saffron focus:outline-none"
                            />
                        </div>
                        <Button variant="accent" onClick={() => setIsWriteModalOpen(true)} className="whitespace-nowrap shadow-lg hover:shadow-unity-saffron/20">
                            <PenTool className="mr-2 h-4 w-4" /> Write Story
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col md:flex-row group border border-white/10 hover:border-unity-indigo/50 transition-colors">
                                <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden relative">
                                    <img
                                        src={story.image}
                                        alt={story.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                                </div>

                                <div className="p-6 md:p-8 flex-1 flex flex-col">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                                        <h2 className="text-2xl font-display text-white group-hover:text-unity-saffron transition-colors">
                                            {story.title}
                                        </h2>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                            <User size={14} className="text-unity-emerald" />
                                            <span>{story.author}</span>
                                            <span className="w-1 h-1 bg-gray-600 rounded-full" />
                                            <span className="text-unity-saffron">{story.region}</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 leading-relaxed mb-6 font-light text-lg italic flex-1">
                                        "{story.preview}"
                                    </p>

                                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                        <div className="flex gap-6">
                                            <button
                                                onClick={() => handleLike(story._id)}
                                                className={`flex items-center gap-2 transition-colors group/btn ${isUserLiked(story)
                                                    ? 'text-red-500'
                                                    : 'text-gray-400 hover:text-red-500'
                                                    }`}
                                            >
                                                <Heart
                                                    size={18}
                                                    className={isUserLiked(story) ? 'fill-current' : ''}
                                                />
                                                <span className="text-sm">{story.likes}</span>
                                            </button>
                                            <button className="flex items-center gap-2 text-gray-400 hover:text-unity-indigo transition-colors">
                                                <MessageSquare size={18} />
                                                <span className="text-sm">{story.comments?.length || 0}</span>
                                            </button>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            className="text-unity-saffron hover:text-white hover:bg-white/5"
                                            onClick={() => setSelectedStory(story)}
                                        >
                                            Read Full Story
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <StoryModal
                isOpen={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                story={selectedStory}
                onUpdate={(updatedStory) => {
                    setStories(prev => prev.map(s =>
                        s._id === updatedStory._id ? updatedStory : s
                    ));
                    setAllStories(prev => prev.map(s =>
                        s._id === updatedStory._id ? updatedStory : s
                    ));
                    setSelectedStory(updatedStory);
                }}
            />

            <WriteStoryModal
                isOpen={isWriteModalOpen}
                onClose={() => setIsWriteModalOpen(false)}
                onStoryAdded={fetchStories}
            />
        </div>
    );
};

export default Stories;
