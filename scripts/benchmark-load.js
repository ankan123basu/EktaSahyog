import autocannon from 'autocannon';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server/index.js';
import { createServer } from 'http';

const endpoints = [
    '/auth/users/count',
    '/projects',
    '/marketplace',
    '/hotspots',
    '/culture'
];

const concurrencies = [10, 50, 100];

async function runLoadBenchmark() {
    console.log("Starting in-memory MongoDB for load benchmark...");
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    const server = createServer(app);
    await new Promise(resolve => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    console.log(`\n===================================================================================================`);
    console.log(`   AUTOCANNON LOAD BENCHMARK SUITE (LATENCY PERCENTILES: P50, P90, P99)`);
    console.log(`===================================================================================================\n`);

    const resultsSummary = [];

    for (const endpoint of endpoints) {
        for (const connections of concurrencies) {
            const result = await autocannon({
                url: `${baseUrl}${endpoint}`,
                connections,
                duration: 3
            });

            resultsSummary.push({
                endpoint,
                concurrency: connections,
                reqPerSec: result.requests.average.toFixed(1),
                latencyAvgMs: result.latency.average.toFixed(2),
                p50: result.latency.p50 ? result.latency.p50.toFixed(2) : 'N/A',
                p90: result.latency.p90 ? result.latency.p90.toFixed(2) : 'N/A',
                p99: result.latency.p99 ? result.latency.p99.toFixed(2) : 'N/A',
                throughputMbSec: (result.throughput.average / (1024 * 1024)).toFixed(2)
            });
        }
    }

    server.close();
    await mongoose.disconnect();
    await mongoServer.stop();

    console.log(`\n===================================================================================================`);
    console.log(`ENDPOINT             | CONCURRENCY | REQ/SEC    | AVG LAT (MS) | P50 (MS) | P90 (MS) | P99 (MS) | THROUGHPUT`);
    console.log(`---------------------------------------------------------------------------------------------------`);
    resultsSummary.forEach(r => {
        console.log(`${r.endpoint.padEnd(20)} | ${String(r.concurrency).padEnd(11)} | ${r.reqPerSec.padEnd(10)} | ${r.latencyAvgMs.padEnd(12)} | ${r.p50.padEnd(8)} | ${r.p90.padEnd(8)} | ${r.p99.padEnd(8)} | ${r.throughputMbSec} MB/s`);
    });
    console.log(`===================================================================================================\n`);
}

runLoadBenchmark().catch(console.error);
