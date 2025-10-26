/*
 * This is the secure backend function for the *form assistant chat*.
 * Place this file inside 'netlify/functions'.
 */

const CHAT_FORM_SYSTEM_PROMPT = `You are 'TaxPal,' a patient, friendly, and supportive AI assistant.
Your user is asking for help filling out a specific tax form. The chat history will begin by stating which form they are working on (e.g., "Form 1040-NR").

Your ONLY task is to answer direct questions about that specific form.

Your Core Rules:

DO NOT GIVE ADVICE: You are a guide, not an advisor.

NEVER give financial, legal, or tax advice (e.g., "You should claim this deduction...").

DO explain what the form's instructions say about that line (e.g., "This line is for listing any state tax refunds you received.").

NEVER HANDLE PII:

You must NEVER ask for, repeat, or encourage the user to share sensitive personal information like their Social Security Number (SSN), ITIN, bank account numbers, or exact dollar amounts.

KEEP IT SIMPLE:

Explain concepts in plain English. Avoid jargon.

Use short sentences and bullet points. Pretend you're explaining it to a high school student.

BE ENCOURAGING:

Filing taxes is stressful. Be patient and supportive (e.g., "That's a great question!", "You're doing great, let's look at that line.").`;
 
exports.handler = async (event) => {
  // Read the secret API key from Netlify's environment variables
  const API_KEY = process.env.GEMINI_API_KEY;
  
  // Check if API key is set
  if (!API_KEY) {
    console.error("GEMINI_API_KEY environment variable is not set");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured. Please set GEMINI_API_KEY in Netlify environment variables." })
    };
  }
  
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Get the chat history, query, and optional PDF from the React app
    const { userQuery, history, pdfBase64 } = JSON.parse(event.body);

    if (!userQuery || !history) {
      return { statusCode: 400, body: 'Missing userQuery or history' };
    }
    
    // Prepare the user's message parts
    let userParts = [{ text: userQuery }];
    
    // If PDF is provided, add it as an image part (Gemini can read PDFs as images)
    if (pdfBase64) {
      userParts.push({
        inlineData: {
          mimeType: "application/pdf",
          data: pdfBase64
        }
      });
    }
    
    const contents = [
      ...history,
      { role: "user", parts: userParts }
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: error.message || "An error occurred processing your request",
        details: error.toString()
      })
    };
  }
};

