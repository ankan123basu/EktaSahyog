import mongoose from 'mongoose';

const CommunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    region: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    languages: [{ type: String }],
    tags: [{ type: String }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    resources: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

CommunitySchema.index({ region: '2dsphere' });

export default mongoose.model('Community', CommunitySchema);
