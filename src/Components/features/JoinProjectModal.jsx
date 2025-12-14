import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';

const JoinProjectModal = ({ isOpen, onClose, project, onJoin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isJoined, setIsJoined] = useState(false);

    const handleJoin = async () => {
        setIsLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user) return alert("Please login to join a project.");

            await fetch(`http://localhost:5001/projects/${project._id}/join`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            setIsJoined(true);
            if (onJoin) onJoin();

            setTimeout(() => {
                setIsJoined(false);
                onClose();
            }, 2000);
        } catch (err) {
            console.error("Failed to join project", err);
            alert("Failed to join project.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-unity-dark border border-white/10 rounded-xl w-full max-w-md overflow-hidden shadow-2xl relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        {isJoined ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6"
                                >
                                    <CheckCircle className="w-10 h-10 text-green-500" />
                                </motion.div>
                                <h2 className="text-2xl font-display text-white mb-2">Welcome Aboard!</h2>
                                <p className="text-gray-400">You have successfully joined {project.title}.</p>
                            </div>
                        ) : (
                            <>
                                <div className="h-32 bg-unity-indigo/20 relative">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        className="w-full h-full object-cover opacity-50"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-unity-dark to-transparent" />
                                </div>

                                <div className="p-6 -mt-12 relative">
                                    <div className="bg-unity-dark border border-white/10 rounded-lg p-4 shadow-lg mb-6">
                                        <h2 className="text-xl font-display text-white mb-1">{project.title}</h2>
                                        <p className="text-sm text-gray-400">{project.location}</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Your Role</h3>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                                                <input type="radio" name="role" className="text-unity-indigo focus:ring-unity-indigo" defaultChecked />
                                                <div>
                                                    <span className="block text-white text-sm font-medium">Volunteer</span>
                                                    <span className="block text-gray-500 text-xs">Help with on-ground activities</span>
                                                </div>
                                            </label>
                                            <label className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors">
                                                <input type="radio" name="role" className="text-unity-indigo focus:ring-unity-indigo" />
                                                <div>
                                                    <span className="block text-white text-sm font-medium">Donor</span>
                                                    <span className="block text-gray-500 text-xs">Support the cause financially</span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <Button onClick={handleJoin} variant="primary" className="w-full py-6 text-lg" disabled={isLoading}>
                                        {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
                                        Confirm Participation
                                    </Button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default JoinProjectModal;
