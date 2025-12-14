import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, MapPin, Users, Target, Heart } from 'lucide-react';
import { Button } from '../ui/Button';

const ProjectDetailsModal = ({ isOpen, onClose, project, onJoin, onLeave, onDonate, isJoined, initialShowDonate }) => {
    const [showDonate, setShowDonate] = React.useState(initialShowDonate || false);
    const [amount, setAmount] = React.useState("500");

    useEffect(() => {
        if (isOpen) {
            setShowDonate(initialShowDonate || false);
        }
    }, [isOpen, initialShowDonate]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-unity-dark border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => { setShowDonate(false); onClose(); }}
                            className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Image Section */}
                        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
                            <img
                                src={project.image}
                                alt={project.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-unity-dark via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                                {project.tags && project.tags.map(tag => (
                                    <span key={tag} className="text-xs font-bold text-white bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto custom-scrollbar">
                            <div className="mb-6">
                                <h2 className="text-3xl font-display text-white mb-2">{project.title}</h2>
                                <div className="flex flex-col gap-2 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-unity-emerald" />
                                        <span>{project.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-unity-coral" />
                                        <span>{project.date ? new Date(project.date).toLocaleDateString() : 'TBD'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-unity-saffron" />
                                        <span>{project.members ? project.members.length : 0} / {project.goalMembers} Volunteers</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Heart size={16} className="text-unity-coral fill-current" />
                                        <span>₹{project.raised || 0} / ₹{project.goalAmount} Raised</span>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none text-gray-300 mb-8 flex-1">
                                <p>{project.description}</p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-auto pt-6 border-t border-white/10 flex flex-col gap-4">

                                {showDonate ? (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <label className="block text-sm text-gray-400 mb-2">Donation Amount (₹)</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="number"
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-unity-saffron outline-none"
                                            />
                                            <Button variant="accent" onClick={() => onDonate(project, amount)}>
                                                Pay
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {isJoined ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => onLeave(project)}
                                                className="w-full py-3 border-red-500/50 text-red-500 hover:bg-red-500 hover:text-white"
                                            >
                                                Cancel Participation
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="primary"
                                                onClick={() => onJoin(project)}
                                                className="w-full py-3"
                                            >
                                                <Target className="mr-2 w-4 h-4" />
                                                Confirm Participation
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {isJoined && !showDonate && (
                                    <p className="text-xs text-green-400 text-center">
                                        You are a volunteer! Check your email for details.
                                    </p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ProjectDetailsModal;
