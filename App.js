const { useState, useEffect, useRef } = React;

// --- API Configuration ---
// We no longer need the API Key or URL here.
// All API calls will go to our secure serverless functions.
console.log("App.js loaded. API calls will be proxied. Language support enabled.");

// --- Translations ---
const translations = {
  en: {
    // Intro Screen
    heading: "TaxPal, Your Personal\nTax Filing AI Assistant",
    subtitle: "Making Tax Filing Simple & Stress-Free",
    description: "Get personalized tax guidance powered by AI. We'll help you understand what forms you need and guide you through every step.",
    aiPowered: "AI-Powered",
    quickEasy: "Quick & Easy",
    personalized: "Personalized",
    getStarted: "Get Started",
    disclaimerTitle: "Important Disclaimer",
    disclaimerText: "I am an AI assistant, not a tax professional. This is for informational purposes only. Please consult a qualified accountant or tax advisor for financial advice.",
    // Form
    tellUsAbout: "Tell us about yourself",
    formDescription: "This information will help us create your personalized tax plan.",
    createPlan: "Create My Tax Plan",
    // Form Fields
    nationality: "Nationality (Country of Citizenship)",
    nationalityPlaceholder: "e.g., USA, China, India",
    state: "What U.S. State do you live in?",
    selectState: "Select a state",
    notUSResident: "Not a U.S. Resident",
    yearsInUS: "How many years (in total) have you lived in the U.S.?",
    jobStatus: "Current Job Status",
    employed: "Employed",
    selfEmployed: "Self-Employed",
    unemployed: "Unemployed",
    retired: "Retired",
    isStudent: "Are you currently a student?",
    hasSSN: "Do you have a U.S. Social Security Number (SSN) or ITIN?",
    housingStatus: "What is your housing status?",
    rent: "Rent",
    own: "Own",
    ownsCar: "Do you own a car?",
    incomeRange: "What is your annual income range?",
    filingStatus: "What is your filing status?",
    single: "Single",
    marriedFilingJointly: "Married Filing Jointly",
    marriedFilingSeparately: "Married Filing Separately",
    headOfHousehold: "Head of Household",
    dependents: "How many dependents do you have?",
    hadJobChange: "Did you change jobs last year?",
    itemizedPreviousYear: "Did you itemize deductions last year?",
    incomeSources: "What are your income sources? (Select all that apply)",
    w2Salary: "W-2 Salary (from an employer)",
    selfEmployment: "Self-Employment / Freelance (1099-NEC/MISC)",
    stockInvestments: "Stock Investments (Dividends/Capital Gains)",
    rentalIncome: "Rental Income",
    cryptocurrency: "Cryptocurrency",
    other: "Other",
    specifics: "Any other specific details about your tax situation?",
    yes: "Yes",
    no: "No",
    // Results
    taxPlan: "Your Personalized Tax Plan",
    quickReminder: "A quick reminder:",
    taxSummary: "Your Tax Summary",
    requiredForms: "Required Forms",
    nextSteps: "Your Next Steps",
    why: "Why:",
    filingCenter: "Form Filing Center",
    filingCenterDesc: "Click on a form to get line-by-line help from our AI assistant.",
    noForms: "No specific forms were identified for you. If you think this is an error, please start over.",
    startOver: "Start over with a new plan",
    backToPlan: "Back to Tax Plan",
    newPlan: "New Plan",
    // Common
    loading: "Loading...",
    analyzing: "Analyzing Your Situation...",
    creatingPlan: "Our AI is creating your personalized tax plan"
  },
  es: {
    // Intro Screen
    heading: "TaxPal, Tu Asistente Personal\nde IA para Declaración de Impuestos",
    subtitle: "Haciendo que la Declaración de Impuestos Sea Simple y Sin Estrés",
    description: "Obtén orientación fiscal personalizada impulsada por IA. Te ayudaremos a entender qué formularios necesitas y te guiaremos en cada paso.",
    aiPowered: "Impulsado por IA",
    quickEasy: "Rápido y Fácil",
    personalized: "Personalizado",
    getStarted: "Comenzar",
    disclaimerTitle: "Descargo de Responsabilidad Importante",
    disclaimerText: "Soy un asistente de IA, no un profesional de impuestos. Esto es solo para fines informativos. Por favor, consulte a un contador o asesor fiscal calificado para obtener asesoramiento financiero.",
    // Form
    tellUsAbout: "Cuéntanos sobre ti",
    formDescription: "Esta información nos ayudará a crear tu plan fiscal personalizado.",
    createPlan: "Crear Mi Plan Fiscal",
    // Form Fields
    nationality: "Nacionalidad (País de Ciudadanía)",
    nationalityPlaceholder: "ej., USA, China, India",
    state: "¿En qué estado de EE.UU. vives?",
    selectState: "Selecciona un estado",
    notUSResident: "No soy residente de EE.UU.",
    yearsInUS: "¿Cuántos años (en total) has vivido en EE.UU.?",
    jobStatus: "Estado Laboral Actual",
    employed: "Empleado",
    selfEmployed: "Trabajador Independiente",
    unemployed: "Desempleado",
    retired: "Jubilado",
    isStudent: "¿Eres actualmente estudiante?",
    hasSSN: "¿Tienes un Número de Seguro Social (SSN) o ITIN de EE.UU.?",
    housingStatus: "¿Cuál es tu situación de vivienda?",
    rent: "Alquiler",
    own: "Propia",
    ownsCar: "¿Tienes un automóvil?",
    incomeRange: "¿Cuál es tu rango de ingresos anuales?",
    filingStatus: "¿Cuál es tu estado civil para impuestos?",
    single: "Soltero",
    marriedFilingJointly: "Casado Declarando Conjuntamente",
    marriedFilingSeparately: "Casado Declarando por Separado",
    headOfHousehold: "Jefe de Familia",
    dependents: "¿Cuántos dependientes tienes?",
    hadJobChange: "¿Cambiaste de trabajo el año pasado?",
    itemizedPreviousYear: "¿Detallaste deducciones el año pasado?",
    incomeSources: "¿Cuáles son tus fuentes de ingresos? (Selecciona todas las que apliquen)",
    w2Salary: "Salario W-2 (de un empleador)",
    selfEmployment: "Trabajo Independiente / Freelance (1099-NEC/MISC)",
    stockInvestments: "Inversiones en Acciones (Dividendos/Ganancias de Capital)",
    rentalIncome: "Ingresos por Alquiler",
    cryptocurrency: "Criptomonedas",
    other: "Otro",
    specifics: "¿Algún otro detalle específico sobre tu situación fiscal?",
    yes: "Sí",
    no: "No",
    // Results
    taxPlan: "Tu Plan Fiscal Personalizado",
    quickReminder: "Un recordatorio rápido:",
    taxSummary: "Tu Resumen Fiscal",
    requiredForms: "Formularios Requeridos",
    nextSteps: "Tus Próximos Pasos",
    why: "Por qué:",
    filingCenter: "Centro de Declaración de Formularios",
    filingCenterDesc: "Haz clic en un formulario para obtener ayuda línea por línea de nuestro asistente de IA.",
    noForms: "No se identificaron formularios específicos para ti. Si crees que esto es un error, por favor comienza de nuevo.",
    startOver: "Empezar de nuevo con un nuevo plan",
    backToPlan: "Volver al Plan Fiscal",
    newPlan: "Nuevo Plan",
    // Common
    loading: "Cargando...",
    analyzing: "Analizando Tu Situación...",
    creatingPlan: "Nuestra IA está creando tu plan fiscal personalizado"
  },
  zh: {
    // Intro Screen
    heading: "TaxPal，您的个人\n报税AI助手",
    subtitle: "让报税变得简单无忧",
    description: "获得由AI驱动的个性化税务指导。我们将帮助您了解需要哪些表格，并指导您完成每一步。",
    aiPowered: "AI驱动",
    quickEasy: "快速简便",
    personalized: "个性化",
    getStarted: "开始使用",
    disclaimerTitle: "重要免责声明",
    disclaimerText: "我是AI助手，不是税务专业人士。这仅供参考。请咨询合格的会计师或税务顾问以获得财务建议。",
    // Form
    tellUsAbout: "告诉我们关于您的信息",
    formDescription: "这些信息将帮助我们为您创建个性化的税务计划。",
    createPlan: "创建我的税务计划",
    // Form Fields
    nationality: "国籍（公民身份国家）",
    nationalityPlaceholder: "例如：美国、中国、印度",
    state: "您居住在美国哪个州？",
    selectState: "选择一个州",
    notUSResident: "非美国居民",
    yearsInUS: "您在美国总共居住了多少年？",
    jobStatus: "当前工作状态",
    employed: "受雇",
    selfEmployed: "自雇",
    unemployed: "失业",
    retired: "退休",
    isStudent: "您目前是学生吗？",
    hasSSN: "您有美国社会安全号码（SSN）或ITIN吗？",
    housingStatus: "您的住房状况是什么？",
    rent: "租房",
    own: "自有",
    ownsCar: "您有车吗？",
    incomeRange: "您的年收入范围是多少？",
    filingStatus: "您的报税身份是什么？",
    single: "单身",
    marriedFilingJointly: "已婚联合报税",
    marriedFilingSeparately: "已婚分别报税",
    headOfHousehold: "户主",
    dependents: "您有多少个受抚养人？",
    hadJobChange: "您去年换工作了吗？",
    itemizedPreviousYear: "您去年是否逐项扣除？",
    incomeSources: "您的收入来源是什么？（选择所有适用的）",
    w2Salary: "W-2工资（来自雇主）",
    selfEmployment: "自雇/自由职业（1099-NEC/MISC）",
    stockInvestments: "股票投资（股息/资本收益）",
    rentalIncome: "租金收入",
    cryptocurrency: "加密货币",
    other: "其他",
    specifics: "关于您的税务情况还有其他具体细节吗？",
    yes: "是",
    no: "否",
    // Results
    taxPlan: "您的个性化税务计划",
    quickReminder: "快速提醒：",
    taxSummary: "您的税务摘要",
    requiredForms: "所需表格",
    nextSteps: "您的下一步",
    why: "原因：",
    filingCenter: "表格填报中心",
    filingCenterDesc: "点击表格以获取我们AI助手的逐行帮助。",
    noForms: "未为您识别出特定表格。如果您认为这是错误，请重新开始。",
    startOver: "重新开始新计划",
    backToPlan: "返回税务计划",
    newPlan: "新计划",
    // Common
    loading: "加载中...",
    analyzing: "分析您的情况...",
    creatingPlan: "我们的AI正在创建您的个性化税务计划"
  }
};

