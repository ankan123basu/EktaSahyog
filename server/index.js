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

// --- GLOBAL ERROR HANDLERS (Prevent Crash on Email/Socket Errors) ---
process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION! 💥');
    console.error(err.name, err.message);
    if (err.code === 'ECONNRESET') {
        console.log('Ignored ECONNRESET from Email/Socket');
        return;
    }
});

process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION! 💥');
    console.error(err.name, err.message);
});


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
const userIdToSocket = new Map(); // userId (database ID) -> socketId

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('join_room', (data) => {
        const room = data.room || data;
        const userName = data.userName || 'Unknown User';
        const userId = data.userId; // Database ID
        socket.join(room);

        // Track User by socket ID and database ID
        onlineUsers.set(socket.id, userName);
        if (userId) {
            userIdToSocket.set(userId, socket.id);
            console.log(`Mapped userId ${userId} -> socketId ${socket.id}`);
        }

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

    // Video Call Signaling Events
    socket.on('send_video_call_request', (data) => {
        console.log('DEBUG: Call Request:', data);

        // FIND ALL SOCKETS for this user (Fix for duplicate connections)
        const targetSocketIds = [];
        for (const [socketId, userName] of onlineUsers.entries()) {
            if (userName === data.to) {
                targetSocketIds.push(socketId);
            }
        }

        console.log('DEBUG: Target Socket IDs:', targetSocketIds);

        if (targetSocketIds.length > 0) {
            // Send to ALL active tabs of this user
            targetSocketIds.forEach(id => {
                io.to(id).emit('incoming_video_call', data);
            });
            console.log('DEBUG: Call Sent to ALL user sockets');
        } else {
            console.log('DEBUG: Target user not found!');
        }
    });

    socket.on('accept_video_call', (data) => {
        // data.callerId is a DATABASE ID, not socket ID!
        const callerSocketId = userIdToSocket.get(data.callerId);

        if (callerSocketId) {
            console.log(`Sending call_accepted to caller socket ${callerSocketId}`);
            io.to(callerSocketId).emit('call_accepted', {
                receiverSocketId: socket.id, // Send receiver's socket ID for WebRTC
                receiverName: data.receiverName, // Send receiver's name
                receiverLocation: data.receiverLocation, // Send receiver's location
                receiverLanguage: data.receiverLanguage // Send receiver's language
            });
        } else {
            console.error(`Could not find socket for caller ID ${data.callerId}`);
        }
    });

    socket.on('decline_video_call', (data) => {
        io.to(data.callerId).emit('call_declined');
    });

    // WebRTC Signaling Events
    socket.on('webrtc_offer', (data) => {
        console.log('WebRTC Offer from', socket.id, 'to', data.target);
        io.to(data.target).emit('webrtc_offer', {
            offer: data.offer,
            from: socket.id
        });
    });

    socket.on('webrtc_answer', (data) => {
        console.log('WebRTC Answer from', socket.id, 'to', data.target);
        io.to(data.target).emit('webrtc_answer', {
            answer: data.answer,
            from: socket.id
        });
    });

    socket.on('ice_candidate', (data) => {
        console.log('ICE Candidate from', socket.id, 'to', data.target);
        io.to(data.target).emit('ice_candidate', {
            candidate: data.candidate,
            from: socket.id
        });
    });

    socket.on('end_video_call', (data) => {
        console.log('Call ended by', socket.id);
        if (data.target) {
            io.to(data.target).emit('call_ended');
        }
    });

    socket.on('report_user', (data) => {
        console.log('⚠️ USER REPORTED:', data);
        // TODO: Save to database for admin review
        // db.collection('reports').insertOne({
        //    reportedUserId: data.reportedUserId,
        //    reportedName: data.reportedName,
        //    reporterName: data.reporterName,
        //    timestamp: data.timestamp
        // });
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
