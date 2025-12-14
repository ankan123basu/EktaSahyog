import React, { useState } from 'react';
import { Search, Filter, Download, Box, FileText, Share2 } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import { motion } from 'framer-motion';

import axios from 'axios';
import AddResourceModal from '../Components/features/AddResourceModal';


const Resources = () => {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const [resources, setResources] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchResources = async () => {
        try {
            const { data } = await axios.get(`http://localhost:5000/resources?type=${filter}&search=${search}`);
            setResources(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, [filter, search]);

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-display text-white mb-2">RESOURCE EXCHANGE</h1>
                        <p className="text-gray-400">Share knowledge, tools, and assets to empower every community.</p>
                    </div>
                    <Button variant="accent" onClick={() => setIsModalOpen(true)}>
                        <Share2 className="mr-2 w-4 h-4" /> Share Resource
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8 bg-white/5 p-4 rounded-lg border border-white/10">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search resources..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 py-2 pl-10 pr-4 text-white rounded focus:border-unity-emerald focus:outline-none"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === 'all' ? 'bg-unity-emerald text-black' : 'text-gray-300 hover:bg-white/10'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('digital')}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === 'digital' ? 'bg-unity-emerald text-black' : 'text-gray-300 hover:bg-white/10'}`}
                        >
                            Digital
                        </button>
                        <button
                            onClick={() => setFilter('physical')}
                            className={`px-4 py-2 rounded text-sm font-medium transition-colors ${filter === 'physical' ? 'bg-unity-emerald text-black' : 'text-gray-300 hover:bg-white/10'}`}
                        >
                            Physical
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full text-center text-gray-400">Loading resources...</div>
                    ) : resources.map((resource, index) => (
                        <motion.div
                            key={resource._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="retro-card bg-unity-dark p-6 group hover:border-unity-emerald/50 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${resource.type === 'digital' ? 'bg-blue-500/10 text-blue-400' : 'bg-orange-500/10 text-orange-400'}`}>
                                    {resource.type === 'digital' ? <FileText size={24} /> : <Box size={24} />}
                                </div>
                                <span className="text-xs px-2 py-1 rounded border border-white/10 text-gray-400">
                                    {resource.category || 'General'}
                                </span>
                            </div>

                            <h3 className="text-lg font-display text-white mb-2 group-hover:text-unity-emerald transition-colors">
                                {resource.title}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-400 mb-6">
                                <p>By: <span className="text-white">{resource.uploadedBy?.name || "Community Member"}</span></p>
                                <p>Language: <span className="text-white">{resource.language || "N/A"}</span></p>
                                {resource.location && <p>Location: <span className="text-white">{resource.location}</span></p>}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <span className="text-xs text-gray-500">
                                    {resource.type === 'digital' ? 'Downloadable' : 'Available for pickup'}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hover:bg-unity-emerald hover:text-black hover:border-unity-emerald"
                                    onClick={() => window.open(resource.url, '_blank')}
                                >
                                    {resource.type === 'digital' ? <Download size={16} /> : 'Request'}
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                <AddResourceModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={fetchResources}
                />
            </div>
        </div>
    );
};

export default Resources;
