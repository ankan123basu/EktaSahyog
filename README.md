# EktaSahyog (Unity & Collaboration) 🇮🇳

> **Bridging India's Cultural Divide through Technology**

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI](https://img.shields.io/badge/AI-Groq-orange)

---

## 📖 Introduction
**EktaSahyog** is a next-generation Unity & Collaboration platform engineered at the intersection of the **MERN stack**, **WebGL-powered browser-native Web3D**, **AI-driven systems**, **OCR**, and **real-time infrastructure**.

We moved far beyond static MERN applications to architect a cultural-scale digital ecosystem — fusing multilingual AI communication, low-latency real-time collaboration, interactive cultural experiences, and WebGL-powered 3D environments to digitally represent India’s unity in motion.

In a nation of 28 states, 8 union territories, and 121 languages, EktaSahyog serves one singular purpose: **To Unite India.** It is not just a marketplace or a learning hub; it is a **National Integration Platform** that uses this advanced technology to dissolve the invisible borders that divide us.

## The Mission: Unity through Diversity
While others build walls, EktaSahyog builds bridges:
*   **The Linguistic Bridge**: Breaking language barriers so a Tamilian and a Punjabi can converse freely.
*   **The Economic Bridge**: Connecting a rural artisan in Kutch directly to a buyer in Kolkata.
*   **The Social Bridge**: Enabling a student in Delhi to volunteer for a cause in Kerala.
*   **The Cultural Bridge**: Helping the youth understand that our diverse traditions are part of one shared identity.

## 💡 Innovation: Engineering Unity
We re-engineered standard features into tools for connection:

### 1. Ideological Unity ("The Unity Council")
*   **Concept**: We use AI to reconnect the youth with the shared values of our nation's founders.
*   **How**: By debating with **Sardar Patel** (The Unifier) or **Tagore** (The Cultural Icon), users realize that despite diverse methods, the goal was always one: **A United India**.

### 2. Social Unity ("Digital Seva")
*   **Concept**: Transforming passive empathy into active collaboration.
*   **How**: Our **Unity Projects** dashboard allows cross-regional collaboration. It proves that a problem in one state is a problem for all Indians.

### 3. Cultural Unity ("The Metaverse Bazaar")
*   **Concept**: Replacing "transactions" with "shared experiences".
*   **How**: In our 3D world, users don't just buy objects; they celebrate festivals together. It creates a shared digital space where regional distinctions blur into a collective celebration.

### 4. Economic Unity ("Fair Trade Ecosystem")
*   **Concept**: Unity cannot exist without equity.
*   **How**: By removing middlemen, we ensure that wealth flows fairly from urban centers to rural creators, strengthening the economic fiber that holds the nation together.

---

## 🚀 Comprehensive Feature Suite

### 1. Cultural Marketplace 🛍️
*   **Economic Unity**: Empowering artisans by giving them a direct national stage.
*   **Fair Trade**: Connects buyers directly with genuine weavers, potters, and craftsmen.
*   **Tech Under the Hood**:
    *   **Search & Discovery**: Regex-based search algorithm with robust categorization and filtering for regional products.
    *   **Payments**: Integrated with **Stripe** (Test Mode) API for secure transaction intents.
    *   **Data Structure**: Relational schema linking distinct Artisan Profiles to their Product Catalog.

### 2. The Metaverse Bazaar (3D Experience) 🎆
*   **Immersive Walkthrough**: A browser-based **3D Village** where users walk as avatars.
*   **Atmosphere**: Experience a digital festival with **Sky Lanterns** and **Flower Rains**.
*   **Interactive Stalls**: Visit "virtual stalls" to view authentic products in 3D space.
*   **Tech Under the Hood**:
    *   **Engine**: **React Three Fiber (R3F)** & **Three.js**.
    *   **Optimization**: Verified usage of `InstancedMesh` for rendering 150+ particle items (Laterns/Flowers) efficiently.
    *   **Physics**: Raycasting interaction layer combined with `PointerLockControls`.

### 3. Unity Projects & Social Stories 🤝
*   **Projects (Action)**: Collaborative platform for cross-state initiatives (e.g., "Flood Relief for Assam").
*   **Stories (Voices)**: A "Humans of Bombay" style feed where users share personal experiences of unity and culture.
*   **Tech Under the Hood**:
    *   **Real-Time Updates**: **Stripe Webhooks** (`checkout.session.completed`) trigger atomic updates to project funding stats.
    *   **Crowdfunding Logic**: Secure server-side validation of donation sessions ensures integrity of raised amounts.
    *   **Social Graph**: Stories feature a "Like/Comment" system (`/stories/:id/like`) backed by optimistic UI updates for instant engagement.

### 4. Learn My Culture (Community Repository) 📚
*   **Shared Knowledge**: A user-driven repository of Indian Festivals, Art, and Cuisine.
*   **Interaction**: Community members can share, like, and filter cultural stories by region.
*   **Tech Under the Hood**:
    *   **Engagement Engine**: Custom "Like" and "Share" API endpoints with local state optimism for instant UI feedback.
    *   **Filtering**: Dynamic frontend filtering logic for finding content by specific Category or Region.

### 5. Cultural Arcade (Gamification) 🎮
*   **Reviving Ancient Games**:
    *   **Moksha Patam** (Snakes & Ladders)
    *   **Ganjifa** (Mughal Cards)
    *   **Chaturanga** (Chess)
    *   **Pallanguzhi** (Mancala)
*   **Tech Under the Hood**:
    *   **Chess AI**: Custom **Minimax Algorithm** (Depth-2 Recursive) with position evaluation heuristics. **No external libraries** like `chess.js` used.
    *   **Game Engines**: Custom React State grids for board logic (Snakes & Ladders/Pallanguzhi).
    *   **Animations**: CSS3 Transforms (Rotate/Scale) for card flips and piece movements.

### 6. Universal Chatroom 💬
*   **Language No Bar**: Real-time **AI Translation** allows a Tamil speaker to chat with a Hindi speaker.
*   **Tech Under the Hood**:
    *   **Auto-Join Logic**: During login, the system extracts `user.location` to automatically plug the socket client into their specific regional channel (e.g., "Delhi" -> `socket.join('delhi')`).
    *   **Real-Time**: **Socket.io** event emitters for bi-directional communication.
    *   **AI Pipeline**: Direct integration with **Groq SDK** (`llama-3.1-8b`) for "Message-in-Translation-out" processing.

### 7. Cultural Hotspots & Interactive Map 🗺️
*   **Discovery**: A dynamic, geo-tagged map of India highlighting **Heritage Sites** and **GI Products**.
*   **Visual Storytelling**: Each hotspot features rich media and stories.
*   **Tech Under the Hood**:
    *   **Rendering**: SVG-based map projection handling coordinate mapping for hotspots.
    *   **Interactivity**: Hover-state event listeners triggering dynamic modal content delivery.

### 8. The Unity Council (AI + History) 🏛️
*   **Living History**: Engage in real-time, voice-enabled debates with **Sardar Vallabhbhai Patel**, **Rabindranath Tagore**, **Dr. B.R. Ambedkar**, and other legends.
*   **Purpose**: To provide ethical and unified guidance to the modern youth using lessons from the past.
*   **Tech Under the Hood**:
    *   **Soul Script**: Custom System Prompts injected into **Llama-3-70b** to enforce historical persona traits.
    *   **Voice Engine**: Native **Web Speech API** (`window.speechSynthesis`) integration with dynamic voice/pitch matching.

### 9. Secure & Role-Based Ecosystem 🔐
*   **Bank-Grade Authentication**:
    *   **JWT (JSON Web Tokens)**: Stateless and secure session management.
    *   **Google OAuth 2.0**: One-click secure login.
*   **Role-Based Access Control (RBAC)**:
    *   **Admins**: Full control over Marketplace verification and Project approval.
    *   **Users**: Detailed profile management and gamification history.
*   **Tech Under the Hood**:
    *   **Security**: **Bcrypt** hashing for passwords and HTTPS-only cookie policies.
    *   **Middleware**: Custom `verifyToken` middleware in Express to guard protected API routes.


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

### 10. Client-Side OCR (Proprietary Implementation) 👁️
*   **Concept**: Instant identity verification without server-side processing overhead.
*   **Tech Stack**:
    *   **Engine**: `Tesseract.js` (WASM-based pure JS OCR engine).
    *   **Camera**: `react-webcam` for live frame capture.
*   **Data Pipeline**:
    *   **Preprocessing**: Custom HTML5 Canvas logic converts images to **Grayscale**, increases **Contrast** by 20%, and applies **Binarization** (Thresholding) to isolate text from background noise.
    *   **Parsing Logic**:
        *   **Name Extraction**: Heuristic regex algorithms scan for "Name:" keywords or capitalize word patterns above "DOB" fields.
        *   **Region Recognition**: Fuzzy matching against a hardcoded array of 28 Indian States.
*   **Privacy**: All processing happens locally in the user's browser (Client-Side), ensuring sensitive ID data never leaves the device during the scan phase.

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
