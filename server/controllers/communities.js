import Community from '../models/Community.js';
import User from '../models/User.js';

/* GET RECOMMENDED COMMUNITIES */
export const getRecommendedCommunities = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // Find communities near user's region
        // Assuming user.region is a GeoJSON Point
        const communities = await Community.find({
            region: {
                $near: {
                    $geometry: user.region,
                    $maxDistance: 50000 // 50km radius
                }
            }
        });

        // If no local communities, return popular ones or all
        if (communities.length === 0) {
            const allCommunities = await Community.find().limit(10);
            return res.status(200).json(allCommunities);
        }

        res.status(200).json(communities);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* CREATE COMMUNITY (For testing/seeding) */
export const createCommunity = async (req, res) => {
    try {
        const { title, description, region, languages, tags } = req.body;
        const newCommunity = new Community({
            title,
            description,
            region,
            languages,
            tags,
            createdBy: req.user.id,
            members: [req.user.id]
        });
        const savedCommunity = await newCommunity.save();
        res.status(201).json(savedCommunity);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
