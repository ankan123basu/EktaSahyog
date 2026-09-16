# EktaSahyog — Key Architectural & Algorithmic Decisions

This document outlines the key technical, architectural, and algorithmic choices made during the development, optimization, and security hardening of **EktaSahyog**.

---

## 1. Client-Side Browser OCR (Tesseract.js) vs. Server-Side Cloud OCR

### Context & Problem
The platform requires users to verify their identity or credentials via document scanning (e.g., state ID cards or artisan certificates).

### Options Evaluated
1. **Server-Side Cloud OCR (Google Cloud Vision / AWS Textract)**: Highly accurate, but introduces API costs per scan, network latency uploading high-res images, and privacy concerns uploading personal documents.
2. **Server-Side Tesseract.js in Node.js**: Relieves API costs, but spawns heavy C++ native image processing threads inside the Node.js process, blocking the main event loop.
3. **Client-Side Browser Tesseract.js (Web Workers)**: Runs Tesseract WASM/JavaScript inside a dedicated browser Web Worker thread.

### Decision & Rationale
We chose **Client-Side Browser Tesseract.js (Option 3)**.
* **CPU Offloading**: Transfers heavy canvas manipulation, image binarization, and OCR processing to the client's device, keeping the backend Express event loop unblocked.
* **Data Privacy**: Raw document images never leave the user's device; only sanitized JSON text fields are submitted to the API.
* **Cost Efficiency**: $0 external API operational cost.

---

## 2. Route-Based Code-Splitting (`React.lazy()`) vs. Monolithic Bundle

### Context & Problem
The initial production Vite build resulted in a **2.54 MB single JavaScript entry bundle**. Users visiting simple landing pages or auth forms were forced to download heavy WebGL 3D libraries (`three`, `@react-three/drei`, `@react-three/fiber`), mapping packages (`leaflet`, `react-leaflet`), and rich canvas libraries.

### Decision & Rationale
We implemented **Route-Based Dynamic Code-Splitting** in `src/App.jsx` using standard `React.lazy()` dynamic imports wrapped in a unified `<Suspense fallback={<PageLoader />}>` boundary.

* **Result**: Reduced initial JavaScript bundle size from **2.54 MB to 1.32 MB** (**48.03% bundle size reduction**).
* **Network Impact**: Heavy WebGL dependencies for the 3D Metaverse or Leaflet GIS maps are isolated into dynamic async chunks loaded on-demand only when a user navigates to those specific routes.

---

## 3. Offset-Based Query Pagination (`skip`/`limit`) vs. Unpaginated Aggregations

### Context & Problem
GET endpoints for social feeds and artisan marketplaces (`/stories`, `/projects`, `/marketplace`, `/culture`, `/hotspots`) initially queried and returned entire database collections (5,000+ items at once), causing query execution latencies of **202.89 ms** and bloated HTTP response payloads.

### Options Evaluated
1. **Unpaginated Full Collections**: Simple to write, but unscalable ($O(N)$ memory & network bloat).
2. **Offset-Based Pagination (`.skip((page-1)*limit).limit(limit)`)**: Simple client integration (`page` and `limit` query parameters), fast for standard page depths.
3. **Cursor-Based Pagination (`_id > lastSeenId`)**: Constant $O(1)$ seek performance for infinite scrolling at arbitrary page depth, but requires client cursor tracking and complex UI state handling.

### Decision & Rationale
We implemented **Offset-Based Pagination (Option 2)** for current collection sizes.
* **Measured Result**: Reduced query execution duration from **202.89 ms to 31.80 ms** (**84.32% latency reduction**).
* **Future Path**: If collection sizes reach millions of records where `.skip()` scanning overhead degrades, the API contract can be transparently upgraded to cursor-based seek tokens without breaking existing client components.

---

## 4. Direct Peer-to-Peer WebRTC Mesh vs. Media Relay SFU

### Context & Problem
EktaSahyog includes 1-on-1 audio/video communication (`DrishtiMilan`) between community volunteers and artisans.

### Options Evaluated
1. **SFU Server (Selective Forwarding Unit e.g., Mediasoup / LiveKit)**: Central server receives and routes streams. Scales well for 50+ participant group calls, but requires dedicated media server infrastructure and bandwidth.
2. **Direct P2P WebRTC Mesh via Socket.IO Signaling**: Peers exchange SDP offers, answers, and ICE candidates over Socket.IO WebSockets, then stream video directly peer-to-peer using `RTCPeerConnection`.

### Decision & Rationale
We chose **Direct P2P WebRTC via Socket.IO (Option 2)**.
* **Zero Relay Overhead**: For 1-on-1 video calls, encrypted SRTP media packets travel directly between browser peers.
* **Low Latency & Zero Cost**: Keeps server CPU/bandwidth usage at zero and achieves minimal network latency.

---

## 5. Defense-in-Depth Security: Validation & Rate Limiting

### Context & Problem
Third-party Groq LLM services (`groq-sdk`) cost money per API call, while POST endpoints like `/auth/register` and `/marketplace/create` trusted incoming `req.body` blindly.

### Decision & Rationale
We implemented a **Two-Tier Security Pipeline**:
1. **Input Validation Layer (`express-validator`)**: Centralized schema validation in `server/middleware/validators.js` sanitizing email formats, password lengths, numeric prices, and string bounds.
2. **Tiered Rate Limiting (`express-rate-limit`)**:
   * `authLimiter`: Max 20 requests per 15 minutes on `/auth/register` and `/auth/login`.
   * `aiLimiter`: Max 15 requests per minute on `/ai/chat`, `/ai/translate`, `/ai/summarize`.
   * `generalLimiter`: Max 300 requests per 15 minutes on standard REST endpoints.

---

## 6. In-Memory Isolated Database Testing (`mongodb-memory-server`)

### Context & Problem
Automated integration tests needed to execute fast in CI/CD without requiring an external MongoDB server or polluting real developer databases.

### Decision & Rationale
We paired **Vitest + Supertest + `mongodb-memory-server`**.
* **Zero External Dependencies**: `mongodb-memory-server` downloads and spins up an ephemeral binary in Node.js memory.
* **Complete Test Isolation**: Each test file (`auth.test.js`, `projects.test.js`, etc.) runs against an isolated in-memory DB instance that wipes clean upon tear-down, delivering a **100% test pass rate across 12 integration tests**.

---

## 7. Multi-Stage Production Docker Containerization

### Context & Problem
Deploying the application required a predictable containerized runtime containing both the static Vite frontend asset build and the Express Node.js backend.

### Decision & Rationale
Created a **Multi-Stage `Dockerfile`**:
* **Stage 1 (Build)**: Node 20 Alpine installs frontend dependencies and compiles the optimized Vite bundle into `/dist`.
* **Stage 2 (Production Engine)**: Copies only compiled static assets and production Node.js server files, reducing final container image size and stripping build-time `devDependencies`.
* **Docker Compose (`docker-compose.yml`)**: Orchestrates the multi-stage app container alongside a standalone MongoDB service container with single-command `docker-compose up` setup.
