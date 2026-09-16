import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../server/index.js';
import User from '../../server/models/User.js';
import bcrypt from 'bcryptjs';

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
    await User.deleteMany({});
});

describe('Auth API Endpoints', () => {
    it('POST /auth/register - registers a new user', async () => {
        const res = await request(app)
            .post('/auth/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
                location: 'Delhi'
            });

        expect(res.status).toBe(201);
        expect(res.body.email).toBe('testuser@example.com');
    });

    it('POST /auth/login - authenticates verified user and returns JWT token', async () => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const user = new User({
            name: 'Login User',
            email: 'loginuser@example.com',
            password: hashedPassword,
            isVerified: true
        });
        await user.save();

        const res = await request(app)
            .post('/auth/login')
            .send({
                email: 'loginuser@example.com',
                password: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.email).toBe('loginuser@example.com');
    });
});