// --- Language Selector Component ---
const LanguageSelector = ({ onLanguageSelect }) => React.createElement('div', { 
  className: "min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-white to-blue-50"
},
  React.createElement('div', { className: "max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center" },
    React.createElement('div', { className: "w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mb-6" },
      React.createElement('span', { className: "text-4xl" }, '🌐')
    ),
    React.createElement('h1', { className: "text-3xl font-bold text-slate-900 mb-3" }, "Choose Your Language"),
    React.createElement('h2', { className: "text-xl font-bold text-blue-600 mb-8" }, "Selecciona tu idioma"),
    React.createElement('h3', { className: "text-xl font-bold text-blue-600 mb-8" }, "选择您的语言"),
    React.createElement('div', { className: "space-y-4" },
      React.createElement('button', {
        onClick: () => onLanguageSelect('en'),
        className: "w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
      },
        React.createElement('span', { className: "text-2xl mr-3" }, '🇺🇸'),
        "English"
      ),
      React.createElement('button', {
        onClick: () => onLanguageSelect('es'),
        className: "w-full py-4 px-6 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
      },
        React.createElement('span', { className: "text-2xl mr-3" }, '🇪🇸'),
        "Español"
      ),
      React.createElement('button', {
        onClick: () => onLanguageSelect('zh'),
        className: "w-full py-4 px-6 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-lg shadow-lg transition-transform transform hover:scale-105 flex items-center justify-center"
      },
        React.createElement('span', { className: "text-2xl mr-3" }, '🇨🇳'),
        "中文"
      )
    )
  )
);


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
 * @param {string|null} pdfBase64 - Optional base64 encoded PDF file.
 * @returns {Promise<string>} - The text part of the AI's response.
 */
