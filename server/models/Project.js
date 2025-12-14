import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    goalAmount: { type: Number, required: true }, // Funding goal in INR
    goalMembers: { type: Number, required: true }, // Target no. of volunteers
    raised: { type: Number, default: 0 },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Volunteers joined
    location: { type: String, required: true }, // e.g., "Kerala"
    date: { type: Date, required: true }, // Target Date
    tags: [{ type: String }],
    image: { type: String },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['Active', 'Completed'], default: 'Active' },
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
