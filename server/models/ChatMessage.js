import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
    communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' }, // Optional
    channel: { type: String, default: 'global' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Made optional for guests/testing
    userName: { type: String, required: true }, // Added for display
    text: { type: String, required: true },
    translatedText: { type: String }, // Simplified to String for now (English)
    sentiment: {
        score: Number, // -1.0 to 1.0
        label: String  // "POSITIVE", "NEGATIVE", "NEUTRAL"
    }
}, { timestamps: true });

export default mongoose.model('ChatMessage', ChatMessageSchema);
