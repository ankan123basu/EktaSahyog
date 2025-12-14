import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Calendar, MapPin, ArrowRight, Target, Heart, Search } from 'lucide-react';
import { Button } from '../Components/ui/Button';
import CreateProjectModal from '../Components/features/CreateProjectModal';
import ProjectDetailsModal from '../Components/features/ProjectDetailsModal'; // New Modal
import bg1 from '../Images/wmremove-transformed.png';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51QyD6yP934f820c7mRjP2a4W09121c834f820c7"); // Use your public key or env var

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [allProjects, setAllProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [donationMode, setDonationMode] = useState(false);

    const fetchProjects = async () => {
        try {
            const res = await fetch('http://localhost:5001/projects');
            const data = await res.json();
            setAllProjects(data);
            setProjects(data);
        } catch (err) {
            console.error("Failed to fetch projects", err);
        }
    };

    useEffect(() => {
        fetchProjects();

        // Check for payment success
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('success') === 'true') {
            // Show success message
            setTimeout(() => {
                alert('🎉 Thank you for your generous donation! Your contribution will make a real difference.');
            }, 500);

            // Clean up URL
            window.history.replaceState({}, '', '/projects');
        }
    }, []);

    useEffect(() => {
        if (searchQuery) {
            const filtered = allProjects.filter(p =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            setProjects(filtered);
        } else {
            setProjects(allProjects);
        }
    }, [searchQuery, allProjects]);

    const handleJoin = async (project) => {
        if (!user) {
            alert("Please login to join.");
            return;
        }
        try {
            const res = await fetch(`http://localhost:5001/projects/${project._id}/join`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });
            if (res.ok) {
                alert("Successfully joined! Check your email for details.");
                fetchProjects();
                setSelectedProject(null);
            }
        } catch (err) {
            console.error("Error joining project:", err);
        }
    };

    const handleLeave = async (project) => {
        if (!user) return;
        if (!confirm("Are you sure you want to cancel your participation?")) return;

        try {
            const res = await fetch(`http://localhost:5001/projects/${project._id}/leave`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });
            if (res.ok) {
                alert("Participation cancelled.");
                fetchProjects();
                setSelectedProject(null); // Close modal
            }
        } catch (err) {
            console.error("Error leaving project:", err);
        }
    };

    const handleDonate = async (project, amount) => {
        if (!amount) return;

        try {
            const res = await fetch('http://localhost:5001/projects/donate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ projectId: project._id, amount: parseInt(amount) })
            });
            const session = await res.json();

            // Redirect to Stripe Checkout using the session URL
            if (session.url) {
                window.location.href = session.url;
            } else {
                alert("Failed to create donation session. Please try again.");
            }
        } catch (err) {
            console.error("Donation failed:", err);
            alert("Donation failed. Please try again.");
        }
    };

    const isUserJoined = (project) => {
        return user && project.members && project.members.some(m => m.toString() === user._id);
    };

    return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 pb-12 bg-unity-dark relative overflow-hidden">
            {/* Background Image Overlay */}
            <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
                <img src={bg1} alt="Background" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-unity-dark/70 via-unity-dark/40 to-unity-dark" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center md:text-left mb-6">
                    <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#FF9933] via-white to-[#138808] animate-gradient-x bg-[length:200%_auto] drop-shadow-2xl tracking-tight mb-4">
                        UNITY PROJECTS
                    </h1>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-b border-white/10 pb-6">
                    <div className="max-w-2xl">
                        <p className="text-xl text-gray-300">
                            Collaborate on cross-state initiatives that make a real difference. Join a cause today.
                        </p>
                    </div>

                    <div className="flex gap-3 items-center w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Find a project..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-full py-2.5 pl-10 pr-4 text-white focus:border-unity-saffron focus:outline-none"
                            />
                        </div>
                        <Button variant="accent" onClick={() => setIsCreateModalOpen(true)} className="whitespace-nowrap shadow-lg hover:shadow-unity-saffron/20">
                            <Target className="mr-2 h-4 w-4" /> Create Project
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden flex flex-col md:flex-row group border border-white/10 hover:border-unity-indigo/50 transition-colors h-full">
                                {/* Image Section */}
                                <div className="w-full md:w-96 h-64 md:h-auto relative overflow-hidden flex-shrink-0">
                                    <img
                                        src={project.image || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&q=80&w=800"}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                                    {/* Tags */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        {project.tags && project.tags.map(tag => (
                                            <span key={tag} className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="p-6 md:p-8 flex-1 flex flex-col relative">
                                    {/* Active Badge */}
                                    <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-xs font-bold text-white tracking-wider">ACTIVE</span>
                                    </div>

                                    <div className="mb-4 pr-24">
                                        <h3 className="text-2xl font-display text-white mb-2 group-hover:text-unity-saffron transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-400">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} className="text-unity-emerald" />
                                                <span>{project.location}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-unity-coral" />
                                                <span>{project.date ? new Date(project.date).toLocaleDateString() : 'TBD'}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-gray-300 mb-6 flex-1 line-clamp-3">
                                        {project.description}
                                    </p>

                                    {/* Stats & Actions */}
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-auto border-t border-white/10 pt-6">

                                        {/* Stats Grid */}
                                        <div className="flex items-center gap-6">
                                            {/* Dynamic Volunteers Count */}
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg">
                                                    <Users size={20} className="text-unity-indigo" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-widest">Volunteers</p>
                                                    <p className="text-white font-bold text-lg">
                                                        <span className="text-unity-saffron">{project.members ? project.members.length : 0}</span>
                                                        <span className="text-gray-500 mx-1">/</span>
                                                        {project.goalMembers}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Funds Raised */}
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white/5 rounded-lg">
                                                    <Heart size={20} className="text-unity-coral fill-current" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-400 uppercase tracking-widest">Raised</p>
                                                    <p className="text-white font-bold text-lg">
                                                        <span className="text-unity-coral">₹{project.raised || 0}</span>
                                                        <span className="text-gray-500 mx-1">/</span>
                                                        ₹{project.goalAmount}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="flex gap-3 w-full sm:w-auto">
                                            <Button
                                                variant="outline"
                                                onClick={() => { setSelectedProject(project); setDonationMode(true); }}
                                                className="flex-1 sm:flex-none border-unity-saffron/50 text-unity-saffron hover:bg-unity-saffron hover:text-white"
                                            >
                                                Donate
                                            </Button>

                                            <Button
                                                variant="primary"
                                                className="flex-1 sm:flex-none shadow-lg hover:shadow-unity-indigo/20 px-6"
                                                onClick={() => { setSelectedProject(project); setDonationMode(false); }}
                                            >
                                                {isUserJoined(project) ? "View Details" : "View Details"}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <ProjectDetailsModal
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
                project={selectedProject}
                onJoin={handleJoin}
                onLeave={handleLeave}
                onDonate={handleDonate}
                isJoined={selectedProject && isUserJoined(selectedProject)}
                initialShowDonate={donationMode}
            />

            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onProjectCreated={fetchProjects}
            />
        </div>
    );
};

export default Projects;
