# EktaSahyog (Unity & Collaboration) 🇮🇳

> **Bridging India's Cultural Divide through Technology**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI](https://img.shields.io/badge/AI-Groq_LPU-orange)

---

## 📖 Introduction
**EktaSahyog** is a comprehensive digital platform designed to foster national unity by connecting India's diverse communities. It serves as a bridge between cultures, enabling users to share resources, trade authentic regional products, collaborate on social projects, and explore the rich heritage of India through gamified experiences.

## Problem Statement
In an increasingly digital world, cultural fragmentation is rising. Local artisans struggle to find wider markets, regional languages create communication barriers, and the younger generation is disconnecting from their heritage. There is no single platform that integrates economic empowerment, cultural education, and social collaboration.

## 💡 Innovation & Novelty
EktaSahyog reimagines cultural preservation through four ground-breaking pillars:

### 1. The "Dual-Reality" Commerce Engine 
Unlike standard E-commerce, we merge **3D Gaming with Real-World Trade**. 
*   **Novely**: Users don't just scroll a grid; they walk through a **living 3D Digital Haat (Metaverse)** as avatars.
*   **Interaction**: They approach virtual stalls, interact with AI villagers, and buy **physical handicrafts** that are shipped to their real homes. This "Game-to-Real" transaction model creates emotional investment in the products.

### 2. "Soul Script" Persona Technology
We moved beyond generic chatbots to create **"Living History"**.
*   **Innovation**: Our **Unity Council** uses specialized *Soul Script* prompts to simulate not just the knowledge, but the **emotional, rhetorical, and speech patterns** of legends like *Sardar Patel*, *Swami Vivekananda*, and *Netaji Bose*.
*   **Outcome**: Using **Groq's LPU**, these conversations happen in **sub-second real-time**, making it feel like a voice call with history.

### 3. The "Unity Points" Economy (Learn-to-Earn)
We solved the engagement problem by tokenizing cultural learning.
*   **Mechanism**: Users earn 'Unity Points' by winning cultural games (Chess, Quiz) or volunteering.
*   **Novelty**: These points aren't just badges—they are a **discount currency** in the Marketplace. This directly incentivizes cultural education by rewarding it with economic buying power.

### 4. Zero-Latency Linguistic Bridge
*   **Tech**: Leveraging **Groq's Llama-3**, we provide **instant, context-aware translation** in chat.
*   **Impact**: A Bengali artisan can chat in Bengali, and a Tamil buyer sees it in Tamil instantly, effectively erasing the language barrier that hinders national unity.

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

### 7. Global Unity Council (New!) 🏛️
*   **Time-Travel Dialogue**: A novel "Soul Script" engine that lets you hold real-time debates with India's founding fathers and mothers.
*   **The "Soul Script" Technology**: Unlike generic chatbots, each persona (like **Sardar Patel**, **Rabindranath Tagore**, or **Dr. APJ Abdul Kalam**) runs on a specialized system prompt that enforces strict historical accuracy, speech patterns (e.g., Urdu-infused English for Maulana Azad, fiery energy for Swami Vivekananda), and specific "Unity Values".
*   **Real-time Wisdom**: Powered by **Llama-3.1 on Groq**, providing sub-second responses that feel like a live conversation with history.

### 8. The Metaverse Bazaar (Beta) 🎆
*   **Immersive 3D Commerce**: A fully navigable 3D world built with **React Three Fiber** where you walk as a player, approach stylized village stalls, and buy real products.
*   **Atmospheric "Game Juice"**:
    *   **Sky Lanterns Engine**: A custom `InstancedMesh` system rendering hundreds of glowing paper lanterns rising into the night sky, simulating a digital Diwali festival.
    *   **Smart Interaction Logic**: Features a custom "Safety Trigger" (Debounce Mechanism) that intuitively distinguishes between "looking around" and "clicking to buy," solving common 3D web-game UX frustrations.
    *   **Confetti Rewards**: Instant visual celebration upon purchase using canvas-based particle physics.


---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React.js (Vite)
*   **Styling**: Tailwind CSS (Glassmorphism & Neomorphism)
*   **Animations**: Framer Motion
*   **Data Visualization**: Recharts
*   **Icons**: Lucide React

### Metaverse (3D Engine)
*   **Core**: React Three Fiber (`@react-three/fiber`)
*   **Helpers**: Zwei (`@react-three/drei`) - for Clouds, Stars, Sparkles, and Text.
*   **Physics/Math**: Three.js (Vector Math for movement)
*   **Effects**: `canvas-confetti` (Particle System)


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
*   **Computer Vision (OCR)**: `tesseract.js` (for text scanning)
*   **Payments**: Stripe Integration (Mock/Test Mode)

### Game Engine & Algorithms
*   **Chess Logic**: `chess.js` (Rules) & `react-chessboard` (UI)
*   **Minimax Algorithm**: Custom Depth-2 AI for Chess with alpha-beta pruning concepts.
*   **Collision Detection**: Custom path-checking logic for 3D metaverse movement and chess pieces.
*   **Procedural Generation**: Random tree placement and star fields in the Metaverse.
*   **Card Physics**: CSS 3D Transforms (`rotate-y-180`, `preserve-3d`) for Ganjifa.


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

Team members: Ankan Basu , Sachin Burnwal , Sneha Singh

*Mission*: " To unite India, one pixel at a time." 

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
