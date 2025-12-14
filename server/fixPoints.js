import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const fixPoints = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        const products = await Product.find({});
        console.log(`Found ${products.length} products.`);

        for (const p of products) {
            // Set pointsPrice to regular price (or 500 if price is missing/0)
            // This fixes the hardcoded 10000 issue
            p.pointsPrice = p.price || 500;
            await p.save();
            console.log(`Updated ${p.title}: ${p.pointsPrice} points`);
        }

        console.log("All products updated!");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixPoints();
