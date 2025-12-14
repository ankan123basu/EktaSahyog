import Community from '../models/Community.js';
import Product from '../models/Product.js';
// import Project from '../models/Project.js'; // To be implemented

export const getMapData = async (req, res) => {
    try {
        const { region } = req.query;
        let markers = [];

        // Fetch Communities
        const communities = await Community.find(region && region !== 'All India' ? { 'region.properties.name': region } : {});
        const communityMarkers = communities.map(c => ({
            id: c._id,
            title: c.title,
            type: 'community',
            pos: c.region.coordinates.reverse(), // GeoJSON is [lon, lat], Leaflet needs [lat, lon]
            details: c.description
        }));
        markers = [...markers, ...communityMarkers];

        // Fetch Artisans (Products)
        // For now, we'll assume products have a simple string region, but in a real app, we'd geocode it or use the seller's location
        // Mocking coordinates for string regions for demo purposes if not GeoJSON
        const products = await Product.find({});
        const artisanMarkers = products.map(p => ({
            id: p._id,
            title: p.artisan,
            type: 'artisan',
            pos: getMockCoordinates(p.region), // Helper to get coords from string region
            details: p.category
        }));
        markers = [...markers, ...artisanMarkers];

        // Mock Projects for now until Project model is fully integrated
        const projectMarkers = [
            { id: 'p1', title: "Mumbai Relief Project", type: "project", pos: [19.0760, 72.8777], details: "Disaster Relief" },
            { id: 'p2', title: "Bangalore Tech Volunteers", type: "project", pos: [12.9716, 77.5946], details: "Education" }
        ];
        markers = [...markers, ...projectMarkers];

        res.status(200).json(markers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Helper function to return mock coordinates for Indian states/cities
const getMockCoordinates = (regionName) => {
    const coords = {
        'Assam': [26.2006, 92.9376],
        'Kashmir': [33.7782, 76.5762],
        'Rajasthan': [27.0238, 74.2179],
        'Maharashtra': [19.7515, 75.7139],
        'Tamil Nadu': [11.1271, 78.6569],
        'Tripura': [23.9408, 91.9882],
        'Delhi': [28.7041, 77.1025],
        'Mumbai': [19.0760, 72.8777],
        'Chennai': [13.0827, 80.2707],
        'Kolkata': [22.5726, 88.3639],
        'Guwahati': [26.1445, 91.7362],
        'Bangalore': [12.9716, 77.5946]
    };
    return coords[regionName] || [20.5937, 78.9629]; // Default to center of India
};
