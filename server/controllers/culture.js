import Culture from '../models/Culture.js';

/* CREATE CULTURE CARD */
export const createCulture = async (req, res) => {
    try {
        const { title, category, region, description, image } = req.body;
        const newCulture = new Culture({
            title,
            category,
            region,
            description,
            image,
            submittedBy: req.body.submittedBy, // Optional
        });
        const savedCulture = await newCulture.save();
        res.status(201).json(savedCulture);
    } catch (err) {
        res.status(409).json({ message: err.message });
    }
};

/* GET ALL CULTURE CARDS */
export const getCulture = async (req, res) => {
    try {
        const cultureCards = await Culture.find().populate('submittedBy', 'name');
        res.status(200).json(cultureCards);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* TOGGLE LIKE ON CULTURE CARD */
export const likeCulture = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const culture = await Culture.findById(id);
        if (!culture) return res.status(404).json({ message: "Culture card not found" });

        const isLiked = culture.likes.includes(userId);

        if (isLiked) {
            culture.likes = culture.likes.filter((id) => id.toString() !== userId);
        } else {
            culture.likes.push(userId);
        }

        const updatedCulture = await culture.save();
        await updatedCulture.populate('submittedBy', 'name');
        res.status(200).json(updatedCulture);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
