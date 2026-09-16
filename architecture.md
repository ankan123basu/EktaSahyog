# EktaSahyog — System Architecture & Design Document (HLD & LLD)

This document provides a comprehensive High-Level Design (HLD) and Low-Level Design (LLD) specification for **EktaSahyog**, a real-time unity, culture, and community collaboration platform.

---

## 1. System Overview & Problem Statement

EktaSahyog is designed to connect diverse communities across India by integrating:
1. **Real-time Multilingual Communication**: Powered by Socket.IO and Groq LLMs (Llama-3) for real-time translation across 8+ Indian languages, sentiment analysis, and toxicity moderation.
2. **Direct Peer-to-Peer Media**: Pure WebRTC P2P audio/video calling using Socket.IO for SDP offer/answer/ICE candidate signaling.
3. **Cultural Artisans Marketplace & Rewards**: Artisan product marketplace supporting point-based redeeming and Stripe payment gateway webhooks.
4. **Interactive 3D Metaverse & GIS Hotspots**: WebGL 3D world (Three.js / React Three Fiber) and spatial mapping (Leaflet / MongoDB `2dsphere` geospatial indices).
5. **Privacy-Preserving Identity Verification**: Client-side browser OCR (Tesseract.js) extracting ID data locally without sending raw document photos over the network.

---

## 2. High-Level Design (HLD)

### System Architecture Diagram

```mermaid
flowchart TB
    subgraph ClientTier["Client Tier (Single Page Application - Vite/React)"]
        UI["React 19 Frontend App"]
        Metaverse["3D Metaverse Canvas (Three.js / R3F)"]
        OCR["Browser Tesseract.js Engine"]
        WebRTC_Client["WebRTC Media Engine (RTCPeerConnection)"]
    end

    subgraph SecurityTier["Edge Security & Gateway Tier"]
        CORS["CORS Policy Guard"]
        RateLimiter["express-rate-limit (Auth / AI / General)"]
        Validator["express-validator Sanitizer"]
        JWT_Auth["JWT Bearer Authenticator (7d Expiry)"]
    end

    subgraph BackendTier["Backend Application Tier (Express.js / Node.js)"]
        HTTP_Server["REST API Server (47 Endpoints)"]
        Socket_Server["Socket.IO Server (Real-Time Mesh)"]
        AI_Controller["Groq LLM Pipeline Controller"]
        Stripe_Webhook["Stripe Payment Webhook Handler"]
        Error_Handler["Global Express Error Handler"]
    end

    subgraph ExternalTier["External Cloud & AI Services"]
        Groq_API["Groq Cloud AI (Llama-3 Inference Engine)"]
        Stripe_API["Stripe Gateway Services"]
        Google_OAuth["Google OAuth 2.0 Provider"]
    end

    subgraph PersistenceTier["Persistence Tier"]
        MongoDB[("MongoDB Cluster (11 Schemas + 2dsphere Indices)")]
    end

    UI --> SecurityTier
    SecurityTier --> HTTP_Server
    UI <-->|WebSocket RTT 0.83ms| Socket_Server
    WebRTC_Client <-->|Direct P2P Media Streams| WebRTC_Client
    UI -->|Local Canvas Processing| OCR

    HTTP_Server --> AI_Controller
    AI_Controller <-->|groq-sdk| Groq_API
    HTTP_Server --> Stripe_Webhook
    Stripe_API -->|Webhook Events| Stripe_Webhook
    HTTP_Server <--> Google_OAuth

    HTTP_Server <--> MongoDB
    Socket_Server <--> MongoDB
```

---

## 3. Low-Level Design (LLD) & Subsystem Data Flows

