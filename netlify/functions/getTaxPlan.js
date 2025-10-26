/*
 * This is the secure backend function for the *main tax plan*.
 * Place this file inside 'netlify/functions'.
 */

// --- AI System Prompts ---
const PLAN_SYSTEM_PROMPT = `You are 'TaxPal,' a friendly and professional AI assistant. Your goal is to help users with low financial literacy understand their U.S. tax filing requirements.
You are NOT a licensed tax advisor or CPA. You MUST include a disclaimer in your summary that your advice is for informational purposes ONLY and the user should consult a qualified professional for financial advice.
Your tone must be simple, encouraging, and clear. Avoid all complex jargon.
The user will provide their information. Your task is to analyze it and return a JSON object with a plan.
Focus on identifying the correct forms and next steps based on their specific situation (e.g., nationality, income types, SSN status, years in US).`;

// This is the required JSON structure for the response.
const TAX_PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    "disclaimer": { "type": "STRING" },
    "analysisSummary": { "type": "STRING" },
    "requiredForms": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "formId": { "type": "STRING" },
          "formTitle": { "type": "STRING" },
          "reason": { "type": "STRING" }
        },
        "required": ["formId", "formTitle", "reason"]
      }
    },
    "nextSteps": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "stepTitle": { "type": "STRING" },
          "stepDetails": { "type": "STRING" }
        },
        "required": ["stepTitle", "stepDetails"]
      }
    }
  },
  "required": ["disclaimer", "analysisSummary", "requiredForms", "nextSteps"]
};
 
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
    // Get the user query from the React app
    const { userQuery } = JSON.parse(event.body);

    // This is the check that was failing.
    // We only need the userQuery for the initial plan.
    if (!userQuery) {
      return { statusCode: 400, body: 'Missing userQuery' };
    }
    
    const contents = [
      { role: "user", parts: [{ text: userQuery }] }
    ];

    const payload = {
      contents: contents,
      systemInstruction: {
        parts: [{ text: PLAN_SYSTEM_PROMPT }]
      },
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: TAX_PLAN_SCHEMA,
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
      // Pass the error from Google back to the client
      throw new Error(`Google API error! status: ${apiResponse.status} \nDetails: ${errorBody}`);
    }

    const result = await apiResponse.json();
    const part = result.candidates?.[0]?.content?.parts?.[0];

    if (part && part.text) {
      // Send the successful JSON text string back to the React app
      // App.js will parse this JSON
      return {
        statusCode: 200,
        body: part.text
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

