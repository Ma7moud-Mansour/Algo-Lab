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

    const systemPrompt = `You are an expert Algorithms Tutor. 
The user is asking a question about the "${algorithm}" algorithm.

STRICT RULES:
1. Answer ONLY questions related to "${algorithm}" or general computer science concepts directly relevant to it.
2. If the user asks about a different topic, politely decline and say: "Please ask only about this algorithm."
3. Explain concepts clearly and simply, suitable for a beginner to intermediate student.
4. Include time and space complexity if relevant to the question.
5. Keep your answer concise (under 200 words) unless a detailed explanation is specifically requested.
6. Do not include conversational filler like "Hello" or "I hope this helps". Get straight to the answer.`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:8888", // Local dev URL
        "X-Title": "AlgoLab",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
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
