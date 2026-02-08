export default async (req) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { message, algorithm } = await req.json();

    if (!message || !algorithm) {
      return new Response(JSON.stringify({ error: "Missing message or algorithm" }), {
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

    const systemPrompt = `
      You are AlgoLab's AI Tutor - an expert in teaching algorithms interactively.

      CONTEXT: The user is learning about the "${algorithm}" algorithm on an educational visualization platform.

      TEACHING APPROACH:
      1. Start with a simple, intuitive explanation using real-world analogies when helpful.
      2. Use concrete examples with small inputs (e.g., arrays of 5-7 elements) to illustrate steps.
      3. Include brief pseudocode or code snippets (in JavaScript/Python) when explaining logic.
      4. Mention Time & Space Complexity naturally when relevant, with intuitive explanations (e.g., "O(n²) means if you double the input, it takes 4x longer").

      RESPONSE RULES:
      1. Always assume questions relate to "${algorithm}" unless clearly unrelated.
      2. For vague questions like "explain" or "I don't get it", give a complete beginner-friendly overview.
      3. Keep responses focused and under 250 words unless asked for more detail.
      4. Use bullet points or numbered lists for step-by-step explanations.
      5. If comparing to other algorithms, be brief and focus on key differences.
      6. Skip greetings and filler - deliver educational value immediately.

      TONE: Patient, encouraging, and clear. Like a friendly tutor, not a textbook.
      `;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8888", // Local dev URL
        "X-Title": "AlgoLab",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0613",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenRouter API Error:", errorText);
      return new Response(JSON.stringify({ error: `OpenRouter API responded with ${response.status}` }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const answer = data.choices[0]?.message?.content || "No response received.";

    return new Response(JSON.stringify({ answer }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Function execution error:", error);
    return new Response(JSON.stringify({ error: "Failed to process request", details: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
