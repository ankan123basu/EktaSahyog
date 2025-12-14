import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productSnapshot: { // Store details in case product changes/deletes
        title: String,
        image: String,
        pointsPrice: Number
    },
    shippingAddress: {
        firstName: String,
        addressLine: String, // Specific minute address
        city: String,
        state: String, // Pre-filled from backend/product region
        zipCode: String,
        phone: String
    },
    status: {
        type: String,
        enum: ['PENDING_ADDRESS', 'PROCESSING', 'SHIPPED', 'DELIVERED'],
        default: 'PENDING_ADDRESS'
    },
    pointsPaid: { type: Number, required: true },
    orderedAt: { type: Date, default: Date.now },
    shippedAt: Date
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
