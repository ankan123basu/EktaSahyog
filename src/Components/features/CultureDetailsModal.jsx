import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Tag, Heart, Share2, User } from 'lucide-react';
import { Button } from '../ui/Button';

const CultureDetailsModal = ({ isOpen, onClose, culture, currentUser, onLike }) => {
    if (!culture) return null;

    const modalRef = useRef(null);

    const handleShare = async () => {
        const shareData = {
            title: `Unveiling ${culture.title}`,
            text: `Discover ${culture.title} from ${culture.region} on Ekta Sahyog!\n\n${culture.description}`,
            url: window.location.href
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            const text = `${shareData.title}\n\n${shareData.text}\n\nCheck it out here: ${shareData.url}`;
            navigator.clipboard.writeText(text);
            alert('Link and details copied to clipboard! You can paste it in WhatsApp or Email.');
        }
    };

    const isLiked = currentUser && Array.isArray(culture.likes) && culture.likes.includes(currentUser._id);
    const likesCount = Array.isArray(culture.likes) ? culture.likes.length : (typeof culture.likes === 'number' ? culture.likes : 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        ref={modalRef}
                        className="bg-unity-dark border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
                    >
                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                            <img
                                src={culture.image}
                                alt={culture.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r" />
                            <div className="absolute top-4 left-4 flex gap-2">
                                <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/20 flex items-center gap-1">
                                    <Tag size={12} className="text-unity-saffron" /> {culture.category}
                                </span>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-display text-white mb-2">{culture.title}</h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <MapPin size={16} className="text-unity-emerald" />
                                        <span>{culture.region}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="prose prose-invert max-w-none mb-8 flex-1">
                                <p className="text-gray-300 leading-relaxed text-lg">
                                    {culture.description}
                                </p>
                            </div>

                            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">
                                <div className="flex items-center justify-between text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <User size={16} />
                                        <span>Submitted by {culture.submittedBy?.name || 'Community Member'}</span>
                                    </div>
                                    <span>{new Date(culture.createdAt).toLocaleDateString()}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        variant="outline"
                                        onClick={() => onLike(culture)}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <Heart size={18} className={isLiked ? "fill-unity-coral text-unity-coral" : ""} />
                                        {likesCount} Likes
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={handleShare}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        <Share2 size={18} /> Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CultureDetailsModal;
