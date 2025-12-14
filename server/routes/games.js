import express from 'express';
import GameScore from '../models/GameScore.js';
import User from '../models/User.js';

const router = express.Router();

// Get user score
router.get('/score/:userId', async (req, res) => {
    try {
        let score = await GameScore.findOne({ userId: req.params.userId });
        if (!score) {
            // Create initial score record if not exists
            const user = await User.findById(req.params.userId);
            if (!user) return res.status(404).json({ msg: "User not found" });

            score = new GameScore({
                userId: user._id,
                userName: user.name
            });
            await score.save();
        }
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update spin wheel points
router.post('/spin-wheel', async (req, res) => {
    try {
        const { userId, points, badge } = req.body;

        let score = await GameScore.findOne({ userId });
        if (!score) {
            const user = await User.findById(userId);
            score = new GameScore({ userId, userName: user.name });
        }

        // Update points
        score.totalPoints += points;
        score.gamesPlayed.spinWheel.points += points;
        score.gamesPlayed.spinWheel.lastPlayed = new Date();

        // Add badge if provided and not already earned
        if (badge && !score.badges.some(b => b.name === badge.name)) {
            score.badges.push(badge);
        }

        await score.save();
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update generic game score
router.post('/update-score', async (req, res) => {
    try {
        const { userId, points } = req.body;

        let score = await GameScore.findOne({ userId });
        if (!score) {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ msg: "User not found" });
            score = new GameScore({ userId, userName: user.name });
        }

        // Update points
        score.totalPoints += Number(points);

        await score.save();
        console.log(`Updated score for user ${req.body.userId}: +${points} pts. New Total: ${score.totalPoints}`);
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const leaderboard = await GameScore.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userObj'
                }
            },
            {
                $match: {
                    'userObj': { $ne: [] } // Filter out scores where user no longer exists
                }
            },
            {
                $sort: { totalPoints: -1 }
            },
            {
                $limit: 10
            },
            {
                $project: {
                    userName: 1,
                    totalPoints: 1,
                    badges: 1
                }
            }
        ]);
        res.json(leaderboard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