const fetchChatReply = async (userQuery, history, pdfBase64 = null, language = 'en') => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuery, history, pdfBase64, language })
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
const IntroScreen = ({ onStart, t }) => {
  const headingLines = t.heading.split('\n');
  return React.createElement('div', { className: "min-h-screen flex items-center justify-center p-8 relative overflow-hidden" },
  // Animated background - using calm, trustworthy colors
  React.createElement('div', { className: "absolute inset-0 gradient-bg opacity-10" }),
  React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" }),
  
  // Floating decorative elements - softer, more professional
  React.createElement('div', { className: "absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" }),
  React.createElement('div', { className: "absolute bottom-20 right-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float", style: { animationDelay: '2s' } }),
  
  // Main content
  React.createElement('div', { className: "relative z-10 text-center max-w-4xl mx-auto animate-fadeIn" },
    // Logo/Icon with animation - using trustworthy blue
    React.createElement('div', { className: "mb-8 relative inline-block" },
      React.createElement('div', { className: "w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-6 hover:rotate-12 transition-transform duration-300" },
        React.createElement('span', { className: "text-5xl" }, '📋')
      )
    ),
    
    // Heading with gradient text - softer, more professional
    React.createElement('h1', { className: "text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700 leading-tight" },
      headingLines[0],
      React.createElement('br', null),
      headingLines[1]
    ),
    
    // Subtitle - larger, more accessible font
    React.createElement('p', { className: "text-2xl md:text-3xl text-slate-600 mb-4 font-medium" },
      t.subtitle
    ),
    React.createElement('p', { className: "text-xl text-slate-500 mb-8 max-w-2xl mx-auto leading-relaxed" },
      t.description
    ),
    
          // Feature highlights - using blue theme
    React.createElement('div', { className: "flex flex-wrap justify-center gap-4 mb-10" },
      React.createElement('div', { className: "flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-blue-100" },
        React.createElement('span', { className: "text-xl mr-2" }, '🤖'),
        React.createElement('span', { className: "text-base font-medium text-slate-700" }, t.aiPowered)
      ),
      React.createElement('div', { className: "flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-blue-100" },
        React.createElement('span', { className: "text-xl mr-2" }, '⚡'),
        React.createElement('span', { className: "text-base font-medium text-slate-700" }, t.quickEasy)
      ),
      React.createElement('div', { className: "flex items-center bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-blue-100" },
        React.createElement('span', { className: "text-xl mr-2" }, '🎯'),
        React.createElement('span', { className: "text-base font-medium text-slate-700" }, t.personalized)
      )
    ),
    
    // CTA Button - using friendly green for "go" action
    React.createElement('button', {
      onClick: onStart,
      className: "group relative bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-5 px-14 rounded-2xl text-xl shadow-2xl shadow-green-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-green-600/60 flex items-center justify-center mx-auto mb-8"
    },
      t.getStarted,
      React.createElement('svg', { className: "ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 7l5 5m0 0l-5 5m5-5H6" })
      )
    ),
    
    // Disclaimer - using soft yellow as specified
    React.createElement('div', { className: "bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto" },
      React.createElement('div', { className: "flex items-start" },
        React.createElement('div', { className: "w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0 mr-4 mt-1" },
          React.createElement('span', { className: "text-white text-xl" }, '⚠️')
        ),
        React.createElement('div', null,
          React.createElement('h3', { className: "font-bold text-yellow-900 mb-2 text-lg" }, t.disclaimerTitle),
          React.createElement('p', { className: "text-base text-yellow-800 leading-relaxed" },
            t.disclaimerText
          )
        )
      )
    )
    )
  );
};

