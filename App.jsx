import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  User, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  School, 
  CheckSquare, 
  HelpCircle, 
  Send, 
  ArrowRight, 
  Loader2, 
  AlertTriangle,
  Sparkles,
  Home,
  Car,
  X,
  ArrowLeft,
  UploadCloud // Added for drag-and-drop UI
} from 'lucide-react';

// --- API Configuration ---
// The API key is an empty string and will be populated by the environment.
const API_KEY = "";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;

// --- AI System Prompts ---
const PLAN_SYSTEM_PROMPT = `You are 'TaxPal,' a friendly and professional AI assistant. Your goal is to help users with low financial literacy understand their U.S. tax filing requirements.
You are NOT a licensed tax advisor or CPA. You MUST include a disclaimer in your summary that your advice is for informational purposes ONLY and the user should consult a qualified professional for financial advice.
Your tone must be simple, encouraging, and clear. Avoid all complex jargon.
The user will provide their information. Your task is to analyze it and return a JSON object with a plan.
Focus on identifying the correct forms and next steps based on their specific situation (e.g., nationality, income types, SSN status, years in US).`;

const CHAT_FORM_SYSTEM_PROMPT = `You are 'TaxPal,' a friendly AI assistant. You are helping a user fill out a specific tax form.
The user has low financial literacy.
Your task is to answer their questions about this *specific form only*.
1.  Keep answers simple, short, and focused on the form.
2.  If they ask "how do I fill out line 10," give them simple instructions.
3.  If they ask a general tax question, gently guide them back, e.g., "Let's focus on this form first. What line are you wondering about?"
4.  Be encouraging and supportive.
5.  Base your answers on the provided chat history.`;

// --- AI Response JSON Schema ---
// This schema forces the AI to return structured data for the initial plan.
const TAX_PLAN_SCHEMA = {
  type: "OBJECT",
  properties: {
    "disclaimer": {
      "type": "STRING",
      "description": "A mandatory, friendly disclaimer that this is not professional tax advice. Start with 'Please remember...'"
    },
    "analysisSummary": {
      "type": "STRING",
      "description": "A simple, one-paragraph summary of the user's tax situation in plain English."
    },
    "requiredForms": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "formId": { "type": "STRING", "description": "The official form name, e.g., 'Form 1040-NR'" },
          "formTitle": { "type": "STRING", "description": "The full title of the form, e.g., 'U.S. Nonresident Alien Income Tax Return'" },
          "reason": { "type": "STRING", "description": "A simple, one-sentence explanation of *why* this user needs this form based on their inputs." }
        },
        "required": ["formId", "formTitle", "reason"]
      }
    },
    "nextSteps": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "stepTitle": { "type": "STRING", "description": "Short title for the step (e.g., 'Gather W-2s')" },
          "stepDetails": { "type": "STRING", "description": "Detailed, multi-paragraph explanation of how to complete this step. Include full URLs (e.g., 'https://www.irs.gov/...') if helpful for things like tax treaties." }
        },
        "required": ["stepTitle", "stepDetails"]
      }
    },
    "keyQuestions": {
       "type": "ARRAY",
       "items": {
           "type": "STRING",
           "description": "A list of clarifying questions to ask the user to further refine the process. e.g., 'Were you physically present in the U.S. for more than 183 days last year?'"
       }
    }
  },
  "required": ["disclaimer", "analysisSummary", "requiredForms", "nextSteps", "keyQuestions"]
};

// --- Utility Functions ---

/**
 * A wrapper for fetch that includes exponential backoff.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The fetch options (method, headers, body).
 * @param {number} retries - Number of retries.
 * @param {number} delay - Initial delay in ms.
 * @returns {Promise<object>} - The JSON response.
 */
