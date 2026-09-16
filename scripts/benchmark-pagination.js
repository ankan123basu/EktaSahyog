import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Story from '../server/models/Story.js';

async function runPaginationBenchmark() {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    console.log("Seeding 5,000 dummy stories into memory MongoDB...");
    const dummyStories = [];
    for (let i = 0; i < 5000; i++) {
        dummyStories.push({
            title: `Story #${i}`,
            content: `Content for story ${i} detailing community initiatives and unity across states.`,
            author: `Author_${i % 100}`,
            region: `State_${i % 28}`
        });
    }
    await Story.insertMany(dummyStories);

    // 1. Unpaginated Query
    const startUnpaginated = performance.now();
    const unpaginatedResults = await Story.find({});
    const endUnpaginated = performance.now();
    const unpaginatedMs = endUnpaginated - startUnpaginated;

    // 2. Paginated Query (Page 1, 20 items)
    const startPaginated = performance.now();
    const paginatedResults = await Story.find({}).sort({ createdAt: -1 }).skip(0).limit(20);
    const endPaginated = performance.now();
    const paginatedMs = endPaginated - startPaginated;

    const speedupPct = (((unpaginatedMs - paginatedMs) / unpaginatedMs) * 100).toFixed(2);

    console.log(`\n=== DATABASE PAGINATION BENCHMARK (5,000 RECORDS) ===`);
    console.log(`Unpaginated (5,000 items): ${unpaginatedMs.toFixed(2)} ms (Returned: ${unpaginatedResults.length})`);
    console.log(`Paginated (20 items):       ${paginatedMs.toFixed(2)} ms (Returned: ${paginatedResults.length})`);
    console.log(`Latency Reduction:          ${speedupPct}%\n`);

    await mongoose.disconnect();
    await mongoServer.stop();
}

runPaginationBenchmark().catch(console.error);