### 3.1 Security & Auth Processing Pipeline

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant CORS as CORS Guard
    participant RL as Rate Limiter
    participant Val as Payload Validator
    participant Auth as Auth Controller
    participant DB as MongoDB (User Schema)

    User->>CORS: HTTP POST /auth/login (Origin Check)
    alt Unauthorized Origin
        CORS-->>User: HTTP 403 Forbidden
    else Allowed Origin
        CORS->>RL: Forward Request
    end

    RL->>RL: Check IP / User Request Bucket (Max 20 req/15m)
    alt Rate Limit Exceeded
        RL-->>User: HTTP 429 Too Many Requests
    else Allowed Rate
        RL->>Val: Forward Payload
    end

    Val->>Val: Validate Email Format & Password Length
    alt Validation Failed
        Val-->>User: HTTP 400 Bad Request (Validation Errors JSON)
    else Payload Valid
        Val->>Auth: Execute Handler
    end

    Auth->>DB: User.findOne({ email })
    DB-->>Auth: User Document (Hashed Password)
    Auth->>Auth: bcrypt.compare(password, hash)
    alt Password Match
        Auth->>Auth: jwt.sign({ id, role }, secret, { expiresIn: '7d' })
        Auth-->>User: HTTP 200 OK + JWT Token & User Profile
    else Invalid Password
        Auth-->>User: HTTP 401 Unauthorized
    end
```

---

### 3.2 Real-Time Communication Pipeline (Socket.IO + WebRTC P2P)

```mermaid
sequenceDiagram
    autonumber
    actor PeerA as Peer A (Caller)
    participant SocketServer as Socket.IO Server
    actor PeerB as Peer B (Callee)

    Note over PeerA,PeerB: Socket.IO Signalling Phase
    PeerA->>SocketServer: emit('call-user', { userToCall, offer, name })
    SocketServer->>PeerB: emit('call-user', { signal: offer, from, name })

    PeerB->>SocketServer: emit('answer-call', { to, signal: answer })
    SocketServer->>PeerA: emit('call-accepted', answer)

    PeerA->>SocketServer: emit('ice-candidate', { candidate, to })
    SocketServer->>PeerB: emit('ice-candidate', candidate)

    Note over PeerA,PeerB: Direct WebRTC P2P Audio/Video Stream Established
    PeerA<-->>PeerB: Direct Encrypted SRTP Media Packets (Zero Server Relay)
```

---

### 3.3 Groq LLM Multilingual AI & Moderation Pipeline

```mermaid
flowchart LR
    Input["Raw User Chat Text"] --> Val["express-validator"]
    Val --> RateLimit["aiLimiter (15 req/min)"]
    RateLimit --> Service["groq-sdk (Llama-3 Model)"]

    subgraph GroqCloud["Groq Cloud Processing"]
        Service --> Toxicity["Toxicity & Moderation Model"]
        Toxicity --> Translate["Translation Engine (8+ Languages)"]
        Translate --> Sentiment["Sentiment Scoring (-1.0 to +1.0)"]
    end

    GroqCloud --> Response["JSON Output (Translated Text, Sentiment Label, Safety Flag)"]
    Response --> SaveDB["Save to ChatMessage Schema"]
    SaveDB --> Broadcast["Broadcast via Socket.IO"]
```

---

### 3.4 Client-Side Local OCR Pipeline

```mermaid
flowchart TD
    Upload["User Uploads ID Card Image"] --> Canvas["Render Image to HTML5 Canvas"]
    Canvas --> Grayscale["Pre-process Image (Grayscale & Contrast Boost)"]
    Grayscale --> TesseractWorker["Tesseract.js Web Worker (Local Browser Thread)"]
    TesseractWorker --> Extraction["Text Line Segmentation & Bounding Boxes"]
    Extraction --> JSON["Structured JSON Output (Name, ID No, DOB)"]
    JSON --> Form["Auto-fill Verification Form (Raw Image Discarded)"]
