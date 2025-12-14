import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for Google Auth
    googleId: { type: String, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date },
    region: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: {
            type: [Number],
            default: [0, 0], // [longitude, latitude]
        },
    },
    location: { type: String }, // e.g., "Punjab", "Kerala"
    language: { type: String, default: 'English' },
    bio: { type: String },
    skills: [{ type: String }],
    joinedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
    role: { type: String, default: 'user' },
}, { timestamps: true });

UserSchema.index({ region: '2dsphere' });

export default mongoose.model('User', UserSchema);
