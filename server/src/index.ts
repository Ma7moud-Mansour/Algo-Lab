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

app.post('/api/chatbot', async (req: Request, res: Response) => {
    const { message, algorithm } = req.body;

    if (!message || !algorithm) {
        return res.status(400).json({ error: 'Missing message or algorithm' });
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
                    content: message
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

app.post('/api/generate-problem', async (req: Request, res: Response) => {
    const { difficulty, topic } = req.body;

    if (!difficulty || !topic) {
        return res.status(400).json({ error: 'Missing difficulty or topic' });
    }

    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-pro-1.5", // Using a strong model for JSON generation
            messages: [
                {
                    role: "system",
                    content: `You are an Algorithmic Problem Generator.
                    Generate a unique coding problem scenario based on:
                    - Difficulty: ${difficulty} (Easy/Medium/Hard)
                    - Topic: ${topic}

                    The Output MUST be valid JSON with this structure:
                    {
                        "id": "string (unique)",
                        "title": "string (short catchy title)",
                        "description": "string (the problem scenario)",
                        "input": [number] (an array of numbers representing sample input usually size 10-20),
                        "optimalAlgorithm": "string (one of: bubble-sort, selection-sort, insertion-sort, merge-sort, quick-sort, linear-search, binary-search)",
                        "explanation": "string (educational explanation of why the optimal algorithm is best)",
                        "suboptimalOptions": ["string (valid but slower/worse algo IDs)"],
                        "incorrectOptions": ["string (completely wrong algo IDs)"]
                    }
                    
                    ALGORITHM IDS TO USE:
                    bubble-sort, selection-sort, insertion-sort, merge-sort, quick-sort, linear-search, binary-search
                    
                    For "sorted" or "nearly sorted" scenarios, ensure the "input" array reflects that property.`
                },
                {
                    role: "user",
                    content: `Generate a ${difficulty} difficulty problem about ${topic}.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content generated");

        const problem = JSON.parse(content);
        res.json(problem);

    } catch (error: any) {
        console.error('AI Generation Error:', error);
        // Fallback for demo stability if AI fails
        const timestamp = Date.now();
        let fallback;

        if (topic === 'searching') {
            fallback = {
                id: `fallback-search-${timestamp}`,
                title: "Emergency Backup: Search Mission",
                description: "The AI service is unavailable. Find the number 42 in this SORTED list.",
                input: [10, 20, 30, 40, 42, 50, 60, 70, 80, 90],
                optimalAlgorithm: "binary-search",
                explanation: "Since the data is sorted, Binary Search is O(log n), much faster than Linear Search.",
                suboptimalOptions: ["linear-search"],
                incorrectOptions: ["bubble-sort", "quick-sort"]
            };
        } else {
            fallback = {
                id: `fallback-sort-${timestamp}`,
                title: "Emergency Backup: Sorting Crisis",
                description: "The AI service is unavailable. Sort this list of numbers.",
                input: [5, 2, 9, 1, 5, 6],
                optimalAlgorithm: "quick-sort",
                explanation: "Quick sort is generally the fastest O(n log n) algorithm for random data.",
                suboptimalOptions: ["bubble-sort", "insertion-sort"],
                incorrectOptions: ["linear-search"]
            };
        }

        console.warn(`Using fallback problem for topic: ${topic}`);
        res.json(fallback);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
