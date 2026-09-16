import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import jwt from 'jsonwebtoken';
import app from '../../server/index.js';
import Product from '../../server/models/Product.js';
import User from '../../server/models/User.js';

let mongoServer;
let token;
let userId;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }
    await mongoose.connect(uri);

    const user = new User({
        name: 'Artisan User',
        email: 'artisan@example.com',
        password: 'hashedpassword',
        isVerified: true
    });
    const savedUser = await user.save();
    userId = savedUser._id;
    token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'testsecret', { expiresIn: '7d' });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

beforeEach(async () => {
    await Product.deleteMany({});
});

describe('Marketplace API Endpoints', () => {
    it('GET /marketplace - fetches product list', async () => {
        const product = new Product({
            title: 'Kashmiri Shawl',
            price: 2500,
            artisan: 'Master Weaver',
            region: 'Kashmir',
            category: 'Textiles',
            image: 'http://example.com/shawl.jpg'
        });
        await product.save();

        const res = await request(app).get('/marketplace');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].title).toBe('Kashmiri Shawl');
    });

    it('POST /marketplace/create - creates a new product when authenticated', async () => {
        const res = await request(app)
            .post('/marketplace/create')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Jaipur Blue Pottery',
                price: 1200,
                artisan: 'Rajasthan Craft',
                region: 'Rajasthan',
                category: 'Handicrafts',
                image: 'http://example.com/pottery.jpg'
            });

        expect(res.status).toBe(201);
        expect(res.body.title).toBe('Jaipur Blue Pottery');
    });
});
