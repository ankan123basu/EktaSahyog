import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    artisan: { type: String, required: true },
    region: { type: String, required: true },
    category: { type: String, required: true }, // e.g., Textiles, Handicrafts
    size: { type: String }, // e.g., "M", "L", "10x10", etc.
    image: { type: String, required: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pointsPrice: { type: Number, default: 10000 },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