```

---

## 4. Database Architecture & ER Diagram

The persistence layer consists of **11 Mongoose Schemas** hosted on MongoDB.

```mermaid
erDiagram
    User ||--o{ Product : "sells (sellerId)"
    User ||--o{ Order : "places (userId)"
    User ||--o{ Story : "authors (authorId)"
    User ||--o{ Project : "organizes / volunteers"
    User ||--o{ ChatMessage : "sends (userId)"
    User ||--o{ GameScore : "scores (userId)"
    User }|--|{ Community : "joins (joinedCommunities)"

    Product ||--o{ Order : "purchased in (productId)"
    Community ||--o{ ChatMessage : "contains (communityId)"

    User {
        ObjectId _id PK
        String name
        String email UK
        String password
        String googleId UK
        Boolean isVerified
        Point region "GeoJSON 2dsphere [lng, lat]"
        String location
        String language
        String role "user | admin"
        Array joinedCommunities FK
        Date createdAt
    }

    Product {
        ObjectId _id PK
        String title
        String description
        Number price
        String artisan
        String region
        String category
        String image
        ObjectId sellerId FK
        Number pointsPrice
    }

    Order {
        ObjectId _id PK
        ObjectId userId FK
        ObjectId productId FK
        Object productSnapshot
        Object shippingAddress
        String status "PENDING_ADDRESS | PROCESSING | SHIPPED | DELIVERED"
        Number pointsPaid
        Date orderedAt
    }

    Project {
        ObjectId _id PK
        String title
        String description
        Number goalAmount
        Number goalMembers
        Number raised
        Array members FK
        String location
        Date date
        ObjectId organizer FK
        String status "Active | Completed"
    }

    Story {
        ObjectId _id PK
        String title
        String content
        String preview
        String author
        ObjectId authorId FK
        String region
        String image
        Number likes
        Array likedBy FK
        Array comments
    }

    ChatMessage {
        ObjectId _id PK
        ObjectId communityId FK
        String channel
        ObjectId userId FK
        String userName
        String text
        String translatedText
        Object sentiment "score, label"
    }

    Community {
        ObjectId _id PK
        String name
        String description
        String region
        String image
        Array members FK
    }

    Resource {
        ObjectId _id PK
        String title
        String category
        String provider
        String contact
        String region
        Boolean verified
    }

    Hotspot {
        ObjectId _id PK
        String name
        String category
        Point coordinates "GeoJSON [lng, lat]"
        String description
        String region
    }

    Culture {
        ObjectId _id PK
        String state
        String title
        String description
        Array artForms
        Array festivals
        String image
    }

    GameScore {
        ObjectId _id PK
        ObjectId userId FK
        String gameType "Chess | Quiz"
        Number score
        Date playedAt
    }
```

---

## 5. Deployment Topology & Infrastructure

```mermaid
graph TD
    subgraph Internet
        Users["Global Web Users"]
    end

    subgraph DockerCompose["Docker Compose Stack (Local / EC2 Deployment)"]
        subgraph Container_Frontend["Frontend Container (Nginx / Static Build)"]
            Vite_App["React SPA Production Bundle (1.32 MB)"]
        end

        subgraph Container_Backend["Backend Container (Node 20 Alpine)"]
            Express_App["Express REST API (Port 5001)"]
            Socket_Engine["Socket.IO Gateway Engine"]
        end

        subgraph Container_DB["Database Container"]
            Mongo_Instance[("MongoDB Daemon (Port 27017)")]
        end
    end

    Users -->|HTTP GET / static assets| Container_Frontend
    Users -->|HTTP REST APIs / Bearer Auth| Express_App
    Users <-->|WebSocket WSS connection| Socket_Engine
    Express_App <--> Mongo_Instance
    Socket_Engine <--> Mongo_Instance
```

---

## 6. Key Performance Metric Benchmarks Summary

| Subsystem / Metric | Measured Baseline | Optimized Metric | Architectural Improvement |
| :--- | :--- | :--- | :--- |
| **API Throughput** | N/A | **1,492–2,280 req/sec** | Measured via Autocannon load testing across 5 endpoints at Concurrency 50. |
| **Tail Latency ($P_{99}$)** | N/A | **34.00ms – 61.00ms** | Monotonic percentiles ($P_{50} \le P_{90} \le P_{99}$) verified under load. |
| **JS Bundle Size** | **2.54 MB** | **1.32 MB** | **48.03% bundle size reduction** via `React.lazy()` route splitting. |
| **Query Latency** | **202.89 ms** (5k items) | **31.80 ms** (20 items) | **84.32% latency reduction** via offset-based pagination (`limit`/`skip`). |
| **WebSocket RTT** | N/A | **0.83 ms average** | Measured across 100 WebSocket `ping`/`pong` message round-trips. |
| **Test Pass Rate** | **0 tests** | **12 / 12 passed (100%)** | Vitest + Supertest + `mongodb-memory-server` isolated test suite. |
