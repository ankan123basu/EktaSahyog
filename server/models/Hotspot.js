import mongoose from 'mongoose';

const HotspotSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL or base64
        required: true
    },
    tags: [{
        type: String
    }],
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Hotspot = mongoose.model('Hotspot', HotspotSchema);
export default Hotspot;
