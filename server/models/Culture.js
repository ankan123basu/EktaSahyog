import mongoose from 'mongoose';

const CultureSchema = new mongoose.Schema({
    title: { type: String, required: true }, // e.g., "Bihu Festival"
    category: { type: String, required: true }, // Festival, Food, Art, etc.
    region: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('Culture', CultureSchema);
