import autocannon from 'autocannon';
import app from '../server/index.js';
import { createServer } from 'http';

async function debug() {
    const server = createServer(app);
    await new Promise(r => server.listen(0, r));
    const port = server.address().port;

    const res = await autocannon({
        url: `http://localhost:${port}/projects`,
        connections: 50,
        duration: 2
    });

    console.log("=== RAW AUTOCANNON LATENCY OBJECT ===");
    console.log(JSON.stringify(res.latency, null, 2));

    server.close();
    process.exit(0);
}

debug();
