const { useState, useEffect, useRef } = React;

// --- API Configuration ---
// We no longer need the API Key or URL here.
// All API calls will go to our secure serverless functions.
console.log("App.js loaded. API calls will be proxied.");


// --- AI System Prompts ---
// These are now moved to the serverless functions.
// We can remove PLAN_SYSTEM_PROMPT, CHAT_FORM_SYSTEM_PROMPT, and TAX_PLAN_SCHEMA
// from this file to save space and keep secrets on the backend.


// --- Utility Functions ---

/**
 * A wrapper for fetch that includes exponential backoff.
 * @param {string} url - The URL to fetch.
 * @param {object} options - The fetch options (method, headers, body).
 * @param {number} retries - Number of retries.
 * @param {number} delay - Initial delay in ms.
 * @returns {Promise<object>} - The raw fetch response.
 */
const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        // Try to get error details from response body
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorBody = await response.json();
          if (errorBody.error) {
            errorMessage = errorBody.error;
          }
        } catch (e) {
          // If can't parse JSON, use status text
          errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      // We change this: return the raw response first, then decide if .json() or .text()
      return response;
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
 * Function to call our secure chat backend.
 * @param {string} userQuery - The user's prompt.
 * @param {Array<object>} history - The chat history.
 * @returns {Promise<string>} - The text part of the AI's response.
 */
const fetchChatReply = async (userQuery, history) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuery, history })
  };

  try {
    // 1. Call our new secure function
    const response = await fetchWithBackoff("/.netlify/functions/getChatReply", options);
    
    // 2. Get the JSON response from our function
    const result = await response.json(); 
    
    if (result.reply) {
      return result.reply;
    } else {
      throw new Error(result.error || "Invalid response from chat function.");
    }
  } catch (error) {
    console.error("Error fetching chat reply:", error);
    throw error; // Re-throw to be handled by caller
  }
};


// --- React Components ---

/**
 * Step 1: Welcome Screen
 */
