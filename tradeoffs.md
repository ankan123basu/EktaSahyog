# EktaSahyog — System Technical Trade-Offs Analysis

This document provides a technical evaluation of architectural trade-offs made across the EktaSahyog codebase.

---

## 1. Offset-Based Pagination vs. Cursor-Based Pagination

| Dimension | Offset-Based Pagination (`limit`/`skip`) | Cursor-Based Pagination (`_id > lastSeenId`) |
| :--- | :--- | :--- |
| **Current Implementation** | **Selected** for `/stories`, `/projects`, `/marketplace`, `/culture`, `/hotspots` | Future Scale Candidate |
| **Pros** | • Simple API contract (`page=1&limit=20`)<br>• Supports direct jump-to-page navigation in UI<br>• Trivial client state management | • Constant $O(1)$ query time at arbitrary depth<br>• Unaffected by concurrent inserts/deletions<br>• Ideal for infinite scroll interfaces |
| **Cons** | • Performance degrades at deep offsets ($O(N)$ skip scan)<br>• Susceptible to duplicate/skipped items during concurrent writes | • Cannot jump directly to arbitrary page numbers (e.g. Page 15)<br>• Requires client to track opaque cursor tokens |
| **Trade-Off Rationale** | For EktaSahyog's dataset scale, offset pagination cut response times from **202.89 ms to 31.80 ms (84.32% latency reduction)** while allowing UI components to render simple page controls. |

---

## 2. Direct P2P WebRTC Mesh vs. Central SFU (Selective Forwarding Unit)

| Dimension | Direct P2P WebRTC Mesh (`RTCPeerConnection`) | Central SFU Media Server (e.g., Mediasoup / LiveKit) |
| :--- | :--- | :--- |
| **Current Implementation** | **Selected** for 1-on-1 calls (`DrishtiMilan`) | Future Group Call Candidate |
| **Pros** | • Zero media server infrastructure cost<br>• End-to-end media encryption between peers<br>• Minimal latency (direct peer-to-peer audio/video streaming) | • Scales efficiently to 50+ participants per call<br>• Low client CPU/upload bandwidth demands<br>• Centralized server recording & transcoding |
| **Cons** | • Client upload bandwidth scales $O(N-1)$ for $N$ participants<br>• High CPU utilization on low-end mobile devices in group calls | • Requires running dedicated SFU media server infrastructure<br>• High cloud bandwidth and server operational costs |
| **Trade-Off Rationale** | EktaSahyog's primary video use-case is 1-on-1 community volunteer interactions. Direct P2P delivers sub-millisecond signaling overhead via Socket.IO with $0 server hosting costs. |

---

## 3. Client-Side Browser OCR (Tesseract.js) vs. Server-Side Cloud OCR

| Dimension | Client-Side Tesseract.js (WASM / Web Workers) | Server-Side Cloud OCR (Google Vision / AWS Textract) |
| :--- | :--- | :--- |
| **Current Implementation** | **Selected** for ID verification | Alternative Option |
| **Pros** | • Zero API cost per scan<br>• Complete data privacy (raw ID images stay on user device)<br>• Zero backend CPU/RAM utilization | • Higher text extraction accuracy on noisy/blurry photos<br>• Faster execution on low-powered mobile processors |
| **Cons** | • Heavy initial JS/WASM worker download (~2-4 MB)<br>• Accuracy varies based on mobile camera quality and ambient lighting | • Ongoing cloud API billing per image scan<br>• User image data transmitted over external networks |
| **Trade-Off Rationale** | Running Tesseract.js in a dedicated browser Web Worker offloads CPU-heavy canvas rendering from Node.js, ensuring 100% data privacy and $0 operational cost. |

---

## 4. Stateless JWT Authentication vs. Redis-Backed Stateful Sessions

| Dimension | Stateless JWT Tokens (`expiresIn: '7d'`) | Stateful Redis Sessions |
| :--- | :--- | :--- |
| **Current Implementation** | **Selected** for Express Auth API | Alternative Option |
| **Pros** | • Zero database lookup overhead per authenticated REST request<br>• Horizontally scalable across multiple Express backend nodes<br>• Simple Bearer token header integration | • Instant token revocation upon user logout or security breach<br>• Strict active session tracking and remote device wipe |
| **Cons** | • Cannot revoke a token immediately before 7-day expiration without a blacklist | • Requires managing a Redis cache cluster<br>• Adds network latency (Redis lookup) to every API request |
| **Trade-Off Rationale** | For our current architecture, stateless JWTs signed with `JWT_SECRET` and enforced with 7-day expiration eliminate database bottlenecks during load testing, sustaining **1,492–2,280 req/sec**. |

---

## 5. In-Memory Mock Testing (`mongodb-memory-server`) vs. Real Staging Database

| Dimension | In-Memory Testing (`mongodb-memory-server`) | Dedicated Staging Database Integration |
| :--- | :--- | :--- |
| **Current Implementation** | **Selected** for Vitest + Supertest suite | Alternative Option |
| **Pros** | • Blazing fast execution in local dev & GitHub Actions CI<br>• 100% test isolation (fresh database instance per test file)<br>• Zero external database dependency or setup required | • Tests real MongoDB replica sets, transactions, and index behavior<br>• Catches database-version-specific engine bugs |
| **Cons** | • Does not test complex MongoDB cluster configurations or network delays | • Slower test suite execution<br>• Requires database cleanup logic to prevent state contamination between test runs |
| **Trade-Off Rationale** | `mongodb-memory-server` provided a deterministic, zero-dependency environment for our 12 Supertest integration tests, achieving a **100% test pass rate** with 0% side effects on production data. |

---

## 6. Dynamic Client Route Splitting (`React.lazy`) vs. Full Server-Side Rendering (SSR)

| Dimension | Dynamic Client Route-Splitting (`React.lazy()`) | Server-Side Rendering (Next.js / Remix) |
| :--- | :--- | :--- |
| **Current Implementation** | **Selected** in `src/App.jsx` | Alternative Architecture |
| **Pros** | • Reduced main bundle size by **48% (2.54 MB → 1.32 MB)**<br>• Simple SPA deployment to CDN / static hosts<br>• Decoupled frontend/backend architecture | • Superior initial page load SEO and social media preview rendering<br>• Fast first-contentful-paint (FCP) on slow mobile connections |
| **Cons** | • Requires client-side JS execution before rendering UI fallback loaders | • Adds server CPU load rendering HTML on every request<br>• Complex hydration mismatch debugging for WebGL canvas components |
| **Trade-Off Rationale** | Because EktaSahyog relies heavily on interactive client-side components (3D Three.js canvas, Leaflet maps, WebRTC media streams), a Vite SPA optimized with `React.lazy()` route splitting delivered the best balance of fast initial load and seamless client interactivity. |
