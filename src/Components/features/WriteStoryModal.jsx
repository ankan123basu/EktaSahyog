import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, PenTool } from 'lucide-react';
import { Button } from '../ui/Button';

const WriteStoryModal = ({ isOpen, onClose, onStoryAdded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: '' // Region auto-fetched from user
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = {
                title: formData.title,
                content: formData.content,
                image: formData.image,
                region: user?.location || "Unknown", // Auto-fetch from user location field
                author: user ? user.name : "Anonymous",
                authorId: user ? user._id : null
            };

            await fetch('http://localhost:5001/stories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (onStoryAdded) onStoryAdded();
            onClose();
            setFormData({ title: '', content: '', image: '' });
        } catch (err) {
            console.error("Failed to publish story", err);
            alert("Failed to publish story.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-unity-dark border border-white/10 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="bg-unity-saffron/20 p-2 rounded-lg">
                                    <PenTool className="w-5 h-5 text-unity-saffron" />
                                </div>
                                <h2 className="text-xl font-display text-white">Share Your Story</h2>
                            </div>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron focus:outline-none"
                                        placeholder="Give your story a catchy title"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Your Region</label>
                                    <div className="flex items-center gap-2 bg-black/20 border border-white/10 rounded-lg p-3">
                                        <span className="inline-block px-3 py-1 bg-unity-saffron/20 text-unity-saffron text-sm font-semibold rounded-full">
                                            {JSON.parse(localStorage.getItem('user'))?.location || 'Not Set'}
                                        </span>
                                        <span className="text-gray-500 text-sm">Auto-detected from your profile</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Your Story</label>
                                <textarea
                                    required
                                    rows={8}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron focus:outline-none resize-none"
                                    placeholder="Share your experience..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron focus:outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button type="button" variant="ghost" onClick={onClose} className="mr-4">
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" className="px-8" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Publish Story
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default WriteStoryModal;
