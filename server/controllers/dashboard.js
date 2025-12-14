import User from '../models/User.js';
import Project from '../models/Project.js';
import Product from '../models/Product.js';
import ChatMessage from '../models/ChatMessage.js';
import Resource from '../models/Resource.js';
import Story from '../models/Story.js';
import Hotspot from '../models/Hotspot.js';
import Culture from '../models/Culture.js';

export const getDashboardSummary = async (req, res) => {
    try {
        const { region } = req.query;

        // Dynamic Filter Object
        const filterLoc = region && region !== 'all' ? { location: { $regex: region, $options: 'i' } } : {};
        const filterReg = region && region !== 'all' ? { region: { $regex: region, $options: 'i' } } : {};

        const [
            userCount,
            projectCount,
            productCount,
            storyCount,
            hotspotCount,
            cultureCount,
            totalRevenue
        ] = await Promise.all([
            User.countDocuments(filterLoc),
            Project.countDocuments(filterLoc),
            Product.countDocuments(filterReg),
            Story.countDocuments(filterReg),
            Hotspot.countDocuments(filterLoc),
            Culture.countDocuments(filterReg),
            Product.aggregate([
                { $match: filterReg },
                { $group: { _id: null, total: { $sum: "$price" } } }
            ])
        ]);

        res.json({
            userCount,
            projectCount,
            productCount,
            storyCount,
            hotspotCount,
            cultureCount,
            totalRevenue: totalRevenue[0]?.total || 0
        });
    } catch (err) {
        console.error("Dashboard Summary Error:", err);
        res.status(500).json({ error: "Failed to fetch dashboard summary" });
    }
};

export const getChartData = async (req, res) => {
    try {
        const { region } = req.query;

        // Dynamic Match Stages
        const matchLoc = region && region !== 'all' ? { location: { $regex: region, $options: 'i' } } : {};
        const matchReg = region && region !== 'all' ? { region: { $regex: region, $options: 'i' } } : {};

        // 1. User Distribution (Donut - Location)
        const userMap = await User.aggregate([
            { $match: matchLoc },
            { $group: { _id: "$location", count: { $sum: 1 } } },
            { $match: { _id: { $ne: null } } },
            { $sort: { count: -1 } },
            { $limit: 8 }
        ]);

        // 2. Project Status (Pie)
        const projectStatus = await Project.aggregate([
            { $match: matchLoc },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        // 3. Hotspot Tags Distribution (Radial Bar)
        const hotspotTags = await Hotspot.aggregate([
            { $match: matchLoc },
            { $unwind: "$tags" },
            { $group: { _id: "$tags", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // 4. Top Popular Hotspots (Bar)
        const topHotspots = await Hotspot.aggregate([
            { $match: matchLoc },
            { $project: { name: 1, likes: { $size: "$likes" } } },
            { $sort: { likes: -1 } },
            { $limit: 5 }
        ]);

        // 5. Culture Categories (Donut)
        const cultureCategories = await Culture.aggregate([
            { $match: matchReg },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        // 6. Most Liked Culture (Bar)
        const topCulture = await Culture.aggregate([
            { $match: matchReg },
            { $project: { title: 1, likes: { $size: "$likes" } } },
            { $sort: { likes: -1 } },
            { $limit: 5 }
        ]);

        // 7. Market Economy (Area/Bar)
        const marketEconomy = await Product.aggregate([
            { $match: matchReg },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$price" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { value: -1 } }
        ]);

        // 8. Story Engagement (Scatter)
        const storyEngagement = await Story.aggregate([
            { $match: matchReg },
            {
                $project: {
                    title: 1,
                    // likes in Story is Number, not Array (Fixed previously)
                    likes: 1,
                    views: { $strLenCP: "$content" } // Proxy for views
                }
            },
            { $limit: 30 }
        ]);

        // 9. Resource Types (Radar)
        const resources = await Resource.aggregate([
            { $match: matchLoc },
            { $group: { _id: "$type", count: { $sum: 1 } } }
        ]);

        // 10. Chat Activity (Area)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const chatActivity = await ChatMessage.aggregate([
            { $match: { createdAt: { $gte: sevenDaysAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    messages: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 11. User Growth (Last 6 Months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const userGrowth = await User.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    users: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // 12. Revenue Growth (Last 6 Months Product Value)
        const revenueGrowth = await Product.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, ...matchReg } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    revenue: { $sum: "$price" },
                    products: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            userMap,
            projectStatus,
            hotspotTags,
            topHotspots,
            cultureCategories,
            topCulture,
            marketEconomy,
            storyEngagement,
            resources,
            chatActivity,
            userGrowth,
            revenueGrowth
        });

    } catch (err) {
        console.error("Dashboard Chart Data Error:", err);
        res.status(500).json({ error: "Failed to fetch chart data" });
    }
};
