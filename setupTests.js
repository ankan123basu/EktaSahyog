import '@testing-library/jest-dom';

// Mock IntersectionObserver for Framer Motion whileInView / viewport animations in JSDOM
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
    takeRecords() { return []; }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
};

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_key';
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
process.env.GROQ_API_KEY = process.env.GROQ_API_KEY || 'gsk_placeholder';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy_google_client_id';
process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy_google_client_secret';