const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      if (i === retries - 1) {
        console.error("All retry attempts failed.", error);
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

/**
 * Generic function to call the Gemini API.
 * @param {string} userQuery - The user's prompt.
 * @param {string} systemPrompt - The system instruction.
 * @param {Array<object> | null} history - The chat history (optional).
 * @param {object | null} schema - The JSON schema (optional).
 * @returns {Promise<string>} - The text part of the AI's response.
 */
const fetchGeminiResponse = async (userQuery, systemPrompt, history = null, schema = null) => {
  const contents = [];
  
  if (history) {
    contents.push(...history);
  }
  contents.push({ role: "user", parts: [{ text: userQuery }] });

  const payload = {
    contents: contents,
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
  };

  if (schema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: schema
    };
  }

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  };

  try {
    const result = await fetchWithBackoff(API_URL, options);
    const part = result.candidates?.[0]?.content?.parts?.[0];
    if (part && part.text) {
      return part.text;
    } else {
      throw new Error("Invalid response structure from API.");
    }
  } catch (error) {
    console.error("Error fetching Gemini response:", error);
    return "Sorry, I encountered an error trying to get a response. Please try again.";
  }
};


// --- React Components ---

/**
 * Step 1: Welcome Screen
 */
const IntroScreen = ({ onStart }) => (
  <div className="text-center p-8 max-w-2xl mx-auto">
    <Sparkles className="w-16 h-16 mx-auto text-blue-500" />
    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mt-4">
      Welcome to Your AI TaxPal
    </h1>
    <p className="text-lg text-slate-600 dark:text-slate-300 mt-4">
      Filing taxes can be confusing. We're here to help!
    </p>
    <p className="text-md text-slate-600 dark:text-slate-300 mt-4">
      Answer a few simple questions, and our AI will help you understand
      what forms you need and guide you through the next steps.
    </p>
    <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-lg text-yellow-800 dark:text-yellow-200 text-left">
      <div className="flex">
        <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
        <p>
          <strong className="font-bold">Important:</strong> I am an AI assistant, not a tax professional.
          This is for informational purposes only. Please consult a qualified
          accountant or tax advisor for financial advice.
        </p>
      </div>
    </div>
    <button
      onClick={onStart}
      className="mt-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center mx-auto"
    >
      Get Started
      <ArrowRight className="w-5 h-5 ml-2" />
    </button>
  </div>
);

/**
 * Step 2: Intake Form
 */
