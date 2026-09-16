import { io } from 'socket.io-client';
import { createServer } from 'http';
import { Server } from 'socket.io';

async function runSocketBenchmark() {
    const httpServer = createServer();
    const ioServer = new Server(httpServer, { cors: { origin: '*' } });

    ioServer.on('connection', (socket) => {
        socket.on('ping_benchmark', (data) => {
            socket.emit('pong_benchmark', data);
        });
    });

    await new Promise((resolve) => httpServer.listen(0, resolve));
    const port = httpServer.address().port;

    const client = io(`http://localhost:${port}`);
    await new Promise((resolve) => client.on('connect', resolve));

    const totalMessages = 100;
    const rtts = [];

    for (let i = 0; i < totalMessages; i++) {
        const start = performance.now();
        await new Promise((resolve) => {
            client.emit('ping_benchmark', { seq: i });
            client.once('pong_benchmark', () => {
                const end = performance.now();
                rtts.push(end - start);
                resolve();
            });
        });
    }

    client.disconnect();
    ioServer.close();
    httpServer.close();

    const avgRtt = rtts.reduce((a, b) => a + b, 0) / rtts.length;
    const minRtt = Math.min(...rtts);
    const maxRtt = Math.max(...rtts);

    console.log(`\n=== SOCKET.IO RTT BENCHMARK (100 MESSAGES) ===`);
    console.log(`Average RTT: ${avgRtt.toFixed(2)} ms`);
    console.log(`Min RTT:     ${minRtt.toFixed(2)} ms`);
    console.log(`Max RTT:     ${maxRtt.toFixed(2)} ms\n`);
}

runSocketBenchmark().catch(console.error);