const IntroScreen = ({ onStart }) => React.createElement('div', { className: "min-h-screen flex items-center justify-center p-8 relative overflow-hidden" },
  // Animated background
  React.createElement('div', { className: "absolute inset-0 gradient-bg opacity-10" }),
  React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50" }),
  
  // Floating decorative elements
  React.createElement('div', { className: "absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" }),
  React.createElement('div', { className: "absolute bottom-20 right-10 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float", style: { animationDelay: '2s' } }),
  
  // Main content
  React.createElement('div', { className: "relative z-10 text-center max-w-4xl mx-auto animate-fadeIn" },
    // Logo/Icon with animation
    React.createElement('div', { className: "mb-8 relative inline-block" },
      React.createElement('div', { className: "w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300" },
        React.createElement('span', { className: "text-5xl" }, '📋')
      )
    ),
    
    // Heading with gradient text
    React.createElement('h1', { className: "text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 leading-tight" },
      "Your Personal",
      React.createElement('br', null),
      "AI TaxPal"
    ),
    
    // Subtitle
    React.createElement('p', { className: "text-xl md:text-2xl text-slate-600 mb-4 font-medium" },
      "Making Tax Filing Simple & Stress-Free"
    ),
    React.createElement('p', { className: "text-lg text-slate-500 mb-8 max-w-2xl mx-auto" },
      "Get personalized tax guidance powered by AI. We'll help you understand what forms you need and guide you through every step."
    ),
    
    // Feature highlights
    React.createElement('div', { className: "flex flex-wrap justify-center gap-4 mb-10" },
      React.createElement('div', { className: "flex items-center bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-md border border-purple-100" },
        React.createElement('span', { className: "text-xl mr-2" }, '🤖'),
        React.createElement('span', { className: "text-sm font-medium text-slate-700" }, 'AI-Powered')
      ),
      React.createElement('div', { className: "flex items-center bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-md border border-purple-100" },
        React.createElement('span', { className: "text-xl mr-2" }, '⚡'),
        React.createElement('span', { className: "text-sm font-medium text-slate-700" }, 'Quick & Easy')
      ),
      React.createElement('div', { className: "flex items-center bg-white/80 backdrop-blur-sm px-5 py-2 rounded-full shadow-md border border-purple-100" },
        React.createElement('span', { className: "text-xl mr-2" }, '🎯'),
        React.createElement('span', { className: "text-sm font-medium text-slate-700" }, 'Personalized')
      )
    ),
    
    // CTA Button
    React.createElement('button', {
      onClick: onStart,
      className: "group relative bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-12 rounded-2xl text-lg shadow-2xl shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-purple-600/60 flex items-center justify-center mx-auto mb-8"
    },
      "Get Started",
      React.createElement('svg', { className: "ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 7l5 5m0 0l-5 5m5-5H6" })
      )
    ),
    
    // Disclaimer
    React.createElement('div', { className: "bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto" },
      React.createElement('div', { className: "flex items-start" },
        React.createElement('div', { className: "w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1" },
          React.createElement('span', { className: "text-white text-xl" }, '⚠️')
        ),
        React.createElement('div', null,
          React.createElement('h3', { className: "font-bold text-amber-900 mb-2" }, "Important Disclaimer"),
          React.createElement('p', { className: "text-sm text-amber-800 leading-relaxed" },
            "I am an AI assistant, not a tax professional. This is for informational purposes only. Please consult a qualified accountant or tax advisor for financial advice."
          )
        )
      )
    )
  )
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

  return React.createElement('div', { className: "max-w-3xl mx-auto p-4 md:p-8" },
    React.createElement('h2', { className: "text-3xl font-bold text-slate-900 dark:text-white mb-6" },
      "Tell us about yourself"
    ),
    React.createElement('p', { className: "text-slate-600 dark:text-slate-300 mb-8" },
      "This information will help us create your personalized tax plan."
    ),
    React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6" },
      // Personal Info Grid
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement(FormInput, {
          label: "Nationality (Country of Citizenship)",
          name: "nationality",
          value: formData.nationality,
          onChange: handleChange,
          icon: "👤",
          placeholder: "e.g., USA, China, India",
          required: true
        }),
        React.createElement(FormSelect, {
          label: "What U.S. State do you live in?",
          name: "state",
          value: formData.state,
          onChange: handleChange,
          icon: "📍",
          required: true
        },
          React.createElement('option', { value: "" }, "Select a state"),
          usStates.map(state => React.createElement('option', { key: state, value: state }, state)),
          React.createElement('option', { value: "N/A" }, "Not a U.S. Resident")
        )
      ),

      // Conditional Nationality Input
      formData.nationality && formData.nationality.toLowerCase() !== 'usa' && formData.nationality.toLowerCase() !== 'us' && 
      React.createElement(FormInput, {
        label: "How many years (in total) have you lived in the U.S.?",
        name: "yearsInUS",
        type: "number",
        value: formData.yearsInUS,
        onChange: handleChange,
        icon: "📍",
        placeholder: "e.g., 3"
      }),

      // Status Grid
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement(FormSelect, {
          label: "Current Job Status",
          name: "jobStatus",
          value: formData.jobStatus,
          onChange: handleChange,
          icon: "💼"
        },
          React.createElement('option', null, "Employed"),
          React.createElement('option', null, "Self-Employed"),
          React.createElement('option', null, "Student"),
          React.createElement('option', null, "Unemployed"),
          React.createElement('option', null, "Retired")
        ),
        
        React.createElement(FormRadio, {
          label: "Are you currently a student?",
          name: "isStudent",
          value: formData.isStudent,
          onChange: handleChange,
          icon: "🎓",
          options: ['Yes', 'No']
        })
      ),

      // SSN Radio
      React.createElement(FormRadio, {
        label: "Do you have a U.S. Social Security Number (SSN) or ITIN?",
        name: "hasSSN",
        value: formData.hasSSN,
        onChange: handleChange,
        icon: "👤",
        options: ['Yes', 'No']
      }),

      // Assets Grid
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement(FormRadio, {
          label: "What is your housing status?",
          name: "housingStatus",
          value: formData.housingStatus,
          onChange: handleChange,
          icon: "🏠",
          options: ['Rent', 'Own']
        }),
        React.createElement(FormRadio, {
          label: "Do you own or lease a car?",
          name: "ownsCar",
          value: formData.ownsCar,
          onChange: handleChange,
          icon: "🚗",
          options: ['Yes', 'No']
        })
      ),

      // Income Sources
      React.createElement(FormCheckboxGroup, {
        label: "What were your sources of income last year?",
        icon: "💰",
        options: incomeOptions,
        selected: formData.incomeSources,
        onChange: handleCheckboxChange
      }),

      // Specifics Text Area
      React.createElement(FormTextArea, {
        label: "Anything else we should know?",
        name: "specifics",
        value: formData.specifics,
        onChange: handleChange,
        icon: "❓",
        placeholder: "Example: I'm an international student from China with no SSN, but I invested in U.S. stocks."
      }),

      // Submit Button
      React.createElement('div', { className: "pt-4 text-right" },
        React.createElement('button', {
          type: "submit",
          className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-end ml-auto"
        },
          "Create My Tax Plan",
          React.createElement('span', { className: "w-5 h-5 ml-2" }, '✨')
        )
      )
    )
  );
};

