import express from 'express';
import Hotspot from '../models/Hotspot.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all hotspots
router.get('/', async (req, res) => {
    try {
        const hotspots = await Hotspot.find().sort({ createdAt: -1 }).populate('addedBy', 'name');
        res.json(hotspots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new hotspot
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, location, description, image, tags } = req.body;
        const newHotspot = new Hotspot({
            name,
            location,
            description,
            image,
            tags,
            addedBy: req.user.id
        });
        const savedHotspot = await newHotspot.save();
        await savedHotspot.populate('addedBy', 'name'); // Populate here
        res.status(201).json(savedHotspot);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Like a hotspot
router.put('/:id/like', verifyToken, async (req, res) => {
    try {
        const hotspot = await Hotspot.findById(req.params.id);

        if (hotspot.likes.includes(req.user.id)) {
            // Unlike
            hotspot.likes = hotspot.likes.filter(id => id.toString() !== req.user.id);
        } else {
            // Like
            hotspot.likes.push(req.user.id);
        }

        await hotspot.save();
        await hotspot.populate('addedBy', 'name'); // Populate here
        res.json(hotspot);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
