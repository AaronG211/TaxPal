/*
 * This is the secure backend function for the *form assistant chat*.
 * Place this file inside 'netlify/functions'.
 */

const CHAT_FORM_SYSTEM_PROMPT = `You are 'TaxPal,' a friendly AI assistant. You are helping a user fill out a specific tax form.
The user has low financial literacy.
Your task is to answer their questions about this *specific form only*.
1.  Keep answers simple, short, and focused on the form.
2.  If they ask "how do I fill out line 10," give them simple instructions.
3.  If they ask a general tax question, gently guide them back, e.g., "Let's focus on this form first. What line are you wondering about?"
4.  Be encouraging and supportive.
5.  Base your answers on the provided chat history.`;
 
exports.handler = async (event) => {
  // Read the secret API key from Netlify's environment variables
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the chat history and query from the React app
    const { userQuery, history } = JSON.parse(event.body);

    if (!userQuery || !history) {
      return { statusCode: 400, body: 'Missing userQuery or history' };
    }
    
    const contents = [
      ...history,
      { role: "user", parts: [{ text: userQuery }] }
    ];

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: CHAT_FORM_SYSTEM_PROMPT }]
      },
    };

    const apiResponse = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error("Google API error:", errorBody);
      throw new Error(`Google API error! status: ${apiResponse.status}`);
    }

    const result = await apiResponse.json();
    const part = result.candidates?.[0]?.content?.parts?.[0];

    if (part && part.text) {
      // Send the successful text string back to the React app
      return {
        statusCode: 200,
        body: JSON.stringify({ reply: part.text }) // Send back as JSON
      };
    } else {
      throw new Error("Invalid response structure from Google API.");
    }

  } catch (error) {
    console.error("Error in serverless function:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