/**
 * Step 2: Intake Form
 */
const IntakeForm = ({ onSubmit, onLoading, t }) => {
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
    incomeRange: '',
    filingStatus: 'Single',
    dependents: '0',
    hadJobChange: 'No',
    itemizedPreviousYear: 'No',
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
    t.w2Salary,
    t.selfEmployment,
    t.stockInvestments,
    t.rentalIncome,
    t.cryptocurrency,
    t.other
  ];

  return React.createElement('div', { className: "max-w-3xl mx-auto p-4 md:p-8" },
    React.createElement('h2', { className: "text-4xl font-bold text-slate-900 dark:text-white mb-6" },
      t.tellUsAbout
    ),
    React.createElement('p', { className: "text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed" },
      t.formDescription
    ),
    React.createElement('form', { onSubmit: handleSubmit, className: "space-y-6" },
      // Personal Info Grid
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement(FormInput, {
          label: t.nationality,
          name: "nationality",
          value: formData.nationality,
          onChange: handleChange,
          icon: "👤",
          placeholder: t.nationalityPlaceholder,
          required: true
        }),
        React.createElement(FormSelect, {
          label: t.state,
          name: "state",
          value: formData.state,
          onChange: handleChange,
          icon: "📍",
          required: true
        },
          React.createElement('option', { value: "" }, t.selectState),
          usStates.map(state => React.createElement('option', { key: state, value: state }, state)),
          React.createElement('option', { value: "N/A" }, t.notUSResident)
        )
      ),

      // Conditional Nationality Input
      formData.nationality && formData.nationality.toLowerCase() !== 'usa' && formData.nationality.toLowerCase() !== 'us' && 
      React.createElement(FormInput, {
        label: t.yearsInUS,
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
          label: t.jobStatus,
          name: "jobStatus",
          value: formData.jobStatus,
          onChange: handleChange,
          icon: "💼"
        },
          React.createElement('option', null, t.employed),
          React.createElement('option', null, t.selfEmployed),
          React.createElement('option', null, t.unemployed),
          React.createElement('option', null, t.retired)
        ),
        
        React.createElement(FormRadio, {
          label: t.isStudent,
          name: "isStudent",
          value: formData.isStudent,
          onChange: handleChange,
          icon: "🎓",
          options: [t.yes, t.no]
        })
      ),

      // SSN Radio
      React.createElement(FormRadio, {
        label: t.hasSSN,
        name: "hasSSN",
        value: formData.hasSSN,
        onChange: handleChange,
        icon: "👤",
        options: [t.yes, t.no]
      }),

      // Assets Grid
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement(FormRadio, {
          label: t.housingStatus,
          name: "housingStatus",
          value: formData.housingStatus,
          onChange: handleChange,
          icon: "🏠",
          options: [t.rent, t.own]
        }),
        React.createElement(FormRadio, {
          label: t.ownsCar,
          name: "ownsCar",
          value: formData.ownsCar,
          onChange: handleChange,
          icon: "🚗",
          options: [t.yes, t.no]
        })
      ),

      // Income Range
      React.createElement(FormSelect, {
        label: t.incomeRange,
        name: "incomeRange",
        value: formData.incomeRange,
        onChange: handleChange,
        icon: "💰",
        required: true
      },
        React.createElement('option', { value: "" }, "Select income range"),
        React.createElement('option', { value: "Under $12,000" }, "Under $12,000"),
        React.createElement('option', { value: "$12,000 - $24,999" }, "$12,000 - $24,999"),
        React.createElement('option', { value: "$25,000 - $49,999" }, "$25,000 - $49,999"),
        React.createElement('option', { value: "$50,000 - $99,999" }, "$50,000 - $99,999"),
        React.createElement('option', { value: "$100,000 - $200,000" }, "$100,000 - $200,000"),
        React.createElement('option', { value: "Over $200,000" }, "Over $200,000")
      ),

      // Filing Status
      React.createElement(FormSelect, {
        label: t.filingStatus,
        name: "filingStatus",
        value: formData.filingStatus,
        onChange: handleChange,
        icon: "👫"
      },
        React.createElement('option', { value: "Single" }, t.single),
        React.createElement('option', { value: "Married Filing Jointly" }, t.marriedFilingJointly),
        React.createElement('option', { value: "Married Filing Separately" }, t.marriedFilingSeparately),
        React.createElement('option', { value: "Head of Household" }, t.headOfHousehold),
        React.createElement('option', { value: "Qualifying Widow(er)" }, "Qualifying Widow(er)")
      ),

      // Dependents Grid
      React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
        React.createElement(FormSelect, {
          label: t.dependents,
          name: "dependents",
          value: formData.dependents,
          onChange: handleChange,
          icon: "👶"
        },
          React.createElement('option', { value: "0" }, "0"),
          React.createElement('option', { value: "1" }, "1"),
          React.createElement('option', { value: "2" }, "2"),
          React.createElement('option', { value: "3" }, "3"),
          React.createElement('option', { value: "4" }, "4"),
          React.createElement('option', { value: "5+" }, "5 or more")
        ),
        
        React.createElement(FormRadio, {
          label: t.hadJobChange,
          name: "hadJobChange",
          value: formData.hadJobChange,
          onChange: handleChange,
          icon: "💼",
          options: [t.yes, t.no]
        })
      ),

      // Itemized Deduction Question
      React.createElement(FormRadio, {
        label: t.itemizedPreviousYear,
        name: "itemizedPreviousYear",
        value: formData.itemizedPreviousYear,
        onChange: handleChange,
        icon: "📝",
        options: [t.yes, t.no, "Don't remember"]
      }),

      // Income Sources
      React.createElement(FormCheckboxGroup, {
        label: t.incomeSources,
        icon: "💰",
        options: incomeOptions,
        selected: formData.incomeSources,
        onChange: handleCheckboxChange
      }),

      // Specifics Text Area
      React.createElement(FormTextArea, {
        label: t.specifics,
        name: "specifics",
        value: formData.specifics,
        onChange: handleChange,
        icon: "❓",
        placeholder: "Example: I'm an international student from China with no SSN, but I invested in U.S. stocks."
      }),

      // Submit Button - using green for "go" action
      React.createElement('div', { className: "pt-4 text-right" },
        React.createElement('button', {
          type: "submit",
          className: "bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-xl text-xl shadow-lg transition-transform transform hover:scale-105 flex items-center justify-end ml-auto"
        },
          t.createPlan,
          React.createElement('span', { className: "w-6 h-6 ml-3" }, '✨')
        )
      )
    )
  );
};

