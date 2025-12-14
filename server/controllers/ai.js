import { generateText, translateText } from '../services/ai.js';

export const chatWithAI = async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await generateText(prompt);
        res.status(200).json({ text: response });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const translateMessage = async (req, res) => {
    try {
        const { text, targetLang } = req.body;
        const translatedText = await translateText(text, targetLang);
        res.status(200).json({ translatedText });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
export const summarizeChat = async (req, res) => {
    try {
        const { messages } = req.body;
        // Format messages for the prompt
        const chatHistory = messages.map(m => `${m.user}: ${m.text}`).join('\n');

        const prompt = `Summarize the following chat conversation in 3-4 bullet points, highlighting the key topics discussed and any decisions made:\n\n${chatHistory}`;

        const summary = await generateText(prompt);
        res.status(200).json({ summary });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
