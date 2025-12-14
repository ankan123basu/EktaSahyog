import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { translateText, isToxicMessage, analyzeSentiment } from './services/ai.js';
import ChatMessage from './models/ChatMessage.js';
import webhookRoutes from './routes/webhook.js';

// Load env vars
dotenv.config();
import passport from 'passport';
import './config/passport.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

// CRITICAL: Webhook route MUST come BEFORE express.json()
app.use('/webhooks', webhookRoutes);

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('common'));
app.use(passport.initialize());

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));

// Socket.io Logic
const onlineUsers = new Map(); // socketId -> userName

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_room', (data) => {
        const room = data.room || data;
        const userName = data.userName || 'Unknown User';
        socket.join(room);

        // Track User
        onlineUsers.set(socket.id, userName);

        // Broadcast updated list
        io.emit('update_online_users', Array.from(onlineUsers.values()));
        console.log(`User ${userName} joined room ${room}`);
    });

    socket.on('request_user_count', () => {
        socket.emit('update_online_users', Array.from(onlineUsers.values()));
    });

    socket.on('send_message', async (data) => {
        // data: { room, user, userId, text, time, lang }
        try {
            // 1. Check for Toxicity
            const isToxic = await isToxicMessage(data.text);
            if (isToxic) {
                socket.emit('message_blocked', {
                    error: "⚠️ Message blocked: Toxic or harmful content detected."
                });
                return; // Stop processing
            }

            // AI TRANSLATION: Translate to English (Universal Bridge)
            let translation = "";
            console.log(`Processing message: "${data.text}" | Lang: ${data.lang}`);
            try {
                // If lang is NOT English, translate to English
                if (data.lang && !data.lang.startsWith('en')) {
                    // Pass source lang (e.g., 'bn-IN') and target 'en-US'
                    translation = await translateText(data.text, data.lang, 'en-US');
                }
            } catch (aiError) {
                console.error("AI Translation failed:", aiError);
            }

            // 3. SENTIMENT ANALYSIS
            const sentiment = await analyzeSentiment(data.text);

            const newMessage = new ChatMessage({
                channel: data.room,
                userId: data.userId,
                userName: data.user, // Save userName
                text: data.text,
                translatedText: translation,
                sentiment: sentiment // Save sentiment to DB
            });
            await newMessage.save();

            // Emit with translation
            io.to(data.room).emit('receive_message', { ...data, translation, sentiment });
        } catch (err) {
            console.error("Error saving message:", err);
        }
    });

    socket.on('translate_message', async (data) => {
        try {
            const { text, targetLang, messageId } = data;
            // Use Gemini to translate to the specific target language
            const translation = await translateText(text, "auto", targetLang);

            // Send back ONLY to the requesting user
            socket.emit('message_translated', {
                messageId,
                translation,
                lang: targetLang
            });
        } catch (err) {
            console.error("On-demand translation failed:", err);
        }
    });

    socket.on('disconnect', () => {
        onlineUsers.delete(socket.id);
        io.emit('update_online_users', Array.from(onlineUsers.values()));
        console.log('Client disconnected | Total:', onlineUsers.size);
    });
});

import authRoutes from './routes/auth.js';
import marketplaceRoutes from './routes/marketplace.js';
import mapRoutes from './routes/map.js';
import resourceRoutes from './routes/resources.js';
import communityRoutes from './routes/communities.js';
import storyRoutes from './routes/stories.js';
import cultureRoutes from './routes/culture.js';
import projectRoutes from './routes/projects.js';
import aiRoutes from './routes/ai.js';
import paymentRoutes from './routes/payment.js';
import gameRoutes from './routes/games.js';
import hotspotRoutes from './routes/hotspots.js';

import dashboardRoutes from './routes/dashboard.js';
import newsletterRoutes from './routes/newsletter.js';
import councilRoutes from './routes/council.js';

// Routes
app.use('/auth', authRoutes);
app.use('/marketplace', marketplaceRoutes);
app.use('/map', mapRoutes);
app.use('/resources', resourceRoutes);
app.use('/communities', communityRoutes);
app.use('/stories', storyRoutes);
app.use('/culture', cultureRoutes);
app.use('/projects', projectRoutes);
app.use('/ai', aiRoutes);
app.use('/payment', paymentRoutes);
app.use('/games', gameRoutes);
app.use('/hotspots', hotspotRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/newsletter', newsletterRoutes);
app.use('/api/council', councilRoutes);

// Chat History Endpoint
app.get('/chat/history/:room', async (req, res) => {
    try {
        const { room } = req.params;
        const messages = await ChatMessage.find({ channel: room })
            .sort({ createdAt: 1 })
            .limit(50);

        const formattedMessages = messages.map(msg => ({
            room: msg.channel,
            user: msg.userName || 'Guest',
            text: msg.text,
            translation: msg.translatedText,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            id: msg._id
        }));
        res.json(formattedMessages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('EktaSahyog API is running');
});

// Start Server
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