// --- Form Helper Components ---
const FormInput = ({ label, name, value, onChange, icon, ...props }) => React.createElement('div', null,
  React.createElement('label', { htmlFor: name, className: "flex items-center text-base font-semibold text-slate-700 dark:text-slate-300 mb-3" },
    icon && React.createElement('span', { className: "text-xl mr-3" }, icon),
    label
  ),
  React.createElement('input', {
    id: name,
    name: name,
    value: value,
    onChange: onChange,
    className: "w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-lg",
    ...props
  })
);

const FormSelect = ({ label, name, value, onChange, icon, children, ...props }) => React.createElement('div', null,
  React.createElement('label', { htmlFor: name, className: "flex items-center text-base font-semibold text-slate-700 dark:text-slate-300 mb-3" },
    icon && React.createElement('span', { className: "text-xl mr-3" }, icon),
    label
  ),
  React.createElement('select', {
    id: name,
    name: name,
    value: value,
    onChange: onChange,
    className: "w-full p-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md appearance-none cursor-pointer text-lg",
    ...props
  }, children)
);

const FormRadio = ({ label, name, value, onChange, icon, options }) => React.createElement('div', null,
  React.createElement('label', { className: "flex items-center text-base font-semibold text-slate-700 dark:text-slate-300 mb-3" },
    icon && React.createElement('span', { className: "text-xl mr-3" }, icon),
    label
  ),
  React.createElement('div', { className: "flex space-x-6 mt-3" },
    options.map(option => React.createElement('label', { key: option, className: "flex items-center cursor-pointer" },
      React.createElement('input', {
        type: "radio",
        name: name,
        value: option,
        checked: value === option,
        onChange: onChange,
        className: "h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600"
      }),
      React.createElement('span', { className: "ml-3 text-lg text-slate-800 dark:text-slate-200" }, option)
    ))
  )
);

