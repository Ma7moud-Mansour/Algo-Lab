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

        // Get valid algorithm IDs based on topic
        const algorithmsByTopic = {
            'sorting': ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort'],
            'searching': ['linear-search', 'binary-search'],
            'graph': ['bfs', 'dfs'],
            'backtracking': ['n-queens', 'sudoku-solver', 'rat-maze', 'knight-tour', 'tower-of-hanoi'],
            'dynamic-programming': ['fibonacci', 'knapsack-01', 'lcs', 'bellman-ford'],
            'greedy': ['fractional-knapsack', 'optimal-merge']
        };

        const validAlgorithms = algorithmsByTopic[topic] || algorithmsByTopic['sorting'];

        const systemPrompt = `You are an Algorithmic Problem Generator.
Generate a unique coding problem scenario based on:
- Difficulty: ${difficulty} (Easy/Medium/Hard)
- Topic: ${topic}

The Output MUST be valid JSON with this structure:
{
    "id": "string (unique)",
    "title": "string (short catchy title)",
    "description": "string (the problem scenario - make it engaging and practical)",
    "input": [number] (an array of numbers representing sample input, size 5-15 for visualization),
    "optimalAlgorithm": "string (one of: ${validAlgorithms.join(', ')})",
    "explanation": "string (educational explanation of why the optimal algorithm is best for this scenario)",
    "suboptimalOptions": ["string (valid but less optimal algorithm IDs from the same topic)"],
    "incorrectOptions": ["string (completely wrong algorithm IDs - can be from other topics)"]
}

VALID ALGORITHM IDS FOR THIS TOPIC (${topic}):
${validAlgorithms.join(', ')}

ALL ALGORITHM IDS (for incorrectOptions):
bubble-sort, selection-sort, insertion-sort, merge-sort, quick-sort, linear-search, binary-search, bfs, dfs, n-queens, sudoku-solver, rat-maze, knight-tour, tower-of-hanoi, fibonacci, knapsack-01, lcs, bellman-ford, fractional-knapsack, optimal-merge

Generate a realistic scenario where the optimalAlgorithm is clearly the best choice.`;

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

    const fallbacks = {
        'sorting': {
            id: `fallback-sort-${timestamp}`,
            title: "Sorting Challenge: Organize the Data",
            description: "You received a completely random list of transaction amounts that need to be sorted for a financial report. The dataset is medium-sized with no particular order.",
            input: [64, 34, 25, 12, 22, 11, 90, 5, 77, 45],
            optimalAlgorithm: "quick-sort",
            explanation: "Quick Sort is generally the fastest O(n log n) algorithm for random data due to its excellent cache performance.",
            suboptimalOptions: ["merge-sort", "insertion-sort"],
            incorrectOptions: ["linear-search", "binary-search"]
        },
        'searching': {
            id: `fallback-search-${timestamp}`,
            title: "Search Mission: Find the Target",
            description: "You have a SORTED list of student IDs. A student lost their ID card and you need to find their record quickly.",
            input: [10, 20, 30, 40, 42, 50, 60, 70, 80, 90],
            optimalAlgorithm: "binary-search",
            explanation: "Since the data is sorted, Binary Search is O(log n), much faster than Linear Search O(n).",
            suboptimalOptions: ["linear-search"],
            incorrectOptions: ["bubble-sort", "quick-sort"]
        },
        'graph': {
            id: `fallback-graph-${timestamp}`,
            title: "Network Discovery: Find All Connections",
            description: "You need to explore a social network to find all users at each 'friend distance' level from a starting user. Find users 1 friend away, then 2 friends away, etc.",
            input: [1, 2, 3, 4, 5, 6, 7, 8],
            optimalAlgorithm: "bfs",
            explanation: "BFS explores level by level, making it perfect for finding shortest paths or 'distance levels' in unweighted graphs.",
            suboptimalOptions: ["dfs"],
            incorrectOptions: ["quick-sort", "binary-search"]
        },
        'backtracking': {
            id: `fallback-backtrack-${timestamp}`,
            title: "Puzzle Master: Solve the Grid",
            description: "You have a 9x9 Sudoku puzzle with some numbers filled in. Complete the grid so each row, column, and 3x3 box contains 1-9.",
            input: [5, 3, 0, 0, 7, 0, 0, 0, 0],
            optimalAlgorithm: "sudoku-solver",
            explanation: "Sudoku is a constraint satisfaction problem perfectly suited for backtracking - try a number, check constraints, backtrack if invalid.",
            suboptimalOptions: ["n-queens", "rat-maze"],
            incorrectOptions: ["quick-sort", "bfs"]
        },
        'dynamic-programming': {
            id: `fallback-dp-${timestamp}`,
            title: "Treasure Hunter: Maximum Loot",
            description: "You're a thief with a knapsack of capacity 50kg. Each treasure has a weight and value. Maximize total value without exceeding capacity. Each item can only be taken once.",
            input: [10, 20, 30, 40, 50],
            optimalAlgorithm: "knapsack-01",
            explanation: "The 0/1 Knapsack problem uses DP to find optimal item selection, avoiding redundant calculations through memoization.",
            suboptimalOptions: ["fibonacci", "lcs"],
            incorrectOptions: ["fractional-knapsack", "quick-sort"]
        },
        'greedy': {
            id: `fallback-greedy-${timestamp}`,
            title: "Cargo Loading: Fill the Truck",
            description: "You're loading a delivery truck (capacity 100kg). You can take FRACTIONS of items. Each item has weight and value. Maximize total value.",
            input: [20, 30, 40, 50, 10],
            optimalAlgorithm: "fractional-knapsack",
            explanation: "When fractions are allowed, greedy by value/weight ratio is optimal. Unlike 0/1 Knapsack, we don't need DP!",
            suboptimalOptions: ["optimal-merge"],
            incorrectOptions: ["knapsack-01", "quick-sort"]
        }
    };

    const fallback = fallbacks[topic] || fallbacks['sorting'];

    return new Response(JSON.stringify(fallback), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