// --- Form Helper Components ---
const FormInput = ({ label, name, value, onChange, icon, ...props }) => React.createElement('div', null,
  React.createElement('label', { htmlFor: name, className: "flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" },
    icon && React.createElement('span', { className: "text-xl mr-2" }, icon),
    label
  ),
  React.createElement('input', {
    id: name,
    name: name,
    value: value,
    onChange: onChange,
    className: "w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md",
    ...props
  })
);

const FormSelect = ({ label, name, value, onChange, icon, children, ...props }) => React.createElement('div', null,
  React.createElement('label', { htmlFor: name, className: "flex items-center text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2" },
    icon && React.createElement('span', { className: "text-xl mr-2" }, icon),
    label
  ),
  React.createElement('select', {
    id: name,
    name: name,
    value: value,
    onChange: onChange,
    className: "w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all shadow-sm hover:shadow-md appearance-none cursor-pointer",
    ...props
  }, children)
);

const FormRadio = ({ label, name, value, onChange, icon, options }) => React.createElement('div', null,
  React.createElement('label', { className: "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" },
    icon && React.createElement('span', { className: "w-4 h-4 mr-2" }, icon),
    label
  ),
  React.createElement('div', { className: "flex space-x-4 mt-2" },
    options.map(option => React.createElement('label', { key: option, className: "flex items-center" },
      React.createElement('input', {
        type: "radio",
        name: name,
        value: option,
        checked: value === option,
        onChange: onChange,
        className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
      }),
      React.createElement('span', { className: "ml-2 text-slate-800 dark:text-slate-200" }, option)
    ))
  )
);

const FormCheckboxGroup = ({ label, icon, options, selected, onChange }) => React.createElement('div', null,
  React.createElement('label', { className: "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" },
    icon && React.createElement('span', { className: "w-4 h-4 mr-2" }, icon),
    label
  ),
  React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2" },
    options.map(option => React.createElement('label', { key: option, className: "flex items-center p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700" },
      React.createElement('input', {
        type: "checkbox",
        value: option,
        checked: selected.includes(option),
        onChange: onChange,
        className: "h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
      }),
      React.createElement('span', { className: "ml-3 text-slate-800 dark:text-slate-200" }, option)
    ))
  )
);

const FormTextArea = ({ label, name, value, onChange, icon, ...props }) => React.createElement('div', null,
  React.createElement('label', { htmlFor: name, className: "flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" },
    icon && React.createElement('span', { className: "w-4 h-4 mr-2" }, icon),
    label
  ),
  React.createElement('textarea', {
    id: name,
    name: name,
    value: value,
    onChange: onChange,
    rows: "3",
    className: "w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500",
    ...props
  })
);

/**
 * Step 3: Loading Screen
 */
