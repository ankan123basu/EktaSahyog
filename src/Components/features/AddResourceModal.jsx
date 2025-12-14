import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Link as LinkIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

const AddResourceModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'digital',
        category: '',
        language: '',
        url: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/resources', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
            onClose();
            setFormData({ title: '', description: '', type: 'digital', category: '', language: '', url: '', location: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to add resource');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
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
                    className="bg-unity-dark border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
                >
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-display text-white text-lg">Share a Resource</h3>
                        <button onClick={onClose} className="text-gray-400 hover:text-white">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-unity-emerald focus:outline-none"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Type</label>
                                <select
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-unity-emerald focus:outline-none"
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="digital">Digital (Link)</option>
                                    <option value="physical">Physical (Item)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Language</label>
                                <input
                                    type="text"
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-unity-emerald focus:outline-none"
                                    value={formData.language}
                                    onChange={e => setFormData({ ...formData, language: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Category</label>
                            <input
                                type="text"
                                placeholder="e.g., Education, Health, Environment"
                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-unity-emerald focus:outline-none"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>

                        {formData.type === 'digital' ? (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Resource Link (URL)</label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://..."
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 pl-9 text-white focus:border-unity-emerald focus:outline-none"
                                        value={formData.url}
                                        onChange={e => setFormData({ ...formData, url: e.target.value })}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Location / Pickup Point</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-unity-emerald focus:outline-none"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Description</label>
                            <textarea
                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-unity-emerald focus:outline-none h-24 resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <Button type="submit" variant="accent" className="w-full" disabled={loading}>
                            {loading ? 'Sharing...' : 'Share Resource'}
                        </Button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AddResourceModal;
