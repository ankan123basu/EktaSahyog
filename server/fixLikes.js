import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Culture from './models/Culture.js';

dotenv.config();

const migrate = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for migration...");

        // Find all documents where likes is a number (or not an array) and set to empty array
        // Note: checking strict type in mongo is tricky if schema casts.
        // But we can just forcefully update all. 
        // Or find those where likes is NOT an array.

        // This updateMany will init likes to [] if it's not an array.
        // $type 16 is 32-bit integer, 1 is Double, 18 is 64-bit int. 4 is Array.
        // We want to update where type is NOT 4.

        const result = await Culture.updateMany(
            { likes: { $not: { $type: 4 } } },
            { $set: { likes: [] } }
        );

        console.log(`Matched ${result.matchedCount} and modified ${result.modifiedCount} documents.`);
        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

migrate();
