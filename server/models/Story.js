import mongoose from 'mongoose';

const StorySchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    preview: { type: String }, // First 150 chars of content for card display
    author: { type: String, required: true }, // Display name
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    region: { type: String, required: true },
    image: { type: String }, // Cover image URL
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Track who liked
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        userName: { type: String }, // Display name for comments
        text: String,
        createdAt: { type: Date, default: Date.now }
    }],
}, { timestamps: true });

export default mongoose.model('Story', StorySchema);