const FormCheckboxGroup = ({ label, icon, options, selected, onChange }) => React.createElement('div', null,
  React.createElement('label', { className: "flex items-center text-base font-semibold text-slate-700 dark:text-slate-300 mb-3" },
    icon && React.createElement('span', { className: "text-xl mr-3" }, icon),
    label
  ),
  React.createElement('div', { className: "grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3" },
    options.map(option => React.createElement('label', { key: option, className: "flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer" },
      React.createElement('input', {
        type: "checkbox",
        value: option,
        checked: selected.includes(option),
        onChange: onChange,
        className: "h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-600 rounded"
      }),
      React.createElement('span', { className: "ml-3 text-lg text-slate-800 dark:text-slate-200" }, option)
    ))
  )
);

const FormTextArea = ({ label, name, value, onChange, icon, ...props }) => React.createElement('div', null,
  React.createElement('label', { htmlFor: name, className: "flex items-center text-base font-semibold text-slate-700 dark:text-slate-300 mb-3" },
    icon && React.createElement('span', { className: "text-xl mr-3" }, icon),
    label
  ),
  React.createElement('textarea', {
    id: name,
    name: name,
    value: value,
    onChange: onChange,
    rows: "4",
    className: "w-full p-4 bg-slate-50 dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg",
    ...props
  })
);

/**
 * Step 3: Loading Screen
 */
