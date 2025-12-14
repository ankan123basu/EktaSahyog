import React, { useState } from 'react';
import { X, Loader2, Upload, Target } from 'lucide-react';
import { Button } from '../ui/Button';
import axios from 'axios';

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        date: '',
        goalMembers: '',
        goalAmount: '',
        tags: '', // Comma separated
        image: '' // URL
    });

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };

            const payload = {
                ...formData,
                tags: formData.tags.split(',').map(tag => tag.trim()),
                goalMembers: parseInt(formData.goalMembers),
                goalAmount: parseInt(formData.goalAmount)
            };

            await axios.post('http://localhost:5001/projects', payload, config);
            onProjectCreated();
            onClose();
            setFormData({
                title: '',
                description: '',
                location: '',
                date: '',
                goalMembers: '',
                goalAmount: '',
                tags: '',
                image: ''
            });
        } catch (err) {
            console.error("Failed to create project", err);
            alert("Failed to create project. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-unity-dark border border-white/10 w-full max-w-lg retro-card p-6 relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>

                <h2 className="text-xl font-display text-white mb-6 flex items-center gap-2">
                    <Target className="text-unity-saffron" /> Create Unity Project
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Project Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none h-20"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Target Date</label>
                            <input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Goal Members</label>
                            <input
                                type="number"
                                value={formData.goalMembers}
                                onChange={(e) => setFormData({ ...formData, goalMembers: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Goal Amount (₹)</label>
                            <input
                                type="number"
                                value={formData.goalAmount}
                                onChange={(e) => setFormData({ ...formData, goalAmount: e.target.value })}
                                className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Tags (comma separated)</label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            placeholder="Education, Environment, Youth"
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            placeholder="https://example.com/image.jpg"
                            className="w-full bg-black/20 border border-white/10 p-2 text-white focus:border-unity-saffron focus:outline-none"
                            required
                        />
                    </div>

                    <Button variant="primary" className="w-full mt-4" disabled={isLoading}>
                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 w-4 h-4" />}
                        Create Project
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;
