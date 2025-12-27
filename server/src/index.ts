import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Initialize OpenAI client with OpenRouter configuration
const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY,
});

app.use(cors());
app.use(express.json());

import { Request, Response } from 'express';

app.post('/ask', async (req: Request, res: Response) => {
    const { question, algorithm } = req.body;

    if (!question || !algorithm) {
        return res.status(400).json({ error: 'Missing question or algorithm' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "mistralai/mistral-7b-instruct:free",
            messages: [
                {
                    role: "system",
                    content: `You are an expert Algorithms Tutor. 
                    The user is asking a question about the "${algorithm}" algorithm.
                    
                    STRICT RULES:
                    1. Answer ONLY questions related to "${algorithm}" or general computer science concepts directly relevant to it.
                    2. If the user asks about a different topic (e.g., "What is the capital of France?", "How to bake a cake", or another algorithm not relevant here), politely decline and say: "Please ask only about this algorithm."
                    3. Explain concepts clearly and simply, suitable for a beginner to intermediate student.
                    4. Include time and space complexity if relevant to the question.
                    5. Keep your answer concise (under 200 words) unless a detailed explanation is specifically requested.
                    6. Do not include conversational filler like "Hello" or "I hope this helps". Get straight to the answer.`
                },
                {
                    role: "user",
                    content: question
                }
            ],
        });

        const answer = completion.choices[0].message.content;
        res.json({ answer });

    } catch (error: any) {
        console.error('AI Error:', error);
        res.status(500).json({
            error: 'Failed to get answer from AI',
            details: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
