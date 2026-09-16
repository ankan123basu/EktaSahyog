import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server/index.js';
import Project from '../../server/models/Project.js';

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
    await Project.deleteMany({});
});

describe('Projects API Endpoints', () => {
    it('GET /projects - returns list of projects', async () => {
        const project = new Project({
            title: 'Clean Yamuna Drive',
            description: 'River cleanup initiative in Delhi',
            location: 'Delhi',
            date: new Date(),
            goalMembers: 100,
            goalAmount: 50000,
            image: 'http://example.com/yamuna.jpg'
        });
        await project.save();

        const res = await request(app).get('/projects');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Clean Yamuna Drive');
    });

    it('POST /projects - creates a new unity project', async () => {
        const res = await request(app)
            .post('/projects')
            .send({
                title: 'Solar Power for Rural School',
                description: 'Installing solar panels in Bihar village school',
                location: 'Bihar',
                date: '2026-10-01',
                goalMembers: 50,
                goalAmount: 100000,
                tags: ['Energy', 'Education'],
                image: 'http://example.com/solar.jpg'
            });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Solar Power for Rural School');
    });
});
