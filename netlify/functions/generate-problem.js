export default async (req) => {
    // Only allow POST requests
    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    try {
        const { difficulty, topic } = await req.json();

        if (!difficulty || !topic) {
            return new Response(JSON.stringify({ error: "Missing difficulty or topic" }), {
                status: 400,
                headers: { "Content-Type": "application/json" },
            });
        }

        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.error("OPENROUTER_API_KEY is not set");
            return new Response(JSON.stringify({ error: "Server configuration error" }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        const systemPrompt = `You are an Algorithmic Problem Generator.
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

For "sorted" or "nearly sorted" scenarios, ensure the "input" array reflects that property.`;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://algo-lab.netlify.app",
                "X-Title": "AlgoLab Learning Test",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-001",
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate a ${difficulty} difficulty problem about ${topic}.` },
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OpenRouter API Error:", errorText);
            // Return fallback instead of error
            return returnFallback(topic);
        }

        const data = await response.json();
        const content = data.choices[0]?.message?.content;

        if (!content) {
            console.error("No content in AI response");
            return returnFallback(topic);
        }

        try {
            const problem = JSON.parse(content);
            return new Response(JSON.stringify(problem), {
                status: 200,
                headers: { "Content-Type": "application/json" },
            });
        } catch (parseError) {
            console.error("Failed to parse AI response as JSON:", parseError);
            return returnFallback(topic);
        }

    } catch (error) {
        console.error("Function execution error:", error);
        return new Response(JSON.stringify({ error: "Failed to process request", details: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};

function returnFallback(topic) {
    const timestamp = Date.now();
    let fallback;

    if (topic === 'searching') {
        fallback = {
            id: `fallback-search-${timestamp}`,
            title: "Search Mission: Find the Target",
            description: "You have a SORTED list of student IDs. A student lost their ID card and you need to find their record quickly. The list contains 10 IDs.",
            input: [10, 20, 30, 40, 42, 50, 60, 70, 80, 90],
            optimalAlgorithm: "binary-search",
            explanation: "Since the data is sorted, Binary Search is O(log n), much faster than Linear Search O(n). For sorted data, we can eliminate half the remaining elements with each comparison.",
            suboptimalOptions: ["linear-search"],
            incorrectOptions: ["bubble-sort", "quick-sort"]
        };
    } else {
        fallback = {
            id: `fallback-sort-${timestamp}`,
            title: "Sorting Challenge: Organize the Data",
            description: "You received a completely random list of transaction amounts that need to be sorted for a financial report. The dataset is medium-sized with no particular order.",
            input: [64, 34, 25, 12, 22, 11, 90, 5, 77, 45],
            optimalAlgorithm: "quick-sort",
            explanation: "Quick Sort is generally the fastest O(n log n) algorithm for random data due to its excellent cache performance. Merge Sort is also O(n log n) but uses more memory.",
            suboptimalOptions: ["merge-sort", "insertion-sort"],
            incorrectOptions: ["linear-search", "binary-search"]
        };
    }

    return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