const LoadingScreen = () => React.createElement('div', { className: "flex flex-col items-center justify-center min-h-screen p-20 text-center relative overflow-hidden" },
  // Animated background
  React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50" }),
  React.createElement('div', { className: "absolute top-1/4 left-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" }),
  
  // Content
  React.createElement('div', { className: "relative z-10" },
    // Animated icon
    React.createElement('div', { className: "mb-8 relative" },
      React.createElement('div', { className: "w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce" },
        React.createElement('svg', { className: "w-12 h-12 text-white animate-spin", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })
        )
      )
    ),
    React.createElement('h2', { className: "text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mt-6 mb-4" },
      "Analyzing Your Situation..."
    ),
    React.createElement('p', { className: "text-xl text-slate-600 mb-8" },
      "Our AI is creating your personalized tax plan"
    ),
    // Loading dots
    React.createElement('div', { className: "flex justify-center gap-2" },
      React.createElement('div', { className: "w-3 h-3 bg-purple-600 rounded-full animate-bounce", style: { animationDelay: '0s' } }),
      React.createElement('div', { className: "w-3 h-3 bg-pink-600 rounded-full animate-bounce", style: { animationDelay: '0.2s' } }),
      React.createElement('div', { className: "w-3 h-3 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: '0.4s' } })
    )
  )
);

/**
 * Helper component for rendering text with clickable links
 */
const LinkedText = ({ text }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return React.createElement('p', { className: "text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap" },
    parts.map((part, index) =>
      urlRegex.test(part) ? React.createElement('a', {
        key: index,
        href: part,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "text-blue-500 hover:underline break-all"
      }, part) : React.createElement('span', { key: index }, part)
    )
  );
};

/**
 * New Component: Step Detail Modal
 */
const StepDetailModal = ({ step, onClose }) => React.createElement('div', { className: "fixed inset-0 bg-black/60 z-40 flex items-center justify-center p-4" },
  React.createElement('div', {
    className: "bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] flex flex-col",
    onClick: (e) => e.stopPropagation()
  },
    React.createElement('header', { className: "flex items-center justify-between p-4 border-b dark:border-slate-700" },
      React.createElement('h3', { className: "text-xl font-semibold text-slate-900 dark:text-white" },
        step.stepTitle
      ),
      React.createElement('button', {
        onClick: onClose,
        className: "p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
      }, '✕')
    ),
    React.createElement('main', { className: "p-6 overflow-y-auto" },
      React.createElement(LinkedText, { text: step.stepDetails })
    ),
    React.createElement('footer', { className: "p-4 border-t dark:border-slate-700 text-right" },
      React.createElement('button', {
        onClick: onClose,
        className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-transform transform hover:scale-105"
      }, "Got it")
    )
  )
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
        
        const page = await pdf.getPage(1);
        
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const container = dropAreaRef.current;

        if (!container) return;

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
        setPdfFile(null);
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

  // THIS IS THE MODIFIED CHAT SUBMIT HANDLER
  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newUserMessage = { role: "user", parts: [{ text: userInput }] };
    setChatLoading(true);
    setChatHistory(prev => [...prev, newUserMessage]);
    setUserInput('');

    // Prepare history for the API
    const apiHistory = [
      { role: "user", parts: [{ text: `I am asking about Form ${form.formId} (${form.formTitle}).` }]},
      { role: "model", parts: [{ text: "Got it. I'm ready to help you with that form. What's your question?" }]},
      ...chatHistory, 
      // newUserMessage is NOT added here, it's sent as the new userQuery
    ];

    try {
      // Call our new secure chat function
      const aiResponseText = await fetchChatReply(userInput, apiHistory);
      
      const newAiMessage = { role: "model", parts: [{ text: aiResponseText }] };
      setChatHistory(prev => [...prev, newAiMessage]);
    } catch (error) {
      console.error("Failed to get chat reply:", error);
      const errorMessage = { role: "model", parts: [{ text: "Sorry, I couldn't connect to the AI assistant. Please try again." }] };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    
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
  
  const formSearchUrl = `https://www.irs.gov/forms-pubs/find-form-by-number-or-name?search=${encodeURIComponent(form.formId)}`;

  return React.createElement('div', { className: "max-w-7xl mx-auto p-4 md:p-8" },
    React.createElement('button', {
      onClick: onBack,
      className: "flex items-center text-sm text-blue-500 hover:underline mb-4"
    },
      React.createElement('span', { className: "w-4 h-4 mr-1" }, '←'),
      "Back to Tax Plan"
    ),
    
    React.createElement('h2', { className: "text-3xl font-bold text-slate-900 dark:text-white mb-1" },
      `Filing: ${form.formId}`
    ),
    React.createElement('p', { className: "text-lg text-slate-600 dark:text-slate-300 mb-6" }, form.formTitle),

    React.createElement('div', { className: "flex flex-col lg:flex-row gap-8" },
      // Left Side: Form Viewer
      React.createElement('div', { className: "lg:w-1/2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md" },
        React.createElement('h3', { className: "text-xl font-semibold text-slate-900 dark:text-white mb-2" },
          "Form Preview"
        ),
        React.createElement('p', { className: "text-sm text-slate-500 dark:text-slate-400 mb-4" },
          "Note: This is a read-only preview. You can't edit here. Drag your own PDF onto the area below!"
        ),
        React.createElement('div', {
          ref: dropAreaRef,
          className: `border-4 ${pdfFile ? 'border-slate-300 dark:border-slate-600' : 'border-dashed border-slate-300 dark:border-slate-600'} rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 text-center relative transition-colors overflow-auto ${
            isDragging ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-400' : ''
          } ${pdfFile ? 'p-4 min-h-fit' : 'h-96 p-4'}`,
          onDragOver: handleDragOver,
          onDragLeave: handleDragLeave,
          onDrop: handleDrop,
          style: pdfFile ? {} : { minHeight: '400px' }
        },
          !pdfFile && React.createElement('div', { className: "flex flex-col items-center pointer-events-none" },
            React.createElement('div', { className: `w-16 h-16 mb-4 ${isDragging ? 'text-blue-500' : 'text-slate-400'}` }, '📁'),
            React.createElement('p', { className: "font-semibold" },
              isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF here'
            ),
            React.createElement('p', { className: "text-sm" }, "or"),
            React.createElement('a', {
              href: formSearchUrl,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-500 hover:underline font-medium pointer-events-auto",
              onClick: (e) => e.stopPropagation()
            }, `Find ${form.formId} on IRS.gov`),
            pdfError && React.createElement('p', { className: "text-red-500 text-sm mt-2" }, pdfError),
            !pdfJsLoaded && !pdfError && React.createElement('div', { className: "flex items-center text-sm mt-2" },
              React.createElement('span', { className: "w-4 h-4 mr-2 animate-spin" }, '⏳'),
              "Loading PDF viewer..."
            )
          ),
          pdfFile && React.createElement('canvas', {
            ref: canvasRef,
            className: "block max-w-full mx-auto shadow-lg rounded-lg"
          })
        )
      ),
      
      // Right Side: Chat Assistant
      React.createElement('div', { className: "lg:w-1/2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md flex flex-col" },
        React.createElement('h3', { className: "flex items-center text-xl font-semibold text-slate-900 dark:text-white mb-4" },
          React.createElement('span', { className: "w-6 h-6 mr-3 text-purple-500" }, '❓'),
          "Form Assistant"
        ),
        
        // Chat History
        React.createElement('div', { className: "flex-1 h-80 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-700 rounded-lg mb-4 space-y-4" },
          chatHistory.map((msg, index) => React.createElement('div', { key: index, className: `flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}` },
            React.createElement('div', {
              className: `max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-200 dark:bg-slate-600 text-slate-900 dark:text-white rounded-bl-none'
              }`,
              style: { whiteSpace: 'pre-wrap' }
            }, msg.parts[0].text)
          )),
          chatLoading && React.createElement('div', { className: "flex justify-start" },
            React.createElement('div', { className: "p-3 rounded-2xl bg-slate-200 dark:bg-slate-600 rounded-bl-none inline-flex items-center" },
              React.createElement('div', { className: "w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1" }),
              React.createElement('div', { className: "w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1", style: {animationDelay: '0.1s'} }),
              React.createElement('div', { className: "w-2 h-2 bg-slate-500 rounded-full animate-bounce mx-1", style: {animationDelay: '0.2s'} })
            )
          ),
          React.createElement('div', { ref: chatBottomRef })
        ),

        // Chat Input
        React.createElement('form', { onSubmit: handleChatSubmit, className: "flex space-x-2" },
          React.createElement('input', {
            type: "text",
            value: userInput,
            onChange: (e) => setUserInput(e.target.value),
            disabled: chatLoading,
            placeholder: `Ask about ${form.formId}...`,
            className: "flex-1 p-3 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          }),
          React.createElement('button', {
            type: "submit",
            disabled: chatLoading,
            className: "p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
          }, '📤')
        )
      )
    )
  );
};

/**
 * Step 4: Results Screen
 */
const ResultsScreen = ({ response, onReset, onStartFiling, onShowStepDetail }) => {
  if (!response) {
    return React.createElement('div', { className: "text-center p-8" },
      React.createElement('div', { className: "w-12 h-12 mx-auto text-red-500" }, '⚠️'),
      React.createElement('h2', { className: "text-2xl font-bold text-slate-900 dark:text-white mt-4" },
        "Oops! Something went wrong."
      ),
      React.createElement('p', { className: "text-slate-600 dark:text-slate-300 mt-2" },
        "We couldn't generate your tax plan."
      ),
      React.createElement('button', {
        onClick: onReset,
        className: "mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
      }, "Try Again")
    );
  }

  const { disclaimer, analysisSummary, requiredForms, nextSteps } = response;

  return React.createElement('div', { className: "max-w-4xl mx-auto p-4 md:p-8 space-y-8" },
    // 1. The Plan
    React.createElement('h2', { className: "text-3xl font-bold text-slate-900 dark:text-white" },
      "Your Personalized Tax Plan"
    ),
    
    // Disclaimer
    React.createElement('div', { className: "p-4 bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 rounded-lg text-yellow-800 dark:text-yellow-200" },
      React.createElement('div', { className: "flex" },
        React.createElement('div', { className: "w-6 h-6 mr-3 flex-shrink-0" }, '⚠️'),
        React.createElement('p', null,
          React.createElement('strong', { className: "font-bold" }, "A quick reminder:"), ` ${disclaimer.replace('Please remember, ', '')}`
        )
      )
    ),
    
    // Summary
    React.createElement('div', { className: "bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md" },
      React.createElement('h3', { className: "text-xl font-semibold text-slate-900 dark:text-white mb-3" },
        "Your Tax Summary"
      ),
      React.createElement('p', { className: "text-slate-700 dark:text-slate-300 leading-relaxed" },
        analysisSummary
      )
    ),

    React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
      // Required Forms
      React.createElement('div', { className: "bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md" },
        React.createElement('h3', { className: "flex items-center text-xl font-semibold text-slate-900 dark:text-white mb-4" },
          React.createElement('span', { className: "w-6 h-6 mr-3 text-blue-500" }, '📄'),
          "Required Forms"
        ),
        React.createElement('ul', { className: "space-y-4" },
          requiredForms.length > 0 ? 
            requiredForms.map(form => React.createElement('li', { key: form.formId, className: "p-4 bg-slate-50 dark:bg-slate-700 rounded-lg" },
              React.createElement('p', { className: "font-bold text-slate-800 dark:text-slate-100" },
                `${form.formId}: ${form.formTitle}`
              ),
              React.createElement('p', { className: "text-sm text-slate-600 dark:text-slate-300 mt-1" },
                React.createElement('strong', { className: "text-slate-700 dark:text-slate-200" }, "Why:"), ` ${form.reason}`
              )
            )) :
            React.createElement('p', { className: "text-slate-600 dark:text-slate-300" },
              "Based on your answers, it looks like you may not need to file. Let's talk more in the chat!"
            )
        )
      ),
      
      // Next Steps
      React.createElement('div', { className: "bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md" },
        React.createElement('h3', { className: "flex items-center text-xl font-semibold text-slate-900 dark:text-white mb-4" },
          React.createElement('span', { className: "w-6 h-6 mr-3 text-green-500" }, '✅'),
          "Your Next Steps"
        ),
        React.createElement('div', { className: "space-y-3" },
          nextSteps.map((step, index) => React.createElement('button', {
            key: index,
            onClick: () => onShowStepDetail(step),
            className: "w-full text-left p-4 bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          },
            React.createElement('div', { className: "flex items-center" },
              React.createElement('div', { className: "flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3" },
                index + 1
              ),
              React.createElement('span', { className: "flex-1 text-slate-800 dark:text-slate-100 font-medium" },
                step.stepTitle
              ),
              React.createElement('span', { className: "w-5 h-5 text-slate-400 dark:text-slate-500" }, '→')
            )
          ))
        )
      )
    ),
    
    // 2. The Form Filing Center
    React.createElement('div', { className: "bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mt-10" },
      React.createElement('h3', { className: "flex items-center text-2xl font-semibold text-slate-900 dark:text-white mb-4" },
        React.createElement('span', { className: "w-7 h-7 mr-3 text-purple-500" }, '📄'),
        "Form Filing Center"
      ),
      React.createElement('p', { className: "text-slate-600 dark:text-slate-300 mb-6" },
        "Click on a form to get line-by-line help from our AI assistant."
      ),
      
      requiredForms.length > 0 ? 
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
          requiredForms.map(form => React.createElement('button', {
            key: form.formId,
            onClick: () => onStartFiling(form),
            className: "p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          },
            React.createElement('p', { className: "text-xl font-bold" }, form.formId),
            React.createElement('p', { className: "text-sm font-light" }, form.formTitle)
          ))
        ) :
        React.createElement('p', { className: "text-slate-600 dark:text-slate-300 text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg" },
          "No specific forms were identified for you. If you think this is an error, please start over."
        )
    ),

    // Reset Button
    React.createElement('div', { className: "text-center pt-4" },
      React.createElement('button', {
        onClick: onReset,
        className: "text-sm text-slate-500 dark:text-slate-400 hover:underline"
      }, "Start over with a new plan")
    )
  );
};


/**
 * Main App Component
 */
function App() {
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

  // THIS IS THE MODIFIED SUBMIT HANDLER
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
      // 1. Call our new secure Netlify Function
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery })
      };
      
      const response = await fetchWithBackoff("/.netlify/functions/getTaxPlan", options);
      
      // 2. The response body is the JSON *text*
      const responseText = await response.text();
      
      console.log("Raw AI response:", responseText);
      
      // 3. Now we parse the JSON text
      const parsedResponse = JSON.parse(responseText);
      setAiResponse(parsedResponse);
      setStep('results');
      
    } catch (err) {
      console.error("Failed to parse AI response:", err);
      
      let errorMessage = "An error occurred. ";
      if (err instanceof SyntaxError) {
        // This is the error you were seeing
        errorMessage += "The AI response was not in the correct format.";
      } else if (err.message) {
        errorMessage += err.message;
      }
      errorMessage += " Please try again.";
      
      setError(errorMessage);
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
        return React.createElement(IntroScreen, { onStart: handleStart });
      case 'form':
        return React.createElement(IntakeForm, { onSubmit: handleSubmit, onLoading: handleLoading });
      case 'loading':
        return React.createElement(LoadingScreen);
      case 'results':
        return React.createElement(ResultsScreen, {
          response: aiResponse,
          onReset: handleStart,
          onStartFiling: handleStartFiling,
          onShowStepDetail: handleShowStepDetail
        });
      case 'filing':
        return React.createElement(FormFilingPage, {
          form: currentForm,
          onBack: () => {
            setStep('results');
            setCurrentForm(null);
          }
        });
      default:
        return React.createElement(IntroScreen, { onStart: handleStart });
    }
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300" },
    step !== 'intro' && React.createElement('header', { className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50" },
      React.createElement('nav', { className: "max-w-7xl mx-auto p-4 flex justify-between items-center" },
        React.createElement('div', { className: "flex items-center space-x-3" },
          React.createElement('div', { className: "w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md" },
            React.createElement('span', { className: "text-2xl" }, '📋')
          ),
          React.createElement('span', { className: "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600" }, "TaxPal")
        ),
        React.createElement('button', {
          onClick: handleStart,
          className: "px-4 py-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        }, "New Plan")
      )
    ),
    React.createElement('main', null,
      renderStep(),
      error && React.createElement('div', { className: "max-w-3xl mx-auto p-4 -mt-4" },
        React.createElement('div', { className: "bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-800 dark:text-red-200 p-4 rounded-lg" },
          React.createElement('p', null,
            React.createElement('strong', { className: "font-bold" }, "Error:"), ` ${error}`
          )
        )
      )
    ),
    
    // Step Detail Modal
    currentStepDetail && React.createElement(StepDetailModal, {
      step: currentStepDetail,
      onClose: handleCloseModal
    })
  );
}

// Export for use in HTML
window.App = App;

