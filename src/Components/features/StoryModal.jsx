import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, Heart, MessageSquare, Share2, Send, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

const StoryModal = ({ isOpen, onClose, story, onUpdate }) => {
    const [commentText, setCommentText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const user = JSON.parse(localStorage.getItem('user'));

    if (!story) return null;

    const handleLike = async () => {
        if (!user) {
            alert('Please login to like stories');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5001/stories/${story._id}/like`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            const updatedStory = await res.json();
            if (onUpdate) onUpdate(updatedStory);
        } catch (err) {
            console.error('Failed to like story:', err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to comment');
            return;
        }
        if (!commentText.trim()) return;

        setIsSubmitting(true);
        try {
            const res = await fetch(`http://localhost:5001/stories/${story._id}/comment`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user._id,
                    userName: user.name,
                    text: commentText
                })
            });

            const updatedStory = await res.json();
            if (onUpdate) onUpdate(updatedStory);
            setCommentText('');
        } catch (err) {
            console.error('Failed to add comment:', err);
            alert('Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!user) return;

        try {
            const res = await fetch(`http://localhost:5001/stories/${story._id}/comment/${commentId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user._id })
            });

            const updatedStory = await res.json();
            if (onUpdate) onUpdate(updatedStory);
        } catch (err) {
            console.error('Failed to delete comment:', err);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: story.title,
            text: `Check out this story: ${story.title} by ${story.author}`,
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
            alert('Story link copied to clipboard!');
        }
    };

    const isLiked = user && story.likedBy?.some(id => id.toString() === user._id);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-unity-dark border border-white/10 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative custom-scrollbar"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/50 hover:text-white bg-black/20 hover:bg-black/40 p-2 rounded-full transition-all z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="h-64 md:h-80 relative">
                            <img
                                src={story.image}
                                alt={story.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-unity-dark via-unity-dark/50 to-transparent" />
                            <div className="absolute bottom-6 left-6 md:left-10 right-6">
                                <span className="inline-block px-3 py-1 bg-unity-saffron text-black text-xs font-bold rounded mb-3">
                                    {story.region}
                                </span>
                                <h2 className="text-3xl md:text-4xl font-display text-white leading-tight mb-2">
                                    {story.title}
                                </h2>
                                <div className="flex items-center gap-4 text-sm text-gray-300">
                                    <div className="flex items-center gap-2">
                                        <User size={16} className="text-unity-emerald" />
                                        <span>{story.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-unity-coral" />
                                        <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 md:p-10">
                            <div className="prose prose-invert prose-lg max-w-none mb-10 text-gray-300 font-light leading-relaxed">
                                <p className="first-letter:text-5xl first-letter:font-display first-letter:text-unity-saffron first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                                    {story.content}
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-white/10 mb-8">
                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className={`gap-2 ${isLiked ? 'text-red-500 border-red-500 hover:bg-red-500/10' : 'hover:text-red-500 hover:border-red-500'}`}
                                        onClick={handleLike}
                                    >
                                        <Heart size={18} className={isLiked ? 'fill-current' : ''} />
                                        {isLiked ? 'Liked' : 'Like'} ({story.likes})
                                    </Button>
                                    <Button variant="outline" className="gap-2">
                                        <MessageSquare size={18} />
                                        {story.comments?.length || 0} Comments
                                    </Button>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="text-gray-400 hover:text-white gap-2"
                                    onClick={handleShare}
                                >
                                    <Share2 size={18} /> Share Story
                                </Button>
                            </div>

                            {/* Comments Section */}
                            <div className="border-t border-white/10 pt-6">
                                <h3 className="text-xl font-display text-white mb-6">
                                    Comments ({story.comments?.length || 0})
                                </h3>

                                {/* Comment Input */}
                                <form onSubmit={handleAddComment} className="mb-8">
                                    <div className="bg-black/20 border border-white/10 rounded-lg p-4 mb-3">
                                        <textarea
                                            value={commentText}
                                            onChange={(e) => setCommentText(e.target.value)}
                                            placeholder={user ? "Share your thoughts..." : "Login to comment"}
                                            disabled={!user || isSubmitting}
                                            rows={3}
                                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none"
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={!user || !commentText.trim() || isSubmitting}
                                            className="gap-2"
                                        >
                                            <Send size={16} />
                                            {isSubmitting ? 'Posting...' : 'Post Comment'}
                                        </Button>
                                    </div>
                                </form>

                                {/* Comments List */}
                                <div className="space-y-4">
                                    {story.comments && story.comments.length > 0 ? (
                                        story.comments.map((comment) => (
                                            <div
                                                key={comment._id}
                                                className="bg-white/5 border border-white/10 rounded-lg p-4"
                                            >
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 bg-unity-saffron/20 rounded-full flex items-center justify-center">
                                                            <User size={16} className="text-unity-saffron" />
                                                        </div>
                                                        <div>
                                                            <p className="text-white font-semibold text-sm">
                                                                {comment.userName || 'Anonymous'}
                                                            </p>
                                                            <p className="text-gray-500 text-xs">
                                                                {new Date(comment.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {user && comment.userId?.toString() === user._id && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment._id)}
                                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-gray-300 text-sm leading-relaxed pl-10">
                                                    {comment.text}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500 py-8">
                                            No comments yet. Be the first to share your thoughts!
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default StoryModal;
