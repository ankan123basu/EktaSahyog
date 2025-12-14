import Groq from "groq-sdk";
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq API
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- 1. CHATBOT SERVICE ---
export const generateText = async (prompt) => {
    try {
        const systemContext = `
        You are "Ekta Saathi", the friendly AI assistant for "EktaSahyog" (Unity in Support).
        
        ABOUT THE PLATFORM:
        EktaSahyog is a digital platform designed to foster "Unity in Diversity" (Ek Bharat Shreshtha Bharat) in India.
        It connects:
        1. NGOs and Volunteers for social projects.
        2. Artisans to a global marketplace to sell cultural products (Handicrafts, Textiles).
        3. Communities from different states to share stories and culture.
        
        YOUR ROLE:
        - Answer questions ONLY related to Indian culture, state diversity, the EktaSahyog platform, volunteering, and social impact.
        - If asked about generic topics (like coding, math, general knowledge unrelated to the mission), politely steer the conversation back to Unity, India, or the Platform.
        - Be polite, inspiring, and use emojis.
        - Only introduce yourself as Ekta Saathi if the user explicitly greets you (e.g., 'Hi', 'Hello', 'Namaste') or asks who you are. Otherwise, answer the question directly without an introduction.
        - Do NOT use asterisks (*) or markdown for formatting. Use plain text or emojis only to keep the UI clean.
        `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemContext },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile", // Smarter model for conversation
            temperature: 0.7,
            max_tokens: 1024,
        });

        return completion.choices[0]?.message?.content || "Sorry, I am thinking...";
    } catch (error) {
        console.error("Groq Chatbot API Error:", error);
        return "Sorry, I couldn't process that request right now (System Busy).";
    }
};

// --- 2. TRANSLATION SERVICE ---
export const translateText = async (text, sourceLang, targetLang = 'English') => {
    try {
        // Optimizing for speed using 8b-instant
        const prompt = `Translate the following text from ${sourceLang} to ${targetLang}. Output ONLY the translated text. Do not provide explanations or quotes.`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a highly accurate professional translator. You output only the translation." },
                { role: "user", content: `${prompt}\n\nText: "${text}"` }
            ],
            model: "llama-3.1-8b-instant", // Fastest model for real-time features
            temperature: 0.1,
        });

        let translation = completion.choices[0]?.message?.content?.trim() || text;

        // Cleanup quotes if the model adds them
        if (translation.startsWith('"') && translation.endsWith('"')) {
            translation = translation.slice(1, -1);
        }

        console.log(`Groq Translation: "${text}" -> "${translation}"`);
        return translation;

    } catch (error) {
        console.error("Groq Translation Error:", error);
        return text; // Fallback to original
    }
};

// --- 3. TOXICITY CHECK SERVICE ---
export const isToxicMessage = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `You are a content moderation AI. 
                    Classify the following text as "TOXIC" or "SAFE".
                    
                    TOXIC includes: Hate speech, severe insults, threats, sexual harassment, or profanity used to attack.
                    SAFE includes: Normal conversation, constructive criticism, mild slang.
                    
                    Reply with ONLY one word: TOXIC or SAFE.`
                },
                { role: "user", content: `Text to analyze: "${text}"` }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0,
        });

        const classification = completion.choices[0]?.message?.content?.trim().toUpperCase() || "SAFE";
        return classification.includes("TOXIC");

    } catch (error) {
        console.error("Groq Toxicity Check Error:", error);
        return false; // Fail open (allow message) if API fails
    }
};

// --- 4. SENTIMENT ANALYSIS SERVICE ---
export const analyzeSentiment = async (text) => {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Analyze the sentiment of the user input.
                    Return a valid JSON object with:
                    - score: A number between -1.0 (Negative) and 1.0 (Positive).
                    - label: One of "POSITIVE", "NEGATIVE", "NEUTRAL".
                    
                    Example: { "score": 0.8, "label": "POSITIVE" }
                    Reply ONLY with the JSON.`
                },
                { role: "user", content: `Analyze this: "${text}"` }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0,
            response_format: { type: "json_object" } // Force JSON mode
        });

        const content = completion.choices[0]?.message?.content;
        return JSON.parse(content);

    } catch (error) {
        console.error("Groq Sentiment Analysis Error:", error);
        return { score: 0, label: "NEUTRAL" };
    }
};
