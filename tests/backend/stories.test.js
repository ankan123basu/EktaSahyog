import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server/index.js';
import Story from '../../server/models/Story.js';

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Story.deleteMany({});
});

describe('Stories API Endpoints', () => {
    it('GET /stories - returns list of stories', async () => {
        const story = new Story({
            title: 'Unity in Diversity in Ladakh',
            content: 'A wonderful experience visiting Pangong Lake.',
            author: 'Ankan',
            region: 'Ladakh',
            image: 'http://example.com/ladakh.jpg'
        });
        await story.save();

        const res = await request(app).get('/stories');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Unity in Diversity in Ladakh');
    });

    it('POST /stories - creates a new community story', async () => {
        const res = await request(app)
            .post('/stories')
            .send({
                title: 'Onam Celebration in Kolkata',
                content: 'Bringing Malayali tradition to West Bengal.',
                author: 'Siddharth',
                region: 'West Bengal',
                image: 'http://example.com/onam.jpg'
            });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Onam Celebration in Kolkata');
    });
});