const LoadingScreen = ({ t }) => React.createElement('div', { className: "flex flex-col items-center justify-center min-h-screen p-20 text-center relative overflow-hidden" },
  // Animated background - using calm colors
  React.createElement('div', { className: "absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" }),
  React.createElement('div', { className: "absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" }),
  
  // Content
  React.createElement('div', { className: "relative z-10" },
    // Animated icon - using blue theme
    React.createElement('div', { className: "mb-8 relative" },
      React.createElement('div', { className: "w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce" },
        React.createElement('svg', { className: "w-12 h-12 text-white animate-spin", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" })
        )
      )
    ),
    React.createElement('h2', { className: "text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700 mt-6 mb-4" },
      t.analyzing
    ),
    React.createElement('p', { className: "text-2xl text-slate-600 mb-8" },
      t.creatingPlan
    ),
    // Loading dots - using blue theme
    React.createElement('div', { className: "flex justify-center gap-3" },
      React.createElement('div', { className: "w-4 h-4 bg-blue-500 rounded-full animate-bounce", style: { animationDelay: '0s' } }),
      React.createElement('div', { className: "w-4 h-4 bg-blue-600 rounded-full animate-bounce", style: { animationDelay: '0.2s' } }),
      React.createElement('div', { className: "w-4 h-4 bg-blue-700 rounded-full animate-bounce", style: { animationDelay: '0.4s' } })
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
const FormFilingPage = ({ form, onBack, language }) => {
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
      // If PDF is uploaded, convert it to base64 and send it
      let pdfBase64 = null;
      if (pdfFile) {
        pdfBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result.split(',')[1];
            resolve(base64String);
          };
          reader.readAsDataURL(pdfFile);
        });
      }
      
      // Call our new secure chat function with PDF data
      const aiResponseText = await fetchChatReply(userInput, apiHistory, pdfBase64, language);
      
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
  
  // Use Google search for IRS forms since the direct IRS form search is unreliable
  const formSearchUrl = `https://www.google.com/search?q=IRS+${encodeURIComponent(form.formId)}+form+${encodeURIComponent(form.formTitle)}`;

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
        React.createElement('div', { className: "flex items-center justify-between mb-4" },
          React.createElement('h3', { className: "flex items-center text-xl font-semibold text-slate-900 dark:text-white" },
            React.createElement('span', { className: "w-6 h-6 mr-3 text-purple-500" }, '❓'),
            "Form Assistant"
          ),
          pdfFile && React.createElement('div', { className: "flex items-center text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full" },
            React.createElement('span', { className: "mr-1" }, '👁️'),
            "Can see PDF"
          )
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
const ResultsScreen = ({ response, onReset, onStartFiling, onShowStepDetail, t }) => {
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
    React.createElement('h2', { className: "text-4xl font-bold text-slate-900 dark:text-white" },
      t.taxPlan
    ),
    
    // Disclaimer - using soft yellow
    React.createElement('div', { className: "p-6 bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-400 rounded-xl text-yellow-800 dark:text-yellow-200" },
      React.createElement('div', { className: "flex" },
        React.createElement('div', { className: "w-6 h-6 mr-3 flex-shrink-0" }, '⚠️'),
        React.createElement('p', { className: "text-lg" },
          React.createElement('strong', { className: "font-bold" }, t.quickReminder), ` ${disclaimer.replace('Please remember, ', '')}`
        )
      )
    ),
    
    // Summary
    React.createElement('div', { className: "bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg" },
      React.createElement('h3', { className: "text-2xl font-semibold text-slate-900 dark:text-white mb-4" },
        t.taxSummary
      ),
      React.createElement('p', { className: "text-lg text-slate-700 dark:text-slate-300 leading-relaxed" },
        analysisSummary
      )
    ),

    React.createElement('div', { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" },
      // Required Forms
      React.createElement('div', { className: "bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg" },
        React.createElement('h3', { className: "flex items-center text-2xl font-semibold text-slate-900 dark:text-white mb-6" },
          React.createElement('span', { className: "w-7 h-7 mr-3 text-blue-500" }, '📄'),
          t.requiredForms
        ),
        React.createElement('ul', { className: "space-y-5" },
          requiredForms.length > 0 ? 
            requiredForms.map(form => React.createElement('li', { key: form.formId, className: "p-5 bg-slate-50 dark:bg-slate-700 rounded-xl" },
              React.createElement('p', { className: "text-lg font-bold text-slate-800 dark:text-slate-100" },
                `${form.formId}: ${form.formTitle}`
              ),
              React.createElement('p', { className: "text-base text-slate-600 dark:text-slate-300 mt-2" },
                React.createElement('strong', { className: "text-slate-700 dark:text-slate-200" }, t.why), ` ${form.reason}`
              )
            )) :
            React.createElement('p', { className: "text-lg text-slate-600 dark:text-slate-300" },
              "Based on your answers, it looks like you may not need to file. Let's talk more in the chat!"
            )
        )
      ),
      
      // Next Steps
      React.createElement('div', { className: "bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg" },
        React.createElement('h3', { className: "flex items-center text-2xl font-semibold text-slate-900 dark:text-white mb-6" },
          React.createElement('span', { className: "w-7 h-7 mr-3 text-green-500" }, '✅'),
          t.nextSteps
        ),
        React.createElement('div', { className: "space-y-4" },
          nextSteps.map((step, index) => React.createElement('button', {
            key: index,
            onClick: () => onShowStepDetail(step),
            className: "w-full text-left p-5 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          },
            React.createElement('div', { className: "flex items-center" },
              React.createElement('div', { className: "flex-shrink-0 w-7 h-7 bg-green-500 text-white rounded-full flex items-center justify-center text-base font-bold mr-4" },
                index + 1
              ),
              React.createElement('span', { className: "flex-1 text-lg text-slate-800 dark:text-slate-100 font-medium" },
                step.stepTitle
              ),
              React.createElement('span', { className: "w-6 h-6 text-slate-400 dark:text-slate-500" }, '→')
            )
          ))
        )
      )
    ),
    
    // 2. The Form Filing Center
    React.createElement('div', { className: "bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg mt-10" },
      React.createElement('h3', { className: "flex items-center text-3xl font-semibold text-slate-900 dark:text-white mb-6" },
        React.createElement('span', { className: "w-8 h-8 mr-3 text-blue-500" }, '📄'),
        t.filingCenter
      ),
      React.createElement('p', { className: "text-xl text-slate-600 dark:text-slate-300 mb-8" },
        t.filingCenterDesc
      ),
      
      requiredForms.length > 0 ? 
        React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-6" },
          requiredForms.map(form => React.createElement('button', {
            key: form.formId,
            onClick: () => onStartFiling(form),
            className: "p-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
          },
            React.createElement('p', { className: "text-2xl font-bold mb-2" }, form.formId),
            React.createElement('p', { className: "text-base font-light" }, form.formTitle)
          ))
        ) :
        React.createElement('p', { className: "text-lg text-slate-600 dark:text-slate-300 text-center p-6 bg-slate-50 dark:bg-slate-700 rounded-xl" },
          t.noForms
        )
    ),

    // Reset Button
    React.createElement('div', { className: "text-center pt-6" },
      React.createElement('button', {
        onClick: onReset,
        className: "text-lg text-slate-500 dark:text-slate-400 hover:underline hover:text-slate-700 dark:hover:text-slate-200"
      }, t.startOver)
    )
  );
};


/**
 * Main App Component
 */
function App() {
  const [language, setLanguage] = useState(null); // null = language selection screen
  const [step, setStep] = useState('intro'); // 'intro', 'form', 'loading', 'results', 'filing'
  const [formData, setFormData] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [currentForm, setCurrentForm] = useState(null); // For the filing page
  const [currentStepDetail, setCurrentStepDetail] = useState(null); // For the modal

  // Get translations for current language
  const t = translations[language || 'en'];

  // Show language selector if language not selected
  if (!language) {
    return React.createElement(LanguageSelector, { onLanguageSelect: setLanguage });
  }

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
- Filing Status: ${data.filingStatus}
- Annual Income: ${data.incomeRange}
- Number of Dependents: ${data.dependents}
- Job Status: ${data.jobStatus}
- Changed Jobs Last Year: ${data.hadJobChange}
- Has SSN/ITIN: ${data.hasSSN}
- Is a student: ${data.isStudent}
- Itemized Deductions Last Year: ${data.itemizedPreviousYear}
- Housing Status: ${data.housingStatus}
- Owns a car: ${data.ownsCar}
- Income Sources: ${data.incomeSources.join(', ') || 'None listed'}
- Other details: ${data.specifics || 'None'}`;
    
    try {
      // 1. Call our new secure Netlify Function
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery, language })
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
        return React.createElement(IntroScreen, { onStart: handleStart, t: t });
      case 'form':
        return React.createElement(IntakeForm, { onSubmit: handleSubmit, onLoading: handleLoading, t: t });
      case 'loading':
        return React.createElement(LoadingScreen, { t: t });
      case 'results':
        return React.createElement(ResultsScreen, {
          response: aiResponse,
          onReset: handleStart,
          onStartFiling: handleStartFiling,
          onShowStepDetail: handleShowStepDetail,
          t: t
        });
      case 'filing':
        return React.createElement(FormFilingPage, {
          form: currentForm,
          onBack: () => {
            setStep('results');
            setCurrentForm(null);
          },
          language: language
        });
      default:
        return React.createElement(IntroScreen, { onStart: handleStart, t: t });
    }
  };

  return React.createElement('div', { className: "min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300" },
    step !== 'intro' && React.createElement('header', { className: "bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg shadow-lg border-b border-slate-200/50 dark:border-slate-700/50 sticky top-0 z-50" },
      React.createElement('nav', { className: "max-w-7xl mx-auto p-6 flex justify-between items-center" },
        React.createElement('div', { className: "flex items-center space-x-4" },
          React.createElement('div', { className: "w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md" },
            React.createElement('span', { className: "text-3xl" }, '📋')
          ),
          React.createElement('span', { className: "text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-700" }, "TaxPal")
        ),
        React.createElement('div', { className: "flex items-center space-x-4" },
          React.createElement('select', {
            value: language,
            onChange: (e) => setLanguage(e.target.value),
            className: "px-4 py-2 text-base font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          },
            React.createElement('option', { value: "en" }, "🇺🇸 English"),
            React.createElement('option', { value: "es" }, "🇪🇸 Español"),
            React.createElement('option', { value: "zh" }, "🇨🇳 中文")
          ),
          React.createElement('button', {
            onClick: handleStart,
            className: "px-6 py-3 text-lg font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-colors"
          }, t.newPlan)
        )
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

