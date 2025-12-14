import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

const AddCultureModal = ({ isOpen, onClose, onCultureAdded }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Festival',
        region: '',
        description: '',
        image: '' // Changed to string for URL input
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const payload = {
                ...formData,
                submittedBy: user ? user._id : null
            };

            await fetch('http://localhost:5001/culture', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (onCultureAdded) onCultureAdded();
            onClose();
            setFormData({
                title: '',
                category: 'Festival',
                region: '',
                description: '',
                image: ''
            });
        } catch (err) {
            console.error("Failed to add culture card", err);
            alert("Failed to add culture card.");
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
                        className="bg-unity-dark border border-white/10 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-display text-white">Share Your Culture</h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-unity-saffron focus:outline-none"
                                    placeholder="e.g., Bihu Festival"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-unity-saffron focus:outline-none"
                                    >
                                        <option>Festival</option>
                                        <option>Art</option>
                                        <option>Food</option>
                                        <option>Dance</option>
                                        <option>Music</option>
                                        <option>Heritage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Region/State</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.region}
                                        onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-unity-saffron focus:outline-none"
                                        placeholder="e.g., Assam"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-unity-saffron focus:outline-none resize-none"
                                    placeholder="Tell us about this cultural element..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                                <input
                                    type="url"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg p-2.5 text-white focus:border-unity-saffron focus:outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="pt-4">
                                <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Submit for Review
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default AddCultureModal;
