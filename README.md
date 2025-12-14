# EktaSahyog (Unity & Collaboration) 🇮🇳

> **Bridging India's Cultural Divide through Technology**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI](https://img.shields.io/badge/AI-Groq_LPU-orange)

---

## 📖 Introduction
**EktaSahyog** is a comprehensive digital platform designed to foster national unity by connecting India's diverse communities. It serves as a bridge between cultures, enabling users to share resources, trade authentic regional products, collaborate on social projects, and explore the rich heritage of India through gamified experiences.

## 🚩 Problem Statement
In an increasingly digital world, cultural fragmentation is rising. Local artisans struggle to find wider markets, regional languages create communication barriers, and the younger generation is disconnecting from their heritage. There is no single platform that integrates economic empowerment, cultural education, and social collaboration.

## 💡 Innovation & Novelty
EktaSahyog introduces the **"Dual-Reality Engine"**, a design philosophy that blends the modern digital interface with deep cultural aesthetics.
*   **Gamified Heritage**: Unlike static wikis, we use interactive games (Chess, Moksha Patam) to teach culture.
*   **Unity Points System**: Acts as a universal currency, incentivizing social good and cultural learning to drive economic trade.
*   **Groq-Powered Real-time Intelligence**: Leveraging the world's fastest AI inference (Groq LPU) for instant translation and sentiment analysis, making cross-cultural communication feel seamless.

---

## 🚀 Unique Features

### 1. Cultural Marketplace 🛍️
*   Buy and sell authentic handicrafts and regional specialties.
*   **Novelty**: Supports "Buy with Points" where users spend earned 'Unity Points' on real products.

### 2. Universal Chatroom 💬
*   Real-time global and regional chat rooms.
*   **Real-time AI Translation**: Powered by **Llama-3.1-8b-instant**, breaking language barriers instantly.
*   **Sentiment Analysis**: AI detects the emotional tone of conversations (Positive/Negative/Neutral) in real-time.
*   **Smart Summarization**: instant catch-up summaries for active chat channels.

### 3. Cultural Arcade 🎮
*   Play heritage-themed games: **Jnana Yatra** (Quiz), **Moksha Patam** (Snakes & Ladders), **Chaturanga** (Chess), **Pallanguzhi**, etc.
*   Earn points for every win to redeem in the marketplace.

### 4. Unity Projects 🤝
*   Collaborative space for cross-state initiatives (e.g., "Flood Relief for Assam", "Digital Literacy in Rural Punjab").
*   Track funding and volunteer progress visually.

### 5. AI Assistant (Ekta Saathi) 🤖
*   Powered by **Llama-3.3-70b-versatile** on Groq.
*   A context-aware cultural guide that answers questions about India's heritage, navigates the platform, and assists volunteers.

### 6. Interactive Map 🗺️
*   Visualizes cultural hotspots, active projects, and artisan locations across the Indian subcontinent.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS (Glassmorphism & Neomorphism)
*   **Animations**: Framer Motion
*   **Data Visualization**: Recharts
*   **Icons**: Lucide React

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Real-time**: Socket.io (for Chat & Notifications)
*   **Authentication**: JWT & Google OAuth 2.0
*   **Email**: Nodemailer

### Database
*   **DB**: MongoDB Atlas
*   **ODM**: Mongoose

### AI & APIs (Groq Cloud)
*   **Inference Engine**: Groq LPU (Language Processing Unit)
*   **Conversational AI**: `llama-3.3-70b-versatile` (Ekta Saathi Chatbot)
*   **Real-time Tasks**: `llama-3.1-8b-instant` (Translation, Sentiment Analysis, Summarization, Toxicity Detection)
*   **Payments**: Stripe Integration (Mock/Test Mode)

---

## 🗂️ Project Models

The application uses a robust schema architecture:

1.  **User**: Stores profile, role (admin/user), Unity Points, and gamification stats.
2.  **Product**: Marketplace items with "Price in Rupees" and "Price in Points".
3.  **Order**: Tracks purchases, shipping details, and payment status.
4.  **ChatMessage**: Stores chat history with support for translations.
5.  **Project**: Social initiatives with funding goals and volunteer tracking.
6.  **Story**: User-submitted cultural stories and memories.
7.  **Culture**: Informational cards about festivals, food, and traditions.
8.  **GameScore**: Leaderboard tracking for arcade games.
9.  **Resource**: Shared community assets (physical/digital).
10. **Hotspot**: Geo-tagged cultural locations for the map.
11. **Community**: Groups for specific interests or regions.

---

## 📂 Directory Structure

```graphql
EktaSahyog/
├── server/                 # Backend API
│   ├── config/             # DB & Env Config
│   ├── controllers/        # Logic for Routes
│   ├── models/             # Mongoose Schemas (11 Models)
│   ├── services/           # Groq AI & Email Services
│   ├── routes/             # API Endpoints
│   └── index.js            # Server Entry Point
├── src/                    # Frontend Client
│   ├── Components/         # Reusable UI & Feature Components
│   ├── pages/              # Main Route Pages (Landing, Dashboard, etc.)
│   ├── context/            # Global State (Auth, Cart, Theme)
│   └── App.jsx             # Main Component & Routing
└── public/                 # Static Assets
```

---

## ⚡ Getting Started

1.  **Clone the Repo**:
    ```bash
    git clone https://github.com/Ankan/EktaSahyog.git
    cd EktaSahyog
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    cd server && npm install
    ```

3.  **Set Environment Variables**:
    Create `.env` in root and `server/`:
    ```env
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_secret
    GROQ_API_KEY=your_groq_api_key
    ```

4.  **Run Development Server**:
    ```bash
    # Root (Frontend)
    npm run dev
    
    # Server (Backend)
    node server/index.js
    ```

---

## 👥 Made By

**Team EktaSahyog**  
*Lead Developer*: Ankan  
*Mission*: To unite India, one pixel at a time.

---

## 📜 License

**MIT License**

Copyright (c) 2025 EktaSahyog

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