const IntakeForm = ({ onSubmit, onLoading }) => {
  const [formData, setFormData] = useState({
    nationality: '',
    state: '',
    jobStatus: 'Employed',
    incomeSources: [],
    hasSSN: 'Yes',
    isStudent: 'No',
    housingStatus: 'Rent',
    ownsCar: 'No',
    yearsInUS: '',
    specifics: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newIncomeSources = checked
        ? [...prev.incomeSources, value]
        : prev.incomeSources.filter(source => source !== value);
      return { ...prev, incomeSources: newIncomeSources };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLoading();
    onSubmit(formData);
  };
  
  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ];
  
  const incomeOptions = [
    "W-2 Salary (from an employer)",
    "Self-Employment / Freelance (1099-NEC/MISC)",
    "Stock Investments (Dividends/Capital Gains)",
    "Rental Income",
    "Cryptocurrency",
    'Other'
  ];

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
        Tell us about yourself
      </h2>
      <p className="text-slate-600 dark:text-slate-300 mb-8">
        This information will help us create your personalized tax plan.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Nationality (Country of Citizenship)"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            icon={User}
            placeholder="e.g., USA, China, India"
            required
          />
          <FormSelect
            label="What U.S. State do you live in?"
            name="state"
            value={formData.state}
            onChange={handleChange}
            icon={MapPin}
            required
          >
            <option value="">Select a state</option>
            {usStates.map(state => <option key={state} value={state}>{state}</option>)}
            <option value="N/A">Not a U.S. Resident</option>
          </FormSelect>
        </div>

        {/* Conditional Nationality Input */}
        {formData.nationality && formData.nationality.toLowerCase() !== 'usa' && formData.nationality.toLowerCase() !== 'us' && (
          <FormInput
            label="How many years (in total) have you lived in the U.S.?"
            name="yearsInUS"
            type="number"
            value={formData.yearsInUS}
            onChange={handleChange}
            icon={MapPin}
            placeholder="e.g., 3"
          />
        )}

        {/* Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormSelect
            label="Current Job Status"
            name="jobStatus"
            value={formData.jobStatus}
            onChange={handleChange}
            icon={Briefcase}
          >
            <option>Employed</option>
            <option>Self-Employed</option>
            <option>Student</option>
            <option>Unemployed</option>
            <option>Retired</option>
          </FormSelect>
          
          <FormRadio
            label="Are you currently a student?"
            name="isStudent"
            value={formData.isStudent}
            onChange={handleChange}
            icon={School}
            options={['Yes', 'No']}
          />
        </div>

        {/* SSN Radio */}
        <FormRadio
          label="Do you have a U.S. Social Security Number (SSN) or ITIN?"
          name="hasSSN"
          value={formData.hasSSN}
          onChange={handleChange}
          icon={User}
          options={['Yes', 'No']}
        />

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormRadio
            label="What is your housing status?"
            name="housingStatus"
            value={formData.housingStatus}
            onChange={handleChange}
            icon={Home}
            options={['Rent', 'Own']}
          />
          <FormRadio
            label="Do you own or lease a car?"
            name="ownsCar"
            value={formData.ownsCar}
            onChange={handleChange}
            icon={Car}
            options={['Yes', 'No']}
          />
        </div>

        {/* Income Sources */}
        <FormCheckboxGroup
          label="What were your sources of income last year?"
          icon={DollarSign}
          options={incomeOptions}
          selected={formData.incomeSources}
          onChange={handleCheckboxChange}
        />

        {/* Specifics Text Area */}
        <FormTextArea
          label="Anything else we should know?"
          name="specifics"
          value={formData.specifics}
          onChange={handleChange}
          icon={HelpCircle}
          placeholder="Example: I'm an international student from China with no SSN, but I invested in U.S. stocks."
        />

        {/* Submit Button */}
        <div className="pt-4 text-right">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-end ml-auto"
          >
            Create My Tax Plan
            <Sparkles className="w-5 h-5 ml-2" />
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Form Helper Components ---
const FormInput = ({ label, name, value, onChange, icon: Icon, ...props }) => (
  <div>
    <label htmlFor={name} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    />
  </div>
);

const FormSelect = ({ label, name, value, onChange, icon: Icon, children, ...props }) => (
  <div>
    <label htmlFor={name} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
      {...props}
    >
      {children}
    </select>
  </div>
);

const FormRadio = ({ label, name, value, onChange, icon: Icon, options }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </label>
    <div className="flex space-x-4 mt-2">
      {options.map(option => (
        <label key={option} className="flex items-center">
          <input
            type="radio"
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
          />
          <span className="ml-2 text-slate-800 dark:text-slate-200">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const FormCheckboxGroup = ({ label, icon: Icon, options, selected, onChange }) => (
  <div>
    <label className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </label>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
      {options.map(option => (
        <label key={option} className="flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700">
          <input
            type="checkbox"
            value={option}
            checked={selected.includes(option)}
            onChange={onChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
          />
          <span className="ml-3 text-slate-800 dark:text-slate-200">{option}</span>
        </label>
      ))}
    </div>
  </div>
);

const FormTextArea = ({ label, name, value, onChange, icon: Icon, ...props }) => (
  <div>
    <label htmlFor={name} className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows="3"
      className="w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...props}
    ></textarea>
  </div>
);

/**
 * Step 3: Loading Screen
 */
const LoadingScreen = () => (
  <div className="flex flex-col items-center justify-center p-20 text-center">
    <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-6">
      Analyzing Your Situation...
    </h2>
    <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
      Our AI is creating your personalized tax plan.
    </p>
  </div>
);

/**
 * Helper component for rendering text with clickable links
 */
const LinkedText = ({ text }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return (
    <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
      {parts.map((part, index) =>
        urlRegex.test(part) ? (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline break-all"
          >
            {part}
          </a>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </p>
  );
};


/**
 * New Component: Step Detail Modal
 */
const StepDetailModal = ({ step, onClose }) => (
  <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4">
    <div 
      className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <header className="flex items-center justify-between p-4 border-b dark:border-slate-700">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
          {step.stepTitle}
        </h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X className="w-6 h-6" />
        </button>
      </header>
      <main className="p-6 overflow-y-auto">
        <LinkedText text={step.stepDetails} />
      </main>
      <footer className="p-4 border-t dark:border-slate-700 text-right">
        <button
          onClick={onClose}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
        >
          Got it
        </button>
      </footer>
    </div>
  </div>
);

/**
 * New Component: Form Filing Page
 */
const FormFilingPage = ({ form, onBack }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  // PDF Viewer State
  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const canvasRef = useRef(null);
  const dropAreaRef = useRef(null);


  // Load pdf.js library dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        setPdfJsLoaded(true);
      } else {
        setPdfError("Could not load PDF library. Please refresh the page.");
      }
    };
    script.onerror = () => {
      setPdfError("Failed to load PDF library. Please check your connection.");
    };
    document.body.appendChild(script);
    
    return () => {
      // Check if script was added before trying to remove
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Set the initial greeting from the bot
  useEffect(() => {
    setChatHistory([
      {
        role: 'model',
        parts: [{ 
          text: `Hi! I'm here to help you with Form ${form.formId}. 
          
Ask me anything about this form, like "How do I fill out line 10?" or "What does 'dependent' mean?"`
        }]
      }
    ]);
  }, [form]);

  // Render PDF when file changes
  useEffect(() => {
    if (!pdfFile || !pdfJsLoaded || !canvasRef.current) return;

    setPdfError(null);
    const fileReader = new FileReader();
    fileReader.onload = async function() {
      try {
        const typedarray = new Uint8Array(this.result);
        const loadingTask = window.pdfjsLib.getDocument(typedarray);
        const pdf = await loadingTask.promise;
        
        // Render first page
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const container = dropAreaRef.current;

        if (!container) return;

        // Scale viewport to fit container width
        const viewport = page.getViewport({ scale: 1 });
        const scale = container.clientWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale: scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport
        };
        page.render(renderContext);

      } catch (error) {
        console.error("Error rendering PDF:", error);
        setPdfError("Could not display this PDF. It may be corrupted.");
        setPdfFile(null); // Reset file
      }
    };
    
    fileReader.onerror = () => {
      setPdfError("Failed to read the file.");
    };

    fileReader.readAsArrayBuffer(pdfFile);

  }, [pdfFile, pdfJsLoaded, canvasRef, dropAreaRef]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = { role: "user", parts: [{ text: userInput }] };
    setChatLoading(true);
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');

    // Construct history for API
    const apiHistory = [
      { role: "user", parts: [{ text: `I am asking about Form ${form.formId} (${form.formTitle}).` }]},
      { role: "model", parts: [{ text: "Got it. I'm ready to help you with that form. What's your question?" }]},
      ...chatHistory, 
      newUserMessage
    ];

    // Get response from AI
    const aiResponseText = await fetchGeminiResponse(userInput, CHAT_FORM_SYSTEM_PROMPT, apiHistory, null);
    
    const newAiMessage = { role: "model", parts: [{ text: aiResponseText }] };
    setChatHistory(prev => [...prev, newAiMessage]);
    setChatLoading(false);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setPdfError(null);

    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      setPdfError("Please drop a PDF file.");
    }
  };
  
  // Use a search query as a safe fallback for the form link
  const formSearchUrl = `https://www.irs.gov/forms-pubs/find-form-by-number-or-name?search=${encodeURIComponent(form.formId)}`;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-blue-500 hover:underline mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Tax Plan
      </button>
      
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
        Filing: {form.formId}
      </h2>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">{form.formTitle}</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Side: Form Viewer */}
        <div className="lg:w-1/2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
            Form Preview
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Note: This is a read-only preview. You can't edit here. Drag your own PDF onto the area below!
          </p>
          <div 
            ref={dropAreaRef}
            className={`border-4 border-dashed border-slate-300 dark:border-slate-600 rounded-lg h-96 flex items-center justify-center text-slate-400 dark:text-slate-500 text-center p-4 relative transition-colors ${
              isDragging ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400' : ''
            } ${pdfFile ? 'border-solid p-0' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!pdfFile && (
              <div className="flex flex-col items-center pointer-events-none">
                <UploadCloud className={`w-16 h-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}`} />
                <p className="font-semibold">
                  {isDragging ? 'Drop your PDF here' : `Drag & drop your PDF here`}
                </p>
                <p className="text-sm">or</p>
                <a 
                  href={formSearchUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline font-medium pointer-events-auto"
                  onClick={(e) => e.stopPropagation()} // Prevent drag/drop from firing
                >
                  Find {form.formId} on IRS.gov
                </a>
                {pdfError && (
                  <p className="text-red-500 text-sm mt-2">{pdfError}</p>
                )}
                {!pdfJsLoaded && !pdfError && (
                  <div className="flex items-center text-sm mt-2">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading PDF viewer...
                  </div>
                )}
              </div>
            )}
            <canvas 
              ref={canvasRef} 
              className={`${pdfFile ? 'block' : 'hidden'} max-w-full`}
            />
          </div>
        </div>
        
        {/* Right Side: Chat Assistant */}
        <div className="lg:w-1/2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex flex-col">
          <h3 className="flex items-center text-xl font-semibold text-slate-900 dark:text-white mb-4">
            <HelpCircle className="w-6 h-6 mr-3 text-purple-500" />
            Form Assistant
          </h3>
          
          {/* Chat History */}
          <div className="flex-1 h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-700 rounded-lg mb-4 space-y-4">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-bl-none'
                  }`}
                  style={{ whiteSpace: 'pre-wrap' }}
                >
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl bg-slate-200 dark:bg-slate-600 rounded-bl-none inline-flex items-center">
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1"></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleChatSubmit} className="flex space-x-2">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              disabled={chatLoading}
              placeholder={`Ask about ${form.formId}...`}
              className="flex-1 p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={chatLoading}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


/**
 * Step 4: Results Screen
 */
const ResultsScreen = ({ response, onReset, onStartFiling, onShowStepDetail }) => {
  if (!response) {
    return (
      <div className="text-center p-8">
        <AlertTriangle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-4">
          Oops! Something went wrong.
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          We couldn't generate your tax plan.
        </p>
        <button
          onClick={onReset}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { disclaimer, analysisSummary, requiredForms, nextSteps } = response;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* 1. The Plan */}
      <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
        Your Personalized Tax Plan
      </h2>
      
      {/* Disclaimer */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-lg text-yellow-800 dark:text-yellow-200">
        <div className="flex">
          <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
          <p>
            <strong className="font-bold">A quick reminder:</strong> {disclaimer.replace('Please remember, ', '')}
          </p>
        </div>
      </div>
      
      {/* Summary */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
          Your Tax Summary
        </h3>
        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
          {analysisSummary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Required Forms */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-semibold text-slate-900 dark:text-white mb-4">
            <FileText className="w-6 h-6 mr-3 text-blue-500" />
            Required Forms
          </h3>
          <ul className="space-y-4">
            {requiredForms.length > 0 ? (
              requiredForms.map(form => (
                <li key={form.formId} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <p className="font-bold text-slate-800 dark:text-slate-100">
                    {form.formId}: {form.formTitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                    <strong className="text-slate-700 dark:text-slate-200">Why:</strong> {form.reason}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-slate-600 dark:text-slate-300">
                Based on your answers, it looks like you may not need to file. Let's talk more in the chat!
              </p>
            )}
          </ul>
        </div>
        
        {/* Next Steps */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h3 className="flex items-center text-xl font-semibold text-slate-900 dark:text-white mb-4">
            <CheckSquare className="w-6 h-6 mr-3 text-green-500" />
            Your Next Steps
          </h3>
          <div className="space-y-3">
            {nextSteps.map((step, index) => (
              <button
                key={index}
                onClick={() => onShowStepDetail(step)}
                className="w-full text-left p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <span className="flex-1 text-slate-800 dark:text-slate-100 font-medium">
                    {step.stepTitle}
                  </span>
                  <ArrowRight className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 2. The Form Filing Center */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mt-10">
        <h3 className="flex items-center text-2xl font-semibold text-slate-900 dark:text-white mb-4">
          <FileText className="w-7 h-7 mr-3 text-purple-500" />
          Form Filing Center
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Click on a form to get line-by-line help from our AI assistant.
        </p>
        
        {requiredForms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredForms.map(form => (
              <button
                key={form.formId}
                onClick={() => onStartFiling(form)}
                className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
              >
                <p className="text-xl font-bold">{form.formId}</p>
                <p className="text-sm font-light">{form.formTitle}</p>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-300 text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
            No specific forms were identified for you. If you think this is an error, please start over.
          </p>
        )}
      </div>

      {/* Reset Button */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
        >
          Start over with a new plan
        </button>
      </div>
    </div>
  );
};


/**
 * Main App Component
 */
export default function App() {
  const [step, setStep] = useState('intro'); // 'intro', 'form', 'loading', 'results', 'filing'
  const [formData, setFormData] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [currentForm, setCurrentForm] = useState(null); // For the filing page
  const [currentStepDetail, setCurrentStepDetail] = useState(null); // For the modal

  const handleStart = () => {
    setStep('form');
    setFormData(null);
    setAiResponse(null);
    setError(null);
    setCurrentForm(null);
    setCurrentStepDetail(null);
  };
  
  const handleLoading = () => {
    setStep('loading');
  };

  const handleSubmit = async (data) => {
    setFormData(data);
    setError(null);

    // Create the user query from the form data
    const userQuery = `Here is my tax situation. Please analyze it and provide a plan.
- Nationality: ${data.nationality}
${data.nationality && data.nationality.toLowerCase() !== 'usa' ? `- Years in US: ${data.yearsInUS || 'Not specified'}` : ''}
- State: ${data.state}
- Job Status: ${data.jobStatus}
- Has SSN/ITIN: ${data.hasSSN}
- Is a student: ${data.isStudent}
- Housing Status: ${data.housingStatus}
- Owns a car: ${data.ownsCar}
- Income Sources: ${data.incomeSources.join(', ') || 'None listed'}
- Other details: ${data.specifics || 'None'}`;
    
    try {
      const responseText = await fetchGeminiResponse(
        userQuery, 
        PLAN_SYSTEM_PROMPT, 
        null, 
        TAX_PLAN_SCHEMA
      );
      
      // The response *should* be a JSON string
      const parsedResponse = JSON.parse(responseText);
      setAiResponse(parsedResponse);
      setStep('results');
      
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      setError("The AI response was not in the correct format. Please try again.");
      setStep('form'); // Go back to form on error
    }
  };
  
  // New handlers for modal and filing page
  const handleStartFiling = (form) => {
    setCurrentForm(form);
    setStep('filing');
  };

  const handleShowStepDetail = (step) => {
    setCurrentStepDetail(step);
  };

  const handleCloseModal = () => {
    setCurrentStepDetail(null);
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return <IntroScreen onStart={handleStart} />;
      case 'form':
        return <IntakeForm onSubmit={handleSubmit} onLoading={handleLoading} />;
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        return <ResultsScreen 
          response={aiResponse} 
          onReset={handleStart} 
          onStartFiling={handleStartFiling}
          onShowStepDetail={handleShowStepDetail}
        />;
      case 'filing':
        return <FormFilingPage 
          form={currentForm} 
          onBack={() => {
            setStep('results');
            setCurrentForm(null);
          }} 
        />;
      default:
        return <IntroScreen onStart={handleStart} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <nav className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold">TaxPal</span>
          </div>
        </nav>
      </header>
      <main>
        {renderStep()}
        {error && (
          <div className="max-w-3xl mx-auto p-4 -mt-4">
            <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-lg">
              <p><strong className="font-bold">Error:</strong> {error}</p>
            </div>
          </div>
        )}
      </main>
      
      {/* Step Detail Modal */}
      {currentStepDetail && (
        <StepDetailModal 
          step={currentStepDetail}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

