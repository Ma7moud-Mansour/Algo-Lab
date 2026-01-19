export const handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { message, algorithm } = JSON.parse(event.body);

    if (!message || !algorithm) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing message or algorithm' }),
      };
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Server configuration error' }),
      };
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
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
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API Error:', errorText);
      throw new Error(`OpenRouter API responded with ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ answer }),
    };

  } catch (error) {
    console.error('Function execution error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process request', details: error.message }),
    };
  }
};
