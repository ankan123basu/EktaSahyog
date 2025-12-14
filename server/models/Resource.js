import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: ['digital', 'physical'], required: true },
    fileId: { type: mongoose.Schema.Types.ObjectId }, // GridFS ID for digital files
    url: { type: String }, // External URL or cloud storage link
    language: { type: String },
    category: { type: String },
    location: { type: String }, // For physical resources
    tags: [{ type: String }],
    ownerCommunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Resource', ResourceSchema);
