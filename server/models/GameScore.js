import mongoose from 'mongoose';

const GameScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    gamesPlayed: {
        spinWheel: {
            lastPlayed: Date,
            points: { type: Number, default: 0 }
        },
        quiz: {
            lastPlayed: Date,
            points: { type: Number, default: 0 }
        },
        treasureHunt: {
            lastPlayed: Date,
            points: { type: Number, default: 0 }
        }
    },
    badges: [{
        name: String,
        earnedAt: { type: Date, default: Date.now },
        icon: String
    }]
}, { timestamps: true });

const GameScore = mongoose.model('GameScore', GameScoreSchema);
export default GameScore;
