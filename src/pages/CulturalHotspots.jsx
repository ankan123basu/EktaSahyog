import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ArrowRight, Plus, X, Loader2, Heart } from 'lucide-react';
import BackgroundBeams from '../Components/ui/BackgroundBeams';
import { Button } from '../Components/ui/Button';
import axios from 'axios';
import HotspotDetailsModal from '../Components/features/HotspotDetailsModal';
import bg1 from '../Images/wmremove-transformed.png'; // Updated background

const CulturalHotspots = () => {
    const [hotspots, setHotspots] = useState([]);
    const [filteredHotspots, setFilteredHotspots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedHotspot, setSelectedHotspot] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));

    // Filter State
    const [locationFilter, setLocationFilter] = useState("");
    const [uniqueLocations, setUniqueLocations] = useState([]);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        tags: '',
        image: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHotspots();
    }, []);

    useEffect(() => {
        let result = hotspots;
        if (locationFilter) {
            result = result.filter(h => h.location.toLowerCase().includes(locationFilter.toLowerCase()));
        }
        setFilteredHotspots(result);

        // Extract unique locations for potential dropdown suggestions (simple approach for now)
        const locs = [...new Set(hotspots.map(h => h.location))];
        setUniqueLocations(locs);
    }, [hotspots, locationFilter]);

    const fetchHotspots = async () => {
        try {
            const res = await axios.get('http://localhost:5001/hotspots');
            setHotspots(res.data);
            setFilteredHotspots(res.data);
        } catch (err) {
            console.error("Error fetching hotspots:", err);
        } finally {
            setLoading(false);
        }
    };

    // ... handleSubmit is unchanged (can keep existing) ...
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5001/hotspots', {
                ...formData,
                tags: formData.tags.split(',').map(t => t.trim())
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchHotspots();
            setIsModalOpen(false);
            setFormData({ name: '', location: '', description: '', tags: '', image: '' });
        } catch (err) {
            console.error("Error adding hotspot:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (id) => {
        if (!user) {
            alert("Please login to like.");
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5001/hotspots/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.status === 200) {
                const updatedSpot = res.data;

                const updateState = (prev) => prev.map(s =>
                    s._id === updatedSpot._id ? updatedSpot : s
                );

                setHotspots(updateState);
                // Also update filtered list to reflect changes immediately
                setFilteredHotspots(updateState);

                if (selectedHotspot && selectedHotspot._id === updatedSpot._id) {
                    setSelectedHotspot(updatedSpot);
                }
            }
        } catch (err) {
            console.error("Error liking hotspot:", err);
        }
    };

    const handleShare = async (spot) => {
        const shareData = {
            title: `Explore ${spot.name}`,
            text: `Check out this cultural hotspot: ${spot.name} in ${spot.location}. ${spot.description}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            const text = `${shareData.title}\n\n${shareData.text}\n\nLink: ${shareData.url}`;
            navigator.clipboard.writeText(text);
            alert('Hotspot details copied to clipboard!');
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 relative bg-unity-dark overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>
            <BackgroundBeams />

            <div className="relative z-10 mb-12 max-w-7xl mx-auto">
                <div className="text-center md:text-left mb-2">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl tracking-tight mb-2">
                        CULTURAL HOTSPOTS
                    </h1>
                </div>

                {/* Subheading + Button + Filter Row */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-6">
                    <div className="max-w-2xl">
                        <p className="text-xl text-gray-300">
                            Discover and share the hidden gems of India's heritage.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Search/Filter Input */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Filter by State..."
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white focus:border-unity-saffron outline-none w-full md:w-64"
                            />
                            <MapPin className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        </div>

                        {/* List Hotspot Button */}
                        <Button
                            variant="accent"
                            onClick={() => setIsModalOpen(true)}
                            className="shadow-[0_0_20px_rgba(245,158,11,0.3)] whitespace-nowrap px-6 py-2.5 h-full"
                        >
                            <Plus className="mr-2 w-4 h-4" /> List a Hotspot
                        </Button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20 relative z-10">
                    <Loader2 className="w-12 h-12 text-unity-saffron animate-spin" />
                </div>
            ) : (
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                    {filteredHotspots.map((spot, i) => (
                        <motion.div
                            key={spot._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="bg-black/40 backdrop-blur-md rounded-xl overflow-hidden border border-white/10 group h-full flex flex-col hover:border-unity-saffron/50 transition-colors">
                                <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => setSelectedHotspot(spot)}>
                                    <img
                                        src={spot.image}
                                        alt={spot.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs text-white flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-unity-saffron" /> {spot.location}
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-2xl font-display text-white group-hover:text-unity-saffron transition-colors">
                                            {spot.name}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleLike(spot._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm"
                                            >
                                                <Heart className={`w-4 h-4 ${spot.likes.includes(user?._id) ? 'fill-red-500 text-red-500' : ''}`} />
                                                {spot.likes.length}
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                                        {spot.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {spot.tags.map((tag, j) => (
                                            <span key={j} className="text-xs bg-white/5 border border-white/10 px-2 py-1 rounded text-gray-300">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
                                        <span className="text-xs text-gray-500">Added by {spot.addedBy?.name || 'Unknown'}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-unity-emerald hover:text-white p-0"
                                            onClick={() => setSelectedHotspot(spot)}
                                        >
                                            View Details <ArrowRight className="ml-1 w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Add Hotspot Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-unity-dark border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h2 className="text-2xl font-display text-white">Add Cultural Hotspot</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Name of Place</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron outline-none"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Location (State/City)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron outline-none"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron outline-none"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Tags (comma separated)</label>
                                    <input
                                        type="text"
                                        placeholder="Temple, History, Nature"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron outline-none"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron outline-none"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full mt-4"
                                    disabled={submitting}
                                >
                                    {submitting ? <Loader2 className="animate-spin w-5 h-5" /> : "List Hotspot"}
                                </Button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <HotspotDetailsModal
                isOpen={!!selectedHotspot}
                onClose={() => setSelectedHotspot(null)}
                hotspot={selectedHotspot}
                currentUser={user}
                onLike={handleLike}
            />
        </div>
    );
};

export default CulturalHotspots;
