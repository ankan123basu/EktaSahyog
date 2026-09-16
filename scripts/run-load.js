import autocannon from 'autocannon';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server/index.js';
import { createServer } from 'http';

async function main() {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const server = createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    const endpoints = ['/auth/users/count', '/projects', '/marketplace', '/hotspots', '/culture'];
    const concurrencies = [10, 50, 100];

    console.log("ENDPOINT | CONCURRENCY | REQ/SEC | AVG LAT | P50 | P95 | P99");

    for (const ep of endpoints) {
        for (const c of concurrencies) {
            const res = await autocannon({ url: `${baseUrl}${ep}`, connections: c, duration: 2 });
            const reqSec = res.requests.average.toFixed(1);
            const avg = res.latency.average.toFixed(2);
            const p50 = (res.latency.p50 || res.latency.average).toFixed(2);
            const p95 = (res.latency.p95 || res.latency.max).toFixed(2);
            const p99 = (res.latency.p99 || res.latency.max).toFixed(2);
            console.log(`${ep} | ${c} | ${reqSec} req/s | ${avg} ms | ${p50} ms | ${p95} ms | ${p99} ms`);
        }
    }

    server.close();
    await mongoose.disconnect();
    await mongoServer.stop();
    process.exit(0);
}

main();
