import Resource from '../models/Resource.js';

/* CREATE RESOURCE */
export const createResource = async (req, res) => {
    try {
        const {
            title,
            description,
            type,
            url,
            language,
            category,
            location
        } = req.body;

        const newResource = new Resource({
            title,
            description,
            type,
            url,
            language,
            category, // Ensure schema has this or add it
            location, // For physical resources
            uploadedBy: req.user.id,
        });

        const savedResource = await newResource.save();
        res.status(201).json(savedResource);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/* GET RESOURCES */
export const getResources = async (req, res) => {
    try {
        const { type, search } = req.query;
        let query = {};

        if (type && type !== 'all') {
            query.type = type;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
            ];
        }

        const resources = await Resource.find(query)
            .populate('uploadedBy', 'name region')
            .sort({ createdAt: -1 });

        res.status(200).json(resources);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};
