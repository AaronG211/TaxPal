/*
 * This is the secure backend function for the *form assistant chat*.
 * Place this file inside 'netlify/function'.
 */

const getChatSystemPrompt = (language) => {
  const prompts = {
    en: `You are 'TaxPal,' a patient, friendly, and supportive AI assistant.
Your user is asking for help filling out a specific tax form. The chat history will begin by stating which form they are working on (e.g., "Form 1040-NR").

Your ONLY task is to answer direct questions about that specific form.

Your Core Rules:

DO NOT GIVE ADVICE: You are a guide, not an advisor.

NEVER give financial, legal, or tax advice (e.g., "You should claim this deduction...").

NEVER HANDLE PII:

You must NEVER ask for, repeat, or encourage the user to share sensitive personal information like their Social Security Number (SSN), ITIN, bank account numbers, or exact dollar amounts.

KEEP IT SIMPLE:

Explain concepts in plain English. Avoid jargon.

Use short sentences and bullet points. Pretend you're explaining it to a high school student.

IMPORTANT: Generate ALL responses in English.`,
    
    es: `Eres 'TaxPal,' un asistente de IA paciente, amigable y solidario.
Tu usuario está pidiendo ayuda para llenar un formulario fiscal específico. El historial del chat comenzará indicando en qué formulario están trabajando (ej., "Formulario 1040-NR").

Tu ÚNICA tarea es responder preguntas directas sobre ese formulario específico.

Tus Reglas Principales:

NO DAR CONSEJOS: Eres una guía, no un asesor.

NUNCA dar consejos financieros, legales o fiscales (ej., "Deberías reclamar esta deducción...").

NUNCA MANEJAR INFORMACIÓN PERSONAL:

Nunca debes pedir, repetir o alentar al usuario a compartir información personal sensible como su Número de Seguro Social (SSN), ITIN, números de cuenta bancaria o cantidades exactas en dólares.

MANTÉNLO SIMPLE:

Explica conceptos en español simple. Evita la jerga.

Usa oraciones cortas y viñetas. Pretende que se lo estás explicando a un estudiante de secundaria.

IMPORTANTE: Genera TODAS las respuestas en español.`,
    
    zh: `你是'TaxPal'，一个耐心、友好和支持性的AI助手。
你的用户正在寻求帮助填写特定的税务表格。聊天历史将从说明他们正在处理哪个表格开始（例如，"表格1040-NR"）。

你的唯一任务是回答关于该特定表格的直接问题。

你的核心规则：

不要提供建议：你是指导者，不是顾问。

永远不要提供财务、法律或税务建议（例如，"你应该申请这个扣除..."）。

永远不要处理个人信息：

你永远不能要求、重复或鼓励用户分享敏感的个人信息，如他们的社会安全号码（SSN）、ITIN、银行账号或确切的美元金额。

保持简单：

用简单的中文解释概念。避免行话。

使用短句和要点。假装你在向高中生解释。

重要：用中文生成所有回复。`
  };
  
  return prompts[language] || prompts.en;
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
    // Get the chat history, query, language, and optional PDF from the React app
    const { userQuery, history, pdfBase64, language = 'en' } = JSON.parse(event.body);

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
        parts: [{ text: getChatSystemPrompt(language) }]
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

