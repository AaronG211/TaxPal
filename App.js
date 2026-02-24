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
    hasCrypto: "Did you transact in Digital Assets or Cryptocurrency?",
    hasRetirement: "Did you contribute to a Retirement Account (IRA, 401(k), etc.)?",
    hasMarketplaceHealth: "Did you have Health Insurance through the ACA Marketplace?",
    hasStudentLoans: "Did you pay Student Loan Interest or Tuition expenses?",
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
    creatingPlan: "Our AI is creating your personalized tax plan",
    // New Localizations
    smartIntake: "Smart Intake",
    profileComplete: "Profile {percent}% complete",
    draftSaved: "Draft saved {time}",
    useSampleProfile: "Use sample profile",
    clearSavedDraft: "Clear saved draft",
    profileSection: "Profile",
    statusSection: "Status",
    incomeDeductionsSection: "Income & Deductions",
    additionalTaxSituations: "Additional Tax Situations",
    errorPleaseComplete: "Please complete: {missing}",
    selectIncomeRange: "Select income range",
    dontRemember: "Don't remember",
    fiveOrMore: "5 or more",
    backToTaxPlan: "Back to Tax Plan",
    formPreview: "Form Preview",
    replacePdf: "Replace PDF",
    uploadPdf: "Upload PDF",
    remove: "Remove",
    dragPdfDesc: "Drag in your form PDF or use upload. The assistant can read it while answering.",
    dropPdfHere: "Drop your PDF here",
    dragAndDropPdf: "Drag and drop your PDF here",
    chooseFile: "Choose file",
    findFormOnIRS: "Find {formId} on IRS.gov",
    loadingPdfEngine: "Loading PDF engine",
    prev: "Prev",
    next: "Next",
    formAssistant: "Form Assistant",
    copyTranscript: "Copy transcript",
    send: "Send",
    askAbout: "Ask about {formId}...",
    copySummary: "Copy summary",
    downloadTxt: "Download TXT",
    downloadJson: "Download JSON",
    planCopied: "Plan copied",
    copyFailed: "Copy failed",
    documentChecklist: "Document Checklist",
    potentialWatchOuts: "Potential Watch-outs",
    noRiskAlerts: "No risk alerts were returned for this plan.",
    recentPlans: "Recent Plans",
    savedCount: "{count} saved",
    open: "Open",
    deletePlan: "Delete",
    noSavedPlans: "No saved plans yet. Generate your first plan and it will appear here.",
    oopsSomethingWentWrong: "Oops! Something went wrong.",
    couldNotGeneratePlan: "We couldn't generate your tax plan.",
    tryAgain: "Try Again",
    viewDetails: "View details",
    taxPlanner: "Tax planner",
    buildingRecommendations: "Building personalized recommendations",
    close: "Close",
    gotIt: "Got it",
    errorTitle: "Error: "
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
    hasCrypto: "¿Realizó transacciones con activos digitales o criptomonedas?",
    hasRetirement: "¿Contribuyó a una cuenta de jubilación (IRA, 401(k), etc.)?",
    hasMarketplaceHealth: "¿Tuvo seguro médico a través del Mercado de la ACA?",
    hasStudentLoans: "¿Pagó intereses de préstamos estudiantiles o gastos de matrícula?",
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
    creatingPlan: "Nuestra IA está creando tu plan fiscal personalizado",
    // New Localizations
    smartIntake: "Admisión Inteligente",
    profileComplete: "Perfil {percent}% completo",
    draftSaved: "Borrador guardado {time}",
    useSampleProfile: "Usar perfil de ejemplo",
    clearSavedDraft: "Borrar borrador guardado",
    profileSection: "Perfil",
    statusSection: "Estado",
    incomeDeductionsSection: "Ingresos y Deducciones",
    additionalTaxSituations: "Situaciones Fiscales Adicionales",
    errorPleaseComplete: "Por favor complete: {missing}",
    selectIncomeRange: "Seleccione el rango de ingresos",
    dontRemember: "No lo recuerdo",
    fiveOrMore: "5 o más",
    backToTaxPlan: "Volver al Plan Fiscal",
    formPreview: "Vista Previa del Formulario",
    replacePdf: "Reemplazar PDF",
    uploadPdf: "Subir PDF",
    remove: "Eliminar",
    dragPdfDesc: "Arrastre el PDF de su formulario o use subir. El asistente puede leerlo mientras responde.",
    dropPdfHere: "Suelta tu PDF aquí",
    dragAndDropPdf: "Arrastre y suelte su PDF aquí",
    chooseFile: "Elegir archivo",
    findFormOnIRS: "Encuentre {formId} en IRS.gov",
    loadingPdfEngine: "Cargando motor PDF",
    prev: "Anterior",
    next: "Siguiente",
    formAssistant: "Asistente de Formulario",
    copyTranscript: "Copiar transcripción",
    send: "Enviar",
    askAbout: "Preguntar sobre {formId}...",
    copySummary: "Copiar resumen",
    downloadTxt: "Descargar TXT",
    downloadJson: "Descargar JSON",
    planCopied: "Plan copiado",
    copyFailed: "Error al copiar",
    documentChecklist: "Lista de Verificación de Documentos",
    potentialWatchOuts: "Posibles Advertencias",
    noRiskAlerts: "No se encontraron advertencias de riesgo para este plan.",
    recentPlans: "Planes Recientes",
    savedCount: "{count} guardados",
    open: "Abrir",
    deletePlan: "Eliminar",
    noSavedPlans: "Aún no hay planes guardados. Genere su primer plan y aparecerá aquí.",
    oopsSomethingWentWrong: "¡Ups! Algo salió mal.",
    couldNotGeneratePlan: "No pudimos generar su plan fiscal.",
    tryAgain: "Intentar de Nuevo",
    viewDetails: "Ver detalles",
    taxPlanner: "Planificador de impuestos",
    buildingRecommendations: "Construyendo recomendaciones personalizadas",
    close: "Cerrar",
    gotIt: "Entendido",
    errorTitle: "Error: "
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
    hasCrypto: "您是否交易过数字资产或加密货币？",
    hasRetirement: "您是否向退休账户（IRA、401(k)等）缴纳过款项？",
    hasMarketplaceHealth: "您是否通过ACA（奥巴马医保）市场购买了健康保险？",
    hasStudentLoans: "您是否支付过学生贷款利息或学费？",
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
    creatingPlan: "我们的AI正在创建您的个性化税务计划",
    // New Localizations
    smartIntake: "智能信息采集",
    profileComplete: "个人资料完成 {percent}%",
    draftSaved: "草稿已保存 {time}",
    useSampleProfile: "使用示例资料",
    clearSavedDraft: "清除已保存的草稿",
    profileSection: "个人资料",
    statusSection: "状态",
    incomeDeductionsSection: "收入和扣除额",
    additionalTaxSituations: "其他税务情况",
    errorPleaseComplete: "请填写：{missing}",
    selectIncomeRange: "选择收入范围",
    dontRemember: "不记得了",
    fiveOrMore: "5个或更多",
    backToTaxPlan: "返回税务计划",
    formPreview: "表格预览",
    replacePdf: "替换PDF",
    uploadPdf: "上传PDF",
    remove: "移除",
    dragPdfDesc: "将您的表格PDF拖入此处或点击上传。助手在回答时能读取该文件。",
    dropPdfHere: "将PDF拖放到此处",
    dragAndDropPdf: "将PDF拖放到此处",
    chooseFile: "选择文件",
    findFormOnIRS: "在IRS.gov寻找 {formId}",
    loadingPdfEngine: "加载PDF引擎中",
    prev: "上一步",
    next: "下一步",
    formAssistant: "表格助手",
    copyTranscript: "复制聊天记录",
    send: "发送",
    askAbout: "询问关于 {formId}...",
    copySummary: "复制摘要",
    downloadTxt: "下载 TXT",
    downloadJson: "下载 JSON",
    planCopied: "计划已复制",
    copyFailed: "复制失败",
    documentChecklist: "文件清单",
    potentialWatchOuts: "潜在注意事项",
    noRiskAlerts: "未发现任何税务风险警告。",
    recentPlans: "最近的计划",
    savedCount: "{count} 已保存",
    open: "打开",
    deletePlan: "删除",
    noSavedPlans: "尚未保存任何计划。生成您的首个计划后即可在此查看。",
    oopsSomethingWentWrong: "哎呀！出了点问题。",
    couldNotGeneratePlan: "我们无法生成您的税务计划。",
    tryAgain: "重试",
    viewDetails: "查看详情",
    taxPlanner: "税务规划师",
    buildingRecommendations: "生成个性化建议中",
    close: "关闭",
    gotIt: "明白了",
    errorTitle: "错误： "
  }
};

const h = React.createElement;

const cn = (...classes) => classes.filter(Boolean).join(' ');

const APP_STYLES = {
  panel: "rounded-3xl border border-slate-200 bg-white shadow-[0_20px_45px_-30px_rgba(15,23,42,0.35)]",
  section: "rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_14px_32px_-24px_rgba(15,23,42,0.28)] sm:p-8",
  control: "mt-2 w-full rounded-2xl border border-slate-300/90 bg-white px-4 py-3 text-[15px] text-slate-800 placeholder:text-slate-400 shadow-sm transition-all duration-200 focus:border-tide-600 focus:outline-none focus:ring-4 focus:ring-tide-100",
  label: "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500"
};

const DEFAULT_FORM_DATA = {
  nationality: '',
  state: '',
  yearsInUS: '',
  jobStatus: 'employed',
  isStudent: 'no',
  hasSSN: 'yes',
  housingStatus: 'rent',
  ownsCar: 'no',
  incomeRange: '',
  filingStatus: 'single',
  dependents: '0',
  hadJobChange: 'no',
  itemizedPreviousYear: 'no',
  hasCrypto: 'no',
  hasRetirement: 'no',
  hasMarketplaceHealth: 'no',
  hasStudentLoans: 'no',
  incomeSources: [],
  specifics: ''
};

const PROMPT_LABELS = {
  jobStatus: {
    employed: 'Employed',
    selfEmployed: 'Self-Employed',
    unemployed: 'Unemployed',
    retired: 'Retired'
  },
  yesNo: {
    yes: 'Yes',
    no: 'No'
  },
  housingStatus: {
    rent: 'Rent',
    own: 'Own'
  },
  filingStatus: {
    single: 'Single',
    marriedJointly: 'Married Filing Jointly',
    marriedSeparately: 'Married Filing Separately',
    headOfHousehold: 'Head of Household',
    qualifyingWidow: 'Qualifying Widow(er)'
  },
  itemizedPreviousYear: {
    yes: 'Yes',
    no: 'No',
    notSure: "Don't remember"
  },
  incomeSources: {
    w2Salary: 'W-2 Salary (from an employer)',
    selfEmployment: 'Self-Employment / Freelance (1099-NEC/MISC)',
    stockInvestments: 'Stock Investments (Dividends/Capital Gains)',
    rentalIncome: 'Rental Income',
    cryptocurrency: 'Cryptocurrency',
    other: 'Other'
  }
};

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA',
  'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK',
  'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

const INCOME_RANGES = [
  'Under $12,000',
  '$12,000 - $24,999',
  '$25,000 - $49,999',
  '$50,000 - $99,999',
  '$100,000 - $200,000',
  'Over $200,000'
];

const STORAGE_KEYS = {
  language: 'taxpal.language.v1',
  formDraft: 'taxpal.formDraft.v1',
  planHistory: 'taxpal.planHistory.v1',
  checklistPrefix: 'taxpal.checklist.v1',
  documentHubPrefix: 'taxpal.documents.v1',
  formProgressPrefix: 'taxpal.forms.v1'
};

const MAX_PLAN_HISTORY = 8;

const SAMPLE_FORM_DATA = {
  nationality: 'China',
  state: 'CA',
  yearsInUS: '3',
  jobStatus: 'employed',
  isStudent: 'yes',
  hasSSN: 'no',
  housingStatus: 'rent',
  ownsCar: 'no',
  incomeRange: '$25,000 - $49,999',
  filingStatus: 'single',
  dependents: '0',
  hadJobChange: 'no',
  itemizedPreviousYear: 'notSure',
  incomeSources: ['w2Salary', 'stockInvestments'],
  specifics: 'I am an international student and also have U.S. stock dividends.'
};

const getOptionSets = (t) => ({
  jobStatus: [
    { value: 'employed', label: t.employed },
    { value: 'selfEmployed', label: t.selfEmployed },
    { value: 'unemployed', label: t.unemployed },
    { value: 'retired', label: t.retired }
  ],
  yesNo: [
    { value: 'yes', label: t.yes },
    { value: 'no', label: t.no }
  ],
  housingStatus: [
    { value: 'rent', label: t.rent },
    { value: 'own', label: t.own }
  ],
  filingStatus: [
    { value: 'single', label: t.single },
    { value: 'marriedJointly', label: t.marriedFilingJointly },
    { value: 'marriedSeparately', label: t.marriedFilingSeparately },
    { value: 'headOfHousehold', label: t.headOfHousehold },
    { value: 'qualifyingWidow', label: 'Qualifying Widow(er)' }
  ],
  itemizedPreviousYear: [
    { value: 'yes', label: t.yes },
    { value: 'no', label: t.no },
    { value: 'notSure', label: t.dontRemember }
  ],
  incomeSources: [
    { value: 'w2Salary', label: t.w2Salary },
    { value: 'selfEmployment', label: t.selfEmployment },
    { value: 'stockInvestments', label: t.stockInvestments },
    { value: 'rentalIncome', label: t.rentalIncome },
    { value: 'cryptocurrency', label: t.cryptocurrency },
    { value: 'other', label: t.other }
  ]
});

const getPromptValue = (value, dictionary) => dictionary[value] || value || 'Not specified';

const APP_MESSAGES = {
  en: {
    quotaFallback: 'AI quota reached. Showing a local fallback plan so you can keep going.',
    quotaChat: 'AI chat quota reached. You can still use the plan and checklist while quota resets.'
  },
  es: {
    quotaFallback: 'Se alcanzó la cuota de IA. Mostramos un plan local para que puedas continuar.',
    quotaChat: 'Se alcanzó la cuota de chat de IA. Aun así puedes usar el plan y la lista de documentos.'
  },
  zh: {
    quotaFallback: 'AI 配额已用尽。已为你生成本地备用计划，你可以继续使用。',
    quotaChat: 'AI 聊天配额已用尽。你仍可继续使用计划和材料清单。'
  }
};

const getLocalizedMessage = (language, key) => {
  return APP_MESSAGES[language]?.[key] || APP_MESSAGES.en[key] || '';
};

const safeStorageGet = (key, fallbackValue) => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallbackValue;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Failed to read storage key "${key}"`, error);
    return fallbackValue;
  }
};

const safeStorageSet = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write storage key "${key}"`, error);
  }
};

const safeStorageRemove = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove storage key "${key}"`, error);
  }
};

const getCompletionPercent = (formData, shouldAskYearsInUS) => {
  const checks = [
    Boolean(formData.nationality && formData.nationality.trim()),
    Boolean(formData.state),
    Boolean(formData.incomeRange),
    Boolean(formData.filingStatus),
    Array.isArray(formData.incomeSources) && formData.incomeSources.length > 0,
    !shouldAskYearsInUS || Boolean(formData.yearsInUS && String(formData.yearsInUS).trim())
  ];
  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
};

const createPlanId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const formatDateTime = (isoString) => {
  try {
    return new Date(isoString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '';
  }
};

const getChecklistStorageKey = (planId) => `${STORAGE_KEYS.checklistPrefix}.${planId}`;
const getDocumentHubStorageKey = (planId) => `${STORAGE_KEYS.documentHubPrefix}.${planId}`;
const getFormProgressStorageKey = (planId) => `${STORAGE_KEYS.formProgressPrefix}.${planId}`;

const getIncomeRangeUpperBound = (incomeRange) => {
  if (!incomeRange) {
    return null;
  }
  if (incomeRange === 'Under $12,000') {
    return 12000;
  }
  if (incomeRange === '$12,000 - $24,999') {
    return 24999;
  }
  if (incomeRange === '$25,000 - $49,999') {
    return 49999;
  }
  if (incomeRange === '$50,000 - $99,999') {
    return 99999;
  }
  if (incomeRange === '$100,000 - $200,000') {
    return 200000;
  }
  if (incomeRange === 'Over $200,000') {
    return 300000;
  }
  return null;
};

const getComplexityLabel = (score) => {
  if (score <= 2) {
    return 'Low';
  }
  if (score <= 5) {
    return 'Medium';
  }
  return 'High';
};

const buildBestFilingPathEngine = (sourceFormData, requiredForms = []) => {
  const data = sourceFormData || {};
  const incomeSources = Array.isArray(data.incomeSources) ? data.incomeSources : [];
  const nationality = String(data.nationality || '').trim().toLowerCase();
  const isLikelyNonUs = nationality && !['usa', 'us', 'u.s.', 'united states', 'america'].includes(nationality);
  const incomeUpperBound = getIncomeRangeUpperBound(data.incomeRange);
  const dependents = Number.parseInt(String(data.dependents || '0'), 10) || 0;
  const hasComplexIncome = ['selfEmployment', 'rentalIncome', 'cryptocurrency'].some((key) => incomeSources.includes(key));

  let complexityScore = 0;
  if (isLikelyNonUs) complexityScore += 2;
  if (incomeSources.includes('selfEmployment')) complexityScore += 2;
  if (incomeSources.includes('rentalIncome')) complexityScore += 2;
  if (incomeSources.includes('cryptocurrency')) complexityScore += 2;
  if (incomeSources.includes('stockInvestments')) complexityScore += 1;
  if (data.itemizedPreviousYear === 'yes') complexityScore += 1;
  if (dependents > 0) complexityScore += 1;
  if ((requiredForms || []).length >= 4) complexityScore += 1;
  if (data.hasMarketplaceHealth === 'yes' || data.hasRetirement === 'yes' || data.hasStudentLoans === 'yes') complexityScore += 1;

  const complexity = getComplexityLabel(complexityScore);
  const likelyDirectFileEligible = !isLikelyNonUs && !hasComplexIncome && (incomeUpperBound !== null && incomeUpperBound <= 200000);
  const likelyFreeFileEligible = !isLikelyNonUs && (incomeUpperBound !== null && incomeUpperBound <= 89000);

  const pathOptions = [
    {
      id: 'irs-direct-file',
      name: 'IRS Direct File',
      availability: likelyDirectFileEligible ? 'Likely eligible (confirm IRS rules)' : 'Check eligibility',
      estimatedTotalCost: '$0',
      complexity: 'Low-Medium',
      recommended: false,
      reason: likelyDirectFileEligible
        ? 'Good for simpler tax situations with straightforward income and lower error risk.'
        : 'Direct File has narrower eligibility; verify state and income-type support first.'
    },
    {
      id: 'irs-free-file',
      name: 'IRS Free File Partners',
      availability: likelyFreeFileEligible ? 'Likely eligible' : 'Possibly not eligible',
      estimatedTotalCost: '$0 federal; state may vary',
      complexity: 'Low-Medium',
      recommended: false,
      reason: likelyFreeFileEligible
        ? 'Best zero-cost path for many eligible users with straightforward filing.'
        : 'Income and profile may exceed typical Free File criteria.'
    },
    {
      id: 'software-diy',
      name: 'DIY Tax Software',
      availability: 'Available',
      estimatedTotalCost: complexity === 'High' ? '$0-$120 (depends on forms/states)' : '$0-$50',
      complexity: 'Medium-High',
      recommended: false,
      reason: 'Flexible and fast if you can review details yourself and follow a checklist.'
    },
    {
      id: 'tax-pro-assisted',
      name: 'Tax Pro Assisted Filing',
      availability: 'Available',
      estimatedTotalCost: '$120-$500+',
      complexity: 'High',
      recommended: false,
      reason: 'Best when profile is complex (nonresident, self-employment, rental, or multiple edge cases).'
    }
  ];

  let recommendedId = 'software-diy';
  if (complexity === 'High' || isLikelyNonUs) {
    recommendedId = 'tax-pro-assisted';
  } else if (likelyDirectFileEligible) {
    recommendedId = 'irs-direct-file';
  } else if (likelyFreeFileEligible) {
    recommendedId = 'irs-free-file';
  }

  return {
    complexity,
    complexityScore,
    recommendedId,
    options: pathOptions.map((item) => ({ ...item, recommended: item.id === recommendedId }))
  };
};

const deriveDocumentChecklist = (sourceFormData, requiredForms) => {
  const docs = new Set([
    'Photo ID',
    'Last year tax return (if available)'
  ]);

  if (!sourceFormData) {
    return Array.from(docs);
  }

  if (sourceFormData.hasSSN === 'yes') {
    docs.add('SSN or ITIN documentation');
  } else {
    docs.add('Any IRS notice related to ITIN/identity status');
  }

  if (sourceFormData.incomeSources?.includes('w2Salary')) {
    docs.add('W-2 statements from employers');
  }
  if (sourceFormData.incomeSources?.includes('selfEmployment')) {
    docs.add('1099-NEC/1099-MISC and business expense records');
  }
  if (sourceFormData.incomeSources?.includes('stockInvestments')) {
    docs.add('1099-B, 1099-DIV, and brokerage statements');
  }
  if (sourceFormData.incomeSources?.includes('rentalIncome')) {
    docs.add('Rental income and expense records');
  }
  if (sourceFormData.incomeSources?.includes('cryptocurrency')) {
    docs.add('Crypto transaction export from exchanges/wallets');
  }

  if (Array.isArray(requiredForms)) {
    requiredForms.forEach((form) => {
      if (String(form.formId || '').includes('1098')) {
        docs.add('Tuition/mortgage statements related to Form 1098');
      }
      if (String(form.formId || '').includes('1040')) {
        docs.add('Bank account details for refund/direct debit setup');
      }
    });
  }

  return Array.from(docs);
};

const buildPlanSummaryText = ({ response, sourceFormData, generatedAt }) => {
  const requiredForms = Array.isArray(response?.requiredForms) ? response.requiredForms : [];
  const nextSteps = Array.isArray(response?.nextSteps) ? response.nextSteps : [];
  const documents = Array.isArray(response?.requiredDocuments) && response.requiredDocuments.length > 0
    ? response.requiredDocuments
    : deriveDocumentChecklist(sourceFormData, requiredForms);

  const lines = [
    'TaxPal Plan Export',
    `Generated: ${generatedAt ? formatDateTime(generatedAt) : formatDateTime(new Date().toISOString())}`,
    '',
    `Summary: ${response?.analysisSummary || ''}`,
    '',
    'Required Forms:'
  ];

  if (requiredForms.length === 0) {
    lines.push('- None identified');
  } else {
    requiredForms.forEach((form) => {
      lines.push(`- ${form.formId}: ${form.formTitle}`);
      if (form.reason) {
        lines.push(`  Why: ${form.reason}`);
      }
    });
  }

  lines.push('', 'Recommended Next Steps:');
  if (nextSteps.length === 0) {
    lines.push('- No steps returned by assistant');
  } else {
    nextSteps.forEach((step, index) => {
      lines.push(`${index + 1}. ${step.stepTitle}`);
      if (step.stepDetails) {
        lines.push(`   ${step.stepDetails}`);
      }
    });
  }

  lines.push('', 'Document Checklist:');
  documents.forEach((item) => lines.push(`- ${item}`));
  lines.push('', `Disclaimer: ${response?.disclaimer || ''}`);
  return lines.join('\n');
};

const buildLocalFallbackPlan = (data, language = 'en') => {
  const nationality = String(data?.nationality || '').trim().toLowerCase();
  const isLikelyNonUs = nationality && !['usa', 'us', 'u.s.', 'united states', 'america'].includes(nationality);
  const forms = [];
  const pushForm = (formId, formTitle, reason) => {
    if (!forms.some((item) => item.formId === formId)) {
      forms.push({ formId, formTitle, reason });
    }
  };

  if (isLikelyNonUs) {
    pushForm('1040-NR', 'U.S. Nonresident Alien Income Tax Return', 'Commonly used for non-U.S. residents with U.S.-source income.');
    if (data?.isStudent === 'yes') {
      pushForm('8843', 'Statement for Exempt Individuals and Individuals With a Medical Condition', 'Often required for international students, even with low or no income.');
    }
  } else {
    pushForm('1040', 'U.S. Individual Income Tax Return', 'Primary federal income tax return for U.S. residents.');
  }

  if (data?.incomeSources?.includes('selfEmployment')) {
    pushForm('Schedule C', 'Profit or Loss From Business', 'Used to report self-employment or freelance income.');
    pushForm('Schedule SE', 'Self-Employment Tax', 'Used to calculate self-employment tax when business income applies.');
  }
  if (data?.incomeSources?.includes('stockInvestments')) {
    pushForm('Schedule D', 'Capital Gains and Losses', 'Used to summarize capital gains/losses from investments.');
    pushForm('Form 8949', 'Sales and Other Dispositions of Capital Assets', 'Used to report individual investment sales transactions.');
  }
  if (data?.incomeSources?.includes('rentalIncome')) {
    pushForm('Schedule E', 'Supplemental Income and Loss', 'Used to report rental income and related expenses.');
  }
  if (data?.itemizedPreviousYear === 'yes') {
    pushForm('Schedule A', 'Itemized Deductions', 'Useful when itemized deductions may exceed the standard deduction.');
  }

  const documents = deriveDocumentChecklist(data, forms);
  const riskAlerts = [];
  if (data?.incomeSources?.includes('selfEmployment')) {
    riskAlerts.push('Do not mix personal and business expenses when reporting deductions.');
  }
  if (data?.incomeSources?.includes('stockInvestments')) {
    riskAlerts.push('Ensure brokerage 1099 forms are fully matched before filing.');
  }
  if (data?.hasSSN === 'no') {
    riskAlerts.push('Identity/ITIN status can delay filing if supporting documents are missing.');
  }
  if (data?.incomeSources?.includes('cryptocurrency')) {
    riskAlerts.push('Crypto transactions are often under-reported; reconcile all exchange exports.');
  }

  const fallbackDisclaimer = language === 'zh'
    ? '当前为本地备用计划（AI 配额不足）。内容仅供参考，请咨询税务专业人士。'
    : language === 'es'
      ? 'Este es un plan local de respaldo (sin cuota de IA). Solo con fines informativos; consulte a un profesional de impuestos.'
      : 'This is a local fallback plan (AI quota unavailable). For information only; consult a qualified tax professional.';

  const fallbackSummary = language === 'zh'
    ? '由于 AI 配额暂时不可用，我们根据你的输入生成了可执行的基础报税计划。'
    : language === 'es'
      ? 'Como la cuota de IA no está disponible por ahora, generamos un plan básico accionable según tus respuestas.'
      : 'Because AI quota is currently unavailable, we generated a practical baseline plan from your inputs.';

  return {
    disclaimer: fallbackDisclaimer,
    analysisSummary: fallbackSummary,
    requiredForms: forms,
    nextSteps: [
      {
        stepTitle: language === 'zh' ? '整理核心材料' : language === 'es' ? 'Reunir documentos clave' : 'Gather core documents',
        stepDetails: language === 'zh'
          ? '按清单收集 W-2/1099、身份证明和去年报税记录。'
          : language === 'es'
            ? 'Reúne W-2/1099, identificación y tu declaración del año anterior.'
            : 'Collect W-2/1099 forms, identity docs, and last-year return before filing.'
      },
      {
        stepTitle: language === 'zh' ? '确认报税身份与表格' : language === 'es' ? 'Confirmar estado y formularios' : 'Confirm filing status and forms',
        stepDetails: language === 'zh'
          ? '先确认申报身份，再逐项核对本计划列出的表格。'
          : language === 'es'
            ? 'Valida tu estado fiscal y revisa uno por uno los formularios sugeridos.'
            : 'Validate filing status first, then review each suggested form in order.'
      },
      {
        stepTitle: language === 'zh' ? '逐项填写并复核' : language === 'es' ? 'Completar y revisar' : 'Complete and review line-by-line',
        stepDetails: language === 'zh'
          ? '使用 Form Assistant 逐行核对关键字段，避免遗漏收入与身份信息。'
          : language === 'es'
            ? 'Usa Form Assistant para revisar línea por línea y evitar omisiones.'
            : 'Use Form Assistant for line-by-line checks to avoid missing income or identity details.'
      },
      {
        stepTitle: language === 'zh' ? '提交前做最终检查' : language === 'es' ? 'Verificación final antes de enviar' : 'Final pre-file check',
        stepDetails: language === 'zh'
          ? '重点检查姓名/身份号、收入总额、银行信息和签名。'
          : language === 'es'
            ? 'Verifica nombre/ID, total de ingresos, datos bancarios y firma.'
            : 'Verify name/ID, total income, bank details, and signature before submission.'
      }
    ],
    requiredDocuments: documents,
    riskAlerts,
    serviceNotice: getLocalizedMessage(language, 'quotaFallback')
  };
};

const detectBrowserLanguage = () => {
  const lang = (navigator.language || 'en').toLowerCase();
  if (lang.startsWith('es')) {
    return 'es';
  }
  if (lang.startsWith('zh')) {
    return 'zh';
  }
  return 'en';
};

const PageBackdrop = () => h('div', { className: "pointer-events-none absolute inset-0 overflow-hidden" },
  h('div', { className: "absolute -left-28 top-10 h-64 w-64 rounded-full bg-tide-100/70 blur-3xl animate-drift" }),
  h('div', { className: "absolute -right-24 top-20 h-56 w-56 rounded-full bg-blue-100/65 blur-3xl animate-drift", style: { animationDelay: '2.4s' } }),
  h('div', { className: "absolute bottom-[-5rem] left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-slate-200/55 blur-3xl animate-drift", style: { animationDelay: '1.1s' } })
);

const DotBadge = ({ label }) => h('span', {
  className: "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm"
}, label);

// --- Utility Functions ---
const fetchWithBackoff = async (url, options, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorCode = 'HTTP_ERROR';
        let retryable = response.status >= 500 || response.status === 408;
        try {
          const errorBody = await response.json();
          if (errorBody?.error) {
            errorMessage = errorBody.error;
          }
          if (errorBody?.code) {
            errorCode = errorBody.code;
          }
          if (typeof errorBody?.retryable === 'boolean') {
            retryable = errorBody.retryable;
          }
        } catch (e) {
          errorMessage = `HTTP error! status: ${response.status} ${response.statusText}`;
        }

        const httpError = new Error(errorMessage);
        httpError.status = response.status;
        httpError.code = errorCode;
        httpError.retryable = retryable;
        throw httpError;
      }
      return response;
    } catch (error) {
      const retryable = error.retryable !== false;
      const status = error.status;
      const transient = typeof status === 'number'
        ? (status >= 500 || status === 408 || status === 429)
        : true;
      const shouldRetry = i < retries - 1 && retryable && transient;

      if (!shouldRetry) {
        throw error;
      }

      console.warn(`Attempt ${i + 1} failed. Retrying in ${delay}ms...`);
      if (i === retries - 1) {
        console.error("All retry attempts failed.", error);
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2;
    }
  }
};

const fetchChatReply = async (userQuery, history, pdfBase64 = null, language = 'en') => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userQuery, history, pdfBase64, language })
  };

  try {
    const response = await fetchWithBackoff('/.netlify/functions/getChatReply', options);
    const result = await response.json();

    if (result.reply) {
      return result.reply;
    }
    throw new Error(result.error || 'Invalid response from chat function.');
  } catch (error) {
    console.error('Error fetching chat reply:', error);
    throw error;
  }
};

const LanguageSelector = ({ onLanguageSelect }) => {
  const languages = [
    { code: 'en', name: 'English', note: 'United States', short: 'EN' },
    { code: 'es', name: 'Español', note: 'Latinoamérica', short: 'ES' },
    { code: 'zh', name: '中文', note: '简体', short: 'ZH' }
  ];

  return h('div', { className: "relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/55 to-slate-100 px-5 py-10 sm:px-10" },
    h(PageBackdrop),
    h('main', { className: "relative z-10 mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl items-center" },
      h('section', { className: cn(APP_STYLES.panel, 'w-full p-8 sm:p-12') },
        h('div', { className: 'mb-8 flex items-center justify-between gap-4' },
          h('div', null,
            h('p', { className: 'text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500' }, 'TaxPal Setup'),
            h('h1', { className: 'mt-2 font-display text-4xl text-slate-900 sm:text-5xl' }, 'Choose Your Language')
          ),
          h('div', { className: 'hidden sm:block' }, h(DotBadge, { label: '1/1' }))
        ),
        h('p', { className: 'mb-8 max-w-2xl text-base text-slate-600' },
          'Pick your preferred language. You can switch it again anytime in the top bar.'
        ),
        h('div', { className: 'grid gap-4 sm:grid-cols-3' },
          languages.map((item) => h('button', {
            key: item.code,
            onClick: () => onLanguageSelect(item.code),
            className: cn(
              'group rounded-2xl border border-slate-200 bg-white p-4 text-left transition-all duration-300',
              'hover:-translate-y-0.5 hover:border-tide-300 hover:shadow-[0_16px_30px_-24px_rgba(37,70,160,0.45)]',
              'focus:outline-none focus:ring-4 focus:ring-tide-100'
            )
          },
            h('div', { className: 'flex items-center justify-between' },
              h(DotBadge, { label: item.short }),
              h('span', { className: 'text-sm text-slate-400 transition group-hover:text-tide-600' }, 'Select')
            ),
            h('p', { className: 'mt-5 text-xl font-semibold text-slate-900' }, item.name),
            h('p', { className: 'mt-1 text-sm text-slate-500' }, item.note)
          ))
        ),
        h('div', { className: 'mt-9 rounded-2xl border border-amber-100 bg-amber-50/80 px-4 py-3 text-sm text-amber-900' },
          h('strong', { className: 'font-semibold' }, 'Note: '),
          'Tax guidance is informational only and should be reviewed with a qualified tax professional.'
        )
      )
    )
  );
};

const IntroScreen = ({ onStart, t }) => {
  const headingLines = t.heading.split('\n');

  return h('section', { className: 'relative overflow-hidden px-5 pb-14 pt-8 sm:px-10 sm:pt-14' },
    h(PageBackdrop),
    h('div', { className: 'relative z-10 mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.35fr_1fr]' },
      h('div', { className: cn(APP_STYLES.panel, 'p-8 sm:p-10 lg:p-12') },
        h('p', { className: 'text-[11px] font-semibold uppercase tracking-[0.22em] text-tide-700' }, 'Trusted tax guidance'),
        h('h1', { className: 'mt-4 font-display text-4xl leading-[1.1] text-slate-900 sm:text-5xl lg:text-6xl' },
          headingLines[0],
          h('br', null),
          headingLines[1]
        ),
        h('p', { className: 'mt-6 text-xl font-medium text-slate-700' }, t.subtitle),
        h('p', { className: 'mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg' }, t.description),
        h('div', { className: 'mt-8 flex flex-wrap gap-3' },
          [t.aiPowered, t.quickEasy, t.personalized].map((label) => h('span', {
            key: label,
            className: 'inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700'
          }, label))
        ),
        h('div', { className: 'mt-10 flex flex-wrap items-center gap-4' },
          h('button', {
            onClick: onStart,
            className: cn(
              'rounded-2xl bg-tide-700 px-7 py-4 text-base font-semibold text-white shadow-lg shadow-tide-900/20 transition-all duration-300',
              'hover:-translate-y-0.5 hover:bg-tide-800 focus:outline-none focus:ring-4 focus:ring-tide-200'
            )
          }, t.getStarted),
          h('span', { className: 'text-sm text-slate-500' }, '2-minute setup • mobile friendly')
        )
      ),
      h('div', { className: 'space-y-5' },
        h('div', { className: cn(APP_STYLES.section, 'bg-gradient-to-br from-tide-900 to-tide-800 text-white') },
          h('p', { className: 'text-xs uppercase tracking-[0.18em] text-tide-100/90' }, 'How it works'),
          h('ol', { className: 'mt-4 space-y-4' },
            [
              'Answer a structured profile form',
              'Receive your tailored filing roadmap',
              'Open each required form with AI guidance'
            ].map((item, index) => h('li', { key: item, className: 'flex items-start gap-3' },
              h('span', { className: 'mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs font-semibold' }, index + 1),
              h('span', { className: 'text-sm leading-relaxed text-tide-50' }, item)
            ))
          )
        ),
        h('div', { className: cn(APP_STYLES.section, 'border-amber-200/70 bg-amber-50/90') },
          h('p', { className: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800' }, t.disclaimerTitle),
          h('p', { className: 'mt-2 text-sm leading-relaxed text-amber-900' }, t.disclaimerText)
        )
      )
    )
  );
};

const FormInput = ({ label, name, value, onChange, ...props }) => h('label', { className: 'block' },
  h('span', { className: APP_STYLES.label }, label),
  h('input', {
    id: name,
    name,
    value,
    onChange,
    className: APP_STYLES.control,
    ...props
  })
);

const FormSelect = ({ label, name, value, onChange, children, ...props }) => h('label', { className: 'block' },
  h('span', { className: APP_STYLES.label }, label),
  h('select', {
    id: name,
    name,
    value,
    onChange,
    className: APP_STYLES.control,
    ...props
  }, children)
);

const FormRadio = ({ label, name, value, onChange, options }) => h('fieldset', { className: 'block' },
  h('legend', { className: APP_STYLES.label }, label),
  h('div', { className: 'mt-2 flex flex-wrap gap-2' },
    options.map((option) => h('label', {
      key: `${name}-${option.value}`,
      className: cn(
        'inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm transition',
        value === option.value
          ? 'border-tide-400 bg-tide-50 text-tide-900'
          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
      )
    },
      h('input', {
        type: 'radio',
        name,
        value: option.value,
        checked: value === option.value,
        onChange,
        className: 'h-4 w-4 accent-tide-700'
      }),
      h('span', null, option.label)
    ))
  )
);

const FormCheckboxGroup = ({ label, options, selected, onChange }) => h('fieldset', { className: 'block' },
  h('legend', { className: APP_STYLES.label }, label),
  h('div', { className: 'mt-2 grid gap-2 sm:grid-cols-2' },
    options.map((option) => {
      const checked = selected.includes(option.value);
      return h('label', {
        key: option.value,
        className: cn(
          'inline-flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition',
          checked
            ? 'border-tide-400 bg-tide-50 text-tide-900'
            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
        )
      },
        h('input', {
          type: 'checkbox',
          value: option.value,
          checked,
          onChange,
          className: 'h-4 w-4 rounded accent-tide-700'
        }),
        h('span', null, option.label)
      );
    })
  )
);

const FormTextArea = ({ label, name, value, onChange, ...props }) => h('label', { className: 'block' },
  h('span', { className: APP_STYLES.label }, label),
  h('textarea', {
    id: name,
    name,
    value,
    onChange,
    rows: 4,
    className: APP_STYLES.control,
    ...props
  })
);

const IntakeForm = ({ onSubmit, onLoading, t }) => {
  const [formData, setFormData] = useState(() => ({
    ...DEFAULT_FORM_DATA,
    ...safeStorageGet(STORAGE_KEYS.formDraft, {})
  }));
  const [validationError, setValidationError] = useState('');
  const [draftSavedAt, setDraftSavedAt] = useState(() => safeStorageGet(`${STORAGE_KEYS.formDraft}.savedAt`, null));
  const skipAutosaveRef = useRef(false);
  const optionSets = getOptionSets(t);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      incomeSources: checked
        ? [...prev.incomeSources, value]
        : prev.incomeSources.filter((source) => source !== value)
    }));
  };

  const handleUseSample = () => {
    setValidationError('');
    setFormData({
      ...DEFAULT_FORM_DATA,
      ...SAMPLE_FORM_DATA
    });
  };

  const handleClearDraft = () => {
    setValidationError('');
    skipAutosaveRef.current = true;
    setFormData(DEFAULT_FORM_DATA);
    safeStorageRemove(STORAGE_KEYS.formDraft);
    safeStorageRemove(`${STORAGE_KEYS.formDraft}.savedAt`);
    setDraftSavedAt(null);
  };

  const nationalityText = formData.nationality.trim().toLowerCase();
  const shouldAskYearsInUS = nationalityText && !['usa', 'us', 'u.s.', 'united states', 'america'].includes(nationalityText);
  const completionPercent = getCompletionPercent(formData, shouldAskYearsInUS);

  useEffect(() => {
    if (skipAutosaveRef.current) {
      skipAutosaveRef.current = false;
      return;
    }
    safeStorageSet(STORAGE_KEYS.formDraft, formData);
    const now = new Date().toISOString();
    safeStorageSet(`${STORAGE_KEYS.formDraft}.savedAt`, now);
    setDraftSavedAt(now);
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = [];

    if (!formData.nationality.trim()) {
      missing.push('nationality');
    }
    if (!formData.state) {
      missing.push('state');
    }
    if (!formData.incomeRange) {
      missing.push('income range');
    }
    if (shouldAskYearsInUS && !String(formData.yearsInUS || '').trim()) {
      missing.push('years in U.S.');
    }
    if (!formData.incomeSources.length) {
      missing.push('at least one income source');
    }

    if (missing.length > 0) {
      setValidationError(`Please complete: ${missing.join(', ')}.`);
      return;
    }

    setValidationError('');
    onLoading();
    onSubmit(formData);
  };

  return h('div', { className: 'relative px-5 pb-16 pt-8 sm:px-10' },
    h(PageBackdrop),
    h('div', { className: 'relative z-10 mx-auto max-w-5xl' },
      h('div', { className: cn(APP_STYLES.panel, 'p-6 sm:p-8') },
        h('div', { className: 'flex flex-wrap items-start justify-between gap-4' },
          h('div', null,
            h('p', { className: 'text-[11px] font-semibold uppercase tracking-[0.18em] text-tide-700' }, t.smartIntake),
            h('h2', { className: 'mt-2 font-display text-3xl text-slate-900 sm:text-4xl' }, t.tellUsAbout),
            h('p', { className: 'mt-3 max-w-3xl text-base text-slate-600' }, t.formDescription)
          ),
          h('div', { className: 'text-right' },
            h('span', { className: 'rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600' },
              t.profileComplete.replace('{percent}', completionPercent)
            ),
            draftSavedAt && h('p', { className: 'mt-2 text-xs text-slate-500' }, t.draftSaved.replace('{time}', formatDateTime(draftSavedAt)))
          )
        ),
        h('div', { className: 'mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-200' },
          h('div', { className: 'h-full rounded-full bg-tide-600 transition-all duration-300', style: { width: `${completionPercent}%` } })
        ),
        h('div', { className: 'mt-4 flex flex-wrap gap-2' },
          h('button', {
            type: 'button',
            onClick: handleUseSample,
            className: 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
          }, t.useSampleProfile),
          h('button', {
            type: 'button',
            onClick: handleClearDraft,
            className: 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
          }, t.clearSavedDraft)
        )
      ),
      h('form', { onSubmit: handleSubmit, className: 'mt-6 space-y-5' },
        validationError && h('div', { className: 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700' }, validationError),
        h('section', { className: APP_STYLES.section },
          h('p', { className: 'text-sm font-semibold text-slate-900' }, t.profileSection),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormInput, {
              label: t.nationality,
              name: 'nationality',
              value: formData.nationality,
              onChange: handleChange,
              placeholder: t.nationalityPlaceholder,
              required: true
            }),
            h(FormSelect, {
              label: t.state,
              name: 'state',
              value: formData.state,
              onChange: handleChange,
              required: true
            },
              h('option', { value: '' }, t.selectState),
              US_STATES.map((state) => h('option', { key: state, value: state }, state)),
              h('option', { value: 'N/A' }, t.notUSResident)
            )
          ),
          shouldAskYearsInUS && h('div', { className: 'mt-4 max-w-md' },
            h(FormInput, {
              label: t.yearsInUS,
              name: 'yearsInUS',
              value: formData.yearsInUS,
              onChange: handleChange,
              type: 'number',
              min: '0',
              placeholder: 'e.g., 3'
            })
          )
        ),
        h('section', { className: APP_STYLES.section },
          h('p', { className: 'text-sm font-semibold text-slate-900' }, t.statusSection),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormSelect, {
              label: t.jobStatus,
              name: 'jobStatus',
              value: formData.jobStatus,
              onChange: handleChange
            },
              optionSets.jobStatus.map((option) => h('option', { key: option.value, value: option.value }, option.label))
            ),
            h(FormRadio, {
              label: t.isStudent,
              name: 'isStudent',
              value: formData.isStudent,
              onChange: handleChange,
              options: optionSets.yesNo
            })
          ),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormRadio, {
              label: t.hasSSN,
              name: 'hasSSN',
              value: formData.hasSSN,
              onChange: handleChange,
              options: optionSets.yesNo
            }),
            h(FormRadio, {
              label: t.hadJobChange,
              name: 'hadJobChange',
              value: formData.hadJobChange,
              onChange: handleChange,
              options: optionSets.yesNo
            })
          )
        ),
        h('section', { className: APP_STYLES.section },
          h('p', { className: 'text-sm font-semibold text-slate-900' }, t.incomeDeductionsSection),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormSelect, {
              label: t.incomeRange,
              name: 'incomeRange',
              value: formData.incomeRange,
              onChange: handleChange,
              required: true
            },
              h('option', { value: '' }, t.selectIncomeRange),
              INCOME_RANGES.map((range) => h('option', { key: range, value: range }, range))
            ),
            h(FormSelect, {
              label: t.filingStatus,
              name: 'filingStatus',
              value: formData.filingStatus,
              onChange: handleChange
            },
              optionSets.filingStatus.map((option) => h('option', { key: option.value, value: option.value }, option.label))
            )
          ),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormRadio, {
              label: t.housingStatus,
              name: 'housingStatus',
              value: formData.housingStatus,
              onChange: handleChange,
              options: optionSets.housingStatus
            }),
            h(FormRadio, {
              label: t.ownsCar,
              name: 'ownsCar',
              value: formData.ownsCar,
              onChange: handleChange,
              options: optionSets.yesNo
            })
          ),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormSelect, {
              label: t.dependents,
              name: 'dependents',
              value: formData.dependents,
              onChange: handleChange
            },
              ['0', '1', '2', '3', '4', '5+'].map((count) => h('option', { key: count, value: count }, count === '5+' ? t.fiveOrMore : count))
            ),
            h(FormRadio, {
              label: t.itemizedPreviousYear,
              name: 'itemizedPreviousYear',
              value: formData.itemizedPreviousYear,
              onChange: handleChange,
              options: optionSets.itemizedPreviousYear
            })
          ),
        ),
        h('section', { className: APP_STYLES.section },
          h('p', { className: 'text-sm font-semibold text-slate-900' }, t.additionalTaxSituations),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormRadio, {
              label: t.hasCrypto,
              name: 'hasCrypto',
              value: formData.hasCrypto,
              onChange: handleChange,
              options: optionSets.yesNo
            }),
            h(FormRadio, {
              label: t.hasRetirement,
              name: 'hasRetirement',
              value: formData.hasRetirement,
              onChange: handleChange,
              options: optionSets.yesNo
            })
          ),
          h('div', { className: 'mt-4 grid gap-4 md:grid-cols-2' },
            h(FormRadio, {
              label: t.hasMarketplaceHealth,
              name: 'hasMarketplaceHealth',
              value: formData.hasMarketplaceHealth,
              onChange: handleChange,
              options: optionSets.yesNo
            }),
            h(FormRadio, {
              label: t.hasStudentLoans,
              name: 'hasStudentLoans',
              value: formData.hasStudentLoans,
              onChange: handleChange,
              options: optionSets.yesNo
            })
          ),
          h('div', { className: 'mt-4' },
            h(FormCheckboxGroup, {
              label: t.incomeSources,
              options: optionSets.incomeSources,
              selected: formData.incomeSources,
              onChange: handleCheckboxChange
            })
          )
        ),
        h('section', { className: APP_STYLES.section },
          h(FormTextArea, {
            label: t.specifics,
            name: 'specifics',
            value: formData.specifics,
            onChange: handleChange,
            placeholder: "Example: I'm an international student with stock income and no SSN yet."
          })
        ),
        h('div', { className: 'flex justify-end' },
          h('button', {
            type: 'submit',
            className: cn(
              'rounded-2xl bg-tide-700 px-7 py-4 text-base font-semibold text-white transition-all duration-300',
              'shadow-lg shadow-tide-900/20 hover:-translate-y-0.5 hover:bg-tide-800 focus:outline-none focus:ring-4 focus:ring-tide-200'
            )
          }, t.createPlan)
        )
      )
    )
  );
};

const LoadingScreen = ({ t }) => h('section', { className: 'relative min-h-[70vh] px-5 py-20 sm:px-10' },
  h(PageBackdrop),
  h('div', { className: 'relative z-10 mx-auto max-w-xl' },
    h('div', { className: cn(APP_STYLES.panel, 'p-10 text-center') },
      h('div', { className: 'mx-auto h-16 w-16 rounded-full border-4 border-tide-100 border-t-tide-700 animate-spin' }),
      h('h2', { className: 'mt-8 font-display text-4xl text-slate-900' }, t.analyzing),
      h('p', { className: 'mt-3 text-base text-slate-600' }, t.creatingPlan),
      h('div', { className: 'mt-8 space-y-3' },
        h('div', { className: 'h-2 w-full overflow-hidden rounded-full bg-slate-100' },
          h('div', { className: 'h-full w-2/3 rounded-full bg-tide-500 animate-pulse-soft' })
        ),
        h('p', { className: 'text-xs uppercase tracking-[0.16em] text-slate-500' }, t.buildingRecommendations)
      )
    )
  )
);

const LinkedText = ({ text }) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlOnlyRegex = /^https?:\/\/[^\s]+$/;
  const parts = String(text || '').split(urlRegex);

  return h('p', { className: 'whitespace-pre-wrap text-sm leading-relaxed text-slate-700 sm:text-base' },
    parts.map((part, index) => (
      urlOnlyRegex.test(part)
        ? h('a', {
          key: index,
          href: part,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'break-all text-tide-700 underline decoration-tide-300 underline-offset-4 hover:text-tide-800'
        }, part)
        : h('span', { key: index }, part)
    ))
  );
};

const StepDetailModal = ({ step, onClose }) => h('div', {
  className: 'fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm',
  onClick: onClose
},
  h('div', {
    className: cn(APP_STYLES.panel, 'max-h-[85vh] w-full max-w-2xl overflow-hidden p-0'),
    onClick: (e) => e.stopPropagation()
  },
    h('header', { className: 'flex items-start justify-between border-b border-slate-200 px-6 py-4' },
      h('h3', { className: 'pr-4 text-xl font-semibold text-slate-900' }, step.stepTitle),
      h('button', {
        onClick: onClose,
        className: 'rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:border-slate-300 hover:text-slate-700'
      }, t.close)
    ),
    h('main', { className: 'max-h-[58vh] overflow-y-auto px-6 py-5' }, h(LinkedText, { text: step.stepDetails })),
    h('footer', { className: 'border-t border-slate-200 px-6 py-4 text-right' },
      h('button', {
        onClick: onClose,
        className: 'rounded-xl bg-tide-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-tide-800'
      }, t.gotIt)
    )
  )
);

const FormFilingPage = ({ form, onBack, language }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedStatus, setCopiedStatus] = useState('');
  const chatBottomRef = useRef(null);

  const [pdfJsLoaded, setPdfJsLoaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pdfFile, setPdfFile] = useState(null);
  const [pdfError, setPdfError] = useState(null);
  const [currentPdfPage, setCurrentPdfPage] = useState(1);
  const [totalPdfPages, setTotalPdfPages] = useState(1);
  const canvasRef = useRef(null);
  const dropAreaRef = useRef(null);
  const fileInputRef = useRef(null);
  const pdfDocumentRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js';
    script.async = true;
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
        setPdfJsLoaded(true);
      } else {
        setPdfError('Could not load PDF library. Please refresh the page.');
      }
    };
    script.onerror = () => {
      setPdfError('Failed to load PDF library. Please check your connection.');
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    setChatHistory([
      {
        role: 'model',
        parts: [{
          text: t.askAbout.replace('{formId}', form.formId)
        }]
      }
    ]);
    setCopiedStatus('');
  }, [form]);

  const renderPdfPage = async (pdf, pageNumber) => {
    const canvas = canvasRef.current;
    const container = dropAreaRef.current;
    if (!canvas || !container || !pdf) {
      return;
    }

    const page = await pdf.getPage(pageNumber);
    const context = canvas.getContext('2d');
    const viewport = page.getViewport({ scale: 1 });
    const scale = Math.min(container.clientWidth / viewport.width, 1.6);
    const scaledViewport = page.getViewport({ scale });

    canvas.height = scaledViewport.height;
    canvas.width = scaledViewport.width;

    await page.render({
      canvasContext: context,
      viewport: scaledViewport
    }).promise;
  };

  useEffect(() => {
    if (!pdfFile || !pdfJsLoaded || !canvasRef.current) {
      return;
    }

    setPdfError(null);
    let canceled = false;
    const fileReader = new FileReader();

    fileReader.onload = async function onPdfLoaded() {
      try {
        const typedarray = new Uint8Array(this.result);
        const loadingTask = window.pdfjsLib.getDocument(typedarray);
        const pdf = await loadingTask.promise;
        if (canceled) {
          return;
        }
        pdfDocumentRef.current = pdf;
        setTotalPdfPages(pdf.numPages || 1);
        setCurrentPdfPage(1);
        await renderPdfPage(pdf, 1);
      } catch (error) {
        console.error('Error rendering PDF:', error);
        setPdfError(t.oopsSomethingWentWrong);
        setPdfFile(null);
        pdfDocumentRef.current = null;
      }
    };

    fileReader.onerror = () => {
      setPdfError(t.oopsSomethingWentWrong);
    };

    fileReader.readAsArrayBuffer(pdfFile);

    return () => {
      canceled = true;
    };
  }, [pdfFile, pdfJsLoaded]);

  useEffect(() => {
    if (!pdfDocumentRef.current || !pdfFile) {
      return;
    }
    renderPdfPage(pdfDocumentRef.current, currentPdfPage).catch((error) => {
      console.error('Failed to render selected PDF page', error);
      setPdfError('Could not render this page.');
    });
  }, [currentPdfPage, pdfFile]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput) {
      return;
    }

    const newUserMessage = { role: 'user', parts: [{ text: trimmedInput }] };
    setChatLoading(true);
    setChatHistory((prev) => [...prev, newUserMessage]);
    setUserInput('');

    const apiHistory = [
      { role: 'user', parts: [{ text: `I am asking about Form ${form.formId} (${form.formTitle}).` }] },
      { role: 'model', parts: [{ text: "Got it. I'm ready to help you with that form. What's your question?" }] },
      ...chatHistory
    ];

    try {
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

      const aiResponseText = await fetchChatReply(trimmedInput, apiHistory, pdfBase64, language);
      const newAiMessage = { role: 'model', parts: [{ text: aiResponseText }] };
      setChatHistory((prev) => [...prev, newAiMessage]);
    } catch (error) {
      console.error('Failed to get chat reply:', error);
      const isQuotaError = error?.code === 'QUOTA_EXCEEDED' || /quota|resource_exhausted|429/i.test(String(error?.message || ''));
      const fallbackText = isQuotaError
        ? getLocalizedMessage(language, 'quotaChat')
        : "Sorry, I couldn't connect to the AI assistant. Please try again.";
      const errorMessage = { role: 'model', parts: [{ text: fallbackText }] };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setChatLoading(false);
  };

  const setPdfFromFile = (file) => {
    if (file && file.type === 'application/pdf') {
      setPdfError(null);
      setPdfFile(file);
    } else {
      setPdfError('Please upload a PDF file.');
    }
  };

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
    setPdfFromFile(e.dataTransfer.files[0]);
  };

  const handleFileInputChange = (e) => {
    setPdfFromFile(e.target.files?.[0]);
  };

  const handleRemovePdf = () => {
    setPdfFile(null);
    setPdfError(null);
    setCurrentPdfPage(1);
    setTotalPdfPages(1);
    pdfDocumentRef.current = null;
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopyChat = async () => {
    const transcript = chatHistory
      .map((entry) => `${entry.role === 'user' ? 'You' : 'TaxPal'}: ${entry.parts?.[0]?.text || ''}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(transcript);
      setCopiedStatus(t.planCopied);
    } catch (error) {
      console.warn('Failed to copy transcript', error);
      setCopiedStatus(t.copyFailed);
    }
    setTimeout(() => setCopiedStatus(''), 1800);
  };

  const quickPrompts = [
    `What documents do I need before filling ${form.formId}?`,
    `Explain this form in plain English, line by line.`,
    `What mistakes should I avoid on ${form.formId}?`
  ];

  const formSearchUrl = `https://www.google.com/search?q=IRS+${encodeURIComponent(form.formId)}+form+${encodeURIComponent(form.formTitle)}`;

  return h('section', { className: 'relative px-5 pb-16 pt-8 sm:px-10' },
    h(PageBackdrop),
    h('div', { className: 'relative z-10 mx-auto max-w-7xl' },
      h('button', {
        onClick: onBack,
        className: 'mb-5 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
      },
        h('span', null, '←'),
        t.backToTaxPlan
      ),
      h('div', { className: cn(APP_STYLES.panel, 'p-6 sm:p-8') },
        h('h2', { className: 'font-display text-3xl text-slate-900 sm:text-4xl' }, `Filing: ${form.formId}`),
        h('p', { className: 'mt-2 text-base text-slate-600' }, form.formTitle),
        h('div', { className: 'mt-6 grid gap-6 lg:grid-cols-2' },
          h('div', { className: cn(APP_STYLES.section, 'p-5 sm:p-6') },
            h('div', { className: 'mb-3 flex flex-wrap items-center justify-between gap-2' },
              h('h3', { className: 'text-lg font-semibold text-slate-900' }, t.formPreview),
              h('div', { className: 'flex flex-wrap gap-2' },
                h('button', {
                  type: 'button',
                  onClick: () => fileInputRef.current?.click(),
                  className: 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
                }, pdfFile ? t.replacePdf : t.uploadPdf),
                pdfFile && h('button', {
                  type: 'button',
                  onClick: handleRemovePdf,
                  className: 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
                }, t.remove)
              )
            ),
            h('input', {
              ref: fileInputRef,
              type: 'file',
              accept: 'application/pdf',
              onChange: handleFileInputChange,
              className: 'hidden'
            }),
            h('p', { className: 'mb-4 text-sm text-slate-500' },
              t.dragPdfDesc
            ),
            h('div', {
              ref: dropAreaRef,
              className: cn(
                'relative rounded-2xl border-2 p-4 text-center transition',
                pdfFile ? 'border-slate-300 bg-slate-50/70' : 'border-dashed border-slate-300 bg-white',
                isDragging && 'border-tide-400 bg-tide-50'
              ),
              onDragOver: handleDragOver,
              onDragLeave: handleDragLeave,
              onDrop: handleDrop,
              style: pdfFile ? {} : { minHeight: '380px' }
            },
              !pdfFile && h('div', { className: 'flex h-full min-h-[340px] flex-col items-center justify-center gap-3' },
                h('div', { className: 'h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50 text-2xl leading-[48px]' }, 'PDF'),
                h('p', { className: 'text-sm font-semibold text-slate-700' }, isDragging ? t.dropPdfHere : t.dragAndDropPdf),
                h('button', {
                  type: 'button',
                  onClick: () => fileInputRef.current?.click(),
                  className: 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
                }, t.chooseFile),
                h('a', {
                  href: formSearchUrl,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  className: 'text-sm text-tide-700 underline decoration-tide-300 underline-offset-4 hover:text-tide-800',
                  onClick: (e) => e.stopPropagation()
                }, t.findFormOnIRS.replace('{formId}', form.formId)),
                pdfError && h('p', { className: 'text-sm text-red-600' }, pdfError),
                !pdfJsLoaded && !pdfError && h('p', { className: 'text-xs uppercase tracking-[0.16em] text-slate-500' }, t.loadingPdfEngine)
              ),
              pdfFile && h('div', null,
                h('canvas', {
                  ref: canvasRef,
                  className: 'mx-auto block max-w-full rounded-xl border border-slate-200 bg-white shadow-sm'
                }),
                h('div', { className: 'mt-3 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600' },
                  h('span', null, `${pdfFile.name} • Page ${currentPdfPage}/${totalPdfPages}`),
                  h('div', { className: 'flex items-center gap-2' },
                    h('button', {
                      type: 'button',
                      onClick: () => setCurrentPdfPage((prev) => Math.max(1, prev - 1)),
                      disabled: currentPdfPage <= 1,
                      className: 'rounded-md border border-slate-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50'
                    }, t.prev),
                    h('button', {
                      type: 'button',
                      onClick: () => setCurrentPdfPage((prev) => Math.min(totalPdfPages, prev + 1)),
                      disabled: currentPdfPage >= totalPdfPages,
                      className: 'rounded-md border border-slate-200 px-2 py-1 disabled:cursor-not-allowed disabled:opacity-50'
                    }, t.next)
                  )
                )
              )
            )
          ),
          h('div', { className: cn(APP_STYLES.section, 'flex h-full flex-col p-5 sm:p-6') },
            h('div', { className: 'flex flex-wrap items-start justify-between gap-2' },
              h('h3', { className: 'text-lg font-semibold text-slate-900' }, t.formAssistant),
              h('button', {
                type: 'button',
                onClick: handleCopyChat,
                className: 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
              }, t.copyTranscript)
            ),
            copiedStatus && h('p', { className: 'mt-2 text-xs text-tide-700' }, copiedStatus),
            h('div', { className: 'mt-3 flex flex-wrap gap-2' },
              quickPrompts.map((prompt) => h('button', {
                key: prompt,
                type: 'button',
                onClick: () => setUserInput(prompt),
                className: 'rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
              }, prompt))
            ),
            h('div', { className: 'mt-4 flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50 p-4', style: { minHeight: '360px', maxHeight: '460px' } },
              chatHistory.map((msg, index) => h('div', {
                key: index,
                className: cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')
              },
                h('div', {
                  className: cn(
                    'max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm',
                    msg.role === 'user'
                      ? 'rounded-br-md bg-tide-700 text-white'
                      : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                  ),
                  style: { whiteSpace: 'pre-wrap' }
                }, msg.parts[0].text)
              )),
              chatLoading && h('div', { className: 'flex justify-start' },
                h('div', { className: 'inline-flex items-center gap-1 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-2 text-slate-500' },
                  h('span', { className: 'h-2 w-2 rounded-full bg-slate-400 animate-pulse' }),
                  h('span', { className: 'h-2 w-2 rounded-full bg-slate-400 animate-pulse', style: { animationDelay: '0.15s' } }),
                  h('span', { className: 'h-2 w-2 rounded-full bg-slate-400 animate-pulse', style: { animationDelay: '0.3s' } })
                )
              ),
              h('div', { ref: chatBottomRef })
            ),
            h('form', { onSubmit: handleChatSubmit, className: 'mt-4 flex gap-2' },
              h('input', {
                type: 'text',
                value: userInput,
                onChange: (e) => setUserInput(e.target.value),
                disabled: chatLoading,
                placeholder: t.askAbout.replace('{formId}', form.formId),
                className: 'flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-tide-600 focus:outline-none focus:ring-4 focus:ring-tide-100'
              }),
              h('button', {
                type: 'submit',
                disabled: chatLoading,
                className: 'rounded-xl bg-tide-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-tide-800 disabled:cursor-not-allowed disabled:bg-slate-400'
              }, t.send)
            )
          )
        )
      )
    )
  );
};

const ResultsScreen = ({
  response,
  onReset,
  onStartFiling,
  onShowStepDetail,
  onLoadHistoryPlan,
  onDeleteHistoryPlan,
  sourceFormData,
  planHistory,
  currentPlanId,
  currentPlanCreatedAt,
  t
}) => {
  const [stepChecklist, setStepChecklist] = useState({});
  const [formCompletion, setFormCompletion] = useState({});
  const [documentStatus, setDocumentStatus] = useState({});
  const [exportStatus, setExportStatus] = useState('');

  const disclaimer = response?.disclaimer || t.disclaimerText;
  const analysisSummary = response?.analysisSummary || '';
  const requiredForms = Array.isArray(response?.requiredForms) ? response.requiredForms : [];
  const nextSteps = Array.isArray(response?.nextSteps) ? response.nextSteps : [];
  const serviceNotice = response?.serviceNotice || '';
  const requiredDocuments = Array.isArray(response?.requiredDocuments) && response.requiredDocuments.length > 0
    ? response.requiredDocuments
    : deriveDocumentChecklist(sourceFormData, requiredForms);
  const riskAlerts = Array.isArray(response?.riskAlerts) ? response.riskAlerts : [];
  const completedStepCount = nextSteps.filter((_, index) => Boolean(stepChecklist[index])).length;
  const historyItems = Array.isArray(planHistory) ? planHistory.filter((item) => item && item.id) : [];
  const bestFilingPath = buildBestFilingPathEngine(sourceFormData, requiredForms);
  const completedFormsCount = requiredForms.filter((form) => Boolean(formCompletion[form.formId])).length;
  const formsProgressPercent = requiredForms.length > 0 ? Math.round((completedFormsCount / requiredForms.length) * 100) : 0;

  const documentMetrics = requiredDocuments.reduce((acc, doc) => {
    const status = documentStatus[doc] || 'missing';
    if (status === 'verified') acc.verified += 1;
    else if (status === 'uploaded') acc.uploaded += 1;
    else acc.missing += 1;
    return acc;
  }, { missing: 0, uploaded: 0, verified: 0 });

  useEffect(() => {
    if (!currentPlanId) {
      setStepChecklist({});
      setFormCompletion({});
      setDocumentStatus({});
      return;
    }
    setStepChecklist(safeStorageGet(getChecklistStorageKey(currentPlanId), {}));
    setFormCompletion(safeStorageGet(getFormProgressStorageKey(currentPlanId), {}));
    setDocumentStatus(safeStorageGet(getDocumentHubStorageKey(currentPlanId), {}));
  }, [currentPlanId]);

  useEffect(() => {
    if (!currentPlanId) {
      return;
    }
    safeStorageSet(getChecklistStorageKey(currentPlanId), stepChecklist);
  }, [currentPlanId, stepChecklist]);

  useEffect(() => {
    if (!currentPlanId) {
      return;
    }
    safeStorageSet(getFormProgressStorageKey(currentPlanId), formCompletion);
  }, [currentPlanId, formCompletion]);

  useEffect(() => {
    if (!currentPlanId) {
      return;
    }
    safeStorageSet(getDocumentHubStorageKey(currentPlanId), documentStatus);
  }, [currentPlanId, documentStatus]);

  const toggleStepComplete = (index) => {
    setStepChecklist((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleFormComplete = (formId) => {
    setFormCompletion((prev) => ({ ...prev, [formId]: !prev[formId] }));
  };

  const updateDocumentStatus = (docName, status) => {
    setDocumentStatus((prev) => ({ ...prev, [docName]: status }));
  };

  const handleCopyPlan = async () => {
    const exportText = buildPlanSummaryText({
      response,
      sourceFormData,
      generatedAt: currentPlanCreatedAt
    });
    try {
      await navigator.clipboard.writeText(exportText);
      setExportStatus(t.planCopied);
    } catch (error) {
      console.warn('Failed to copy plan', error);
      setExportStatus(t.copyFailed);
    }
    setTimeout(() => setExportStatus(''), 1800);
  };

  const handleDownloadPlan = () => {
    const exportText = buildPlanSummaryText({
      response,
      sourceFormData,
      generatedAt: currentPlanCreatedAt
    });
    const blob = new Blob([exportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxpal-plan-${currentPlanId || Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const payload = {
      generatedAt: currentPlanCreatedAt || new Date().toISOString(),
      response,
      sourceFormData
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxpal-plan-${currentPlanId || Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!response) {
    return h('div', { className: 'mx-auto max-w-xl px-5 py-16 text-center sm:px-10' },
      h('div', { className: cn(APP_STYLES.panel, 'p-8') },
        h('h2', { className: 'font-display text-3xl text-slate-900' }, t.oopsSomethingWentWrong),
        h('p', { className: 'mt-2 text-slate-600' }, t.couldNotGeneratePlan),
        h('button', {
          onClick: onReset,
          className: 'mt-6 rounded-xl bg-tide-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-tide-800'
        }, t.tryAgain)
      )
    );
  }

  return h('section', { className: 'relative px-5 pb-16 pt-8 sm:px-10' },
    h(PageBackdrop),
    h('div', { className: 'relative z-10 mx-auto max-w-6xl space-y-6' },
      h('div', { className: cn(APP_STYLES.panel, 'p-6 sm:p-8') },
        h('h2', { className: 'font-display text-3xl text-slate-900 sm:text-4xl' }, t.taxPlan),
        serviceNotice && h('div', { className: 'mt-4 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900' }, serviceNotice),
        h('div', { className: 'mt-4 flex flex-wrap gap-2' },
          h('button', {
            type: 'button',
            onClick: handleCopyPlan,
            className: 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
          }, t.copySummary),
          h('button', {
            type: 'button',
            onClick: handleDownloadPlan,
            className: 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
          }, t.downloadTxt),
          h('button', {
            type: 'button',
            onClick: handleDownloadJson,
            className: 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
          }, t.downloadJson),
          exportStatus && h('span', { className: 'self-center text-xs text-tide-700' }, exportStatus)
        ),
        h('div', { className: 'mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-900' },
          h('strong', { className: 'font-semibold' }, `${t.quickReminder} `),
          disclaimer
        ),
        h('div', { className: 'mt-5 rounded-2xl border border-slate-200 bg-white px-4 py-4 sm:px-5' },
          h('h3', { className: 'text-lg font-semibold text-slate-900' }, t.taxSummary),
          h('p', { className: 'mt-2 text-sm leading-relaxed text-slate-600 sm:text-base' }, analysisSummary)
        )
      ),
      h('div', { className: APP_STYLES.section },
        h('div', { className: 'flex flex-wrap items-center justify-between gap-3' },
          h('h3', { className: 'text-2xl font-semibold text-slate-900' }, 'Best Filing Path'),
          h('span', { className: 'rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600' },
            `Complexity: ${bestFilingPath.complexity}`
          )
        ),
        h('p', { className: 'mt-2 text-sm text-slate-600' },
          'Available channels, estimated cost, and the most practical recommendation for your current profile.'
        ),
        h('div', { className: 'mt-4 grid gap-3 md:grid-cols-2' },
          bestFilingPath.options.map((option) => h('div', {
            key: option.id,
            className: cn(
              'rounded-2xl border p-4',
              option.recommended ? 'border-tide-300 bg-tide-50/40' : 'border-slate-200 bg-white'
            )
          },
            h('div', { className: 'flex items-start justify-between gap-3' },
              h('p', { className: 'text-sm font-semibold text-slate-900 sm:text-base' }, option.name),
              option.recommended && h('span', { className: 'rounded-full bg-tide-700 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-white' }, 'Recommended')
            ),
            h('div', { className: 'mt-3 space-y-1.5 text-xs text-slate-600' },
              h('p', null, h('strong', { className: 'text-slate-700' }, 'Availability: '), option.availability),
              h('p', null, h('strong', { className: 'text-slate-700' }, 'Estimated cost: '), option.estimatedTotalCost),
              h('p', null, h('strong', { className: 'text-slate-700' }, 'Best for: '), option.complexity)
            ),
            h('p', { className: 'mt-3 text-sm text-slate-600' }, option.reason)
          ))
        )
      ),
      h('div', { className: 'grid gap-6 lg:grid-cols-2' },
        h('div', { className: APP_STYLES.section },
          h('h3', { className: 'text-xl font-semibold text-slate-900' }, t.requiredForms),
          h('ul', { className: 'mt-4 space-y-3' },
            requiredForms.length > 0
              ? requiredForms.map((form) => h('li', {
                key: form.formId,
                className: 'rounded-2xl border border-slate-200 bg-slate-50 p-4'
              },
                h('p', { className: 'font-semibold text-slate-900' }, `${form.formId}: ${form.formTitle}`),
                h('p', { className: 'mt-2 text-sm text-slate-600' }, h('strong', null, `${t.why} `), form.reason)
              ))
              : h('li', { className: 'rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600' },
                'Based on your answers, it looks like you may not need to file. You can still verify details with the assistant.'
              )
          )
        ),
        h('div', { className: APP_STYLES.section },
          h('div', { className: 'flex items-center justify-between gap-3' },
            h('h3', { className: 'text-xl font-semibold text-slate-900' }, t.nextSteps),
            h('span', { className: 'text-xs font-semibold uppercase tracking-[0.12em] text-slate-500' }, `${completedStepCount}/${nextSteps.length || 0} complete`)
          ),
          h('div', { className: 'mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200' },
            h('div', {
              className: 'h-full rounded-full bg-tide-600 transition-all duration-300',
              style: { width: `${nextSteps.length ? Math.round((completedStepCount / nextSteps.length) * 100) : 0}%` }
            })
          ),
          h('div', { className: 'mt-4 space-y-3' },
            nextSteps.length > 0
              ? nextSteps.map((step, index) => h('div', {
                key: `${step.stepTitle}-${index}`,
                className: cn(
                  'rounded-2xl border border-slate-200 bg-white p-4 transition',
                  stepChecklist[index] ? 'border-tide-300 bg-tide-50/30' : 'hover:border-tide-300'
                )
              },
                h('div', { className: 'flex items-start gap-3' },
                  h('input', {
                    type: 'checkbox',
                    checked: Boolean(stepChecklist[index]),
                    onChange: () => toggleStepComplete(index),
                    className: 'mt-1 h-4 w-4 rounded accent-tide-700'
                  }),
                  h('div', { className: 'min-w-0 flex-1' },
                    h('p', { className: 'text-sm font-medium text-slate-800 sm:text-base' }, `${index + 1}. ${step.stepTitle}`),
                    h('div', { className: 'mt-2 flex gap-2' },
                      h('button', {
                        type: 'button',
                        onClick: () => onShowStepDetail(step),
                        className: 'rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300'
                      }, t.viewDetails)
                    )
                  )
                )
              ))
              : h('p', { className: 'rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600' },
                'No additional steps were returned. You can start a new plan for more context.'
              )
          )
        )
      ),
      h('div', { className: 'grid gap-6 lg:grid-cols-2' },
        h('div', { className: APP_STYLES.section },
          h('h3', { className: 'text-xl font-semibold text-slate-900' }, 'Document Readiness Hub'),
          h('p', { className: 'mt-2 text-sm text-slate-600' },
            'Track required forms and supporting documents before filing to reduce rework.'
          ),
          h('div', { className: 'mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4' },
            h('div', { className: 'flex items-center justify-between gap-3' },
              h('p', { className: 'text-sm font-semibold text-slate-800' }, 'Form completion progress'),
              h('span', { className: 'text-xs font-semibold text-slate-600' }, `${completedFormsCount}/${requiredForms.length || 0}`)
            ),
            h('div', { className: 'mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200' },
              h('div', {
                className: 'h-full rounded-full bg-tide-600 transition-all duration-300',
                style: { width: `${formsProgressPercent}%` }
              })
            ),
            h('p', { className: 'mt-2 text-xs text-slate-500' }, `${formsProgressPercent}% ready`)
          ),
          h('div', { className: 'mt-4 space-y-2' },
            requiredForms.length > 0
              ? requiredForms.map((form) => h('label', {
                key: `ready-${form.formId}`,
                className: cn(
                  'flex items-start gap-3 rounded-xl border p-3',
                  formCompletion[form.formId] ? 'border-tide-300 bg-tide-50/30' : 'border-slate-200 bg-white'
                )
              },
                h('input', {
                  type: 'checkbox',
                  checked: Boolean(formCompletion[form.formId]),
                  onChange: () => toggleFormComplete(form.formId),
                  className: 'mt-1 h-4 w-4 rounded accent-tide-700'
                }),
                h('div', null,
                  h('p', { className: 'text-sm font-semibold text-slate-900' }, `${form.formId} · ${form.formTitle}`),
                  h('p', { className: 'text-xs text-slate-500' }, formCompletion[form.formId] ? 'Marked as finished' : 'Pending')
                )
              ))
              : h('p', { className: 'rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600' }, t.noForms)
          ),
          h('div', { className: 'mt-6' },
            h('p', { className: 'text-sm font-semibold text-slate-800' }, 'Supporting documents'),
            h('div', { className: 'mt-2 flex flex-wrap gap-2 text-xs' },
              h('span', { className: 'rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600' }, `Missing: ${documentMetrics.missing}`),
              h('span', { className: 'rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600' }, `Uploaded: ${documentMetrics.uploaded}`),
              h('span', { className: 'rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-600' }, `Verified: ${documentMetrics.verified}`)
            ),
            h('div', { className: 'mt-3 space-y-2' },
              requiredDocuments.map((item, index) => {
                const status = documentStatus[item] || 'missing';
                return h('div', {
                  key: `${item}-${index}`,
                  className: 'flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2'
                },
                  h('p', { className: 'text-sm text-slate-700' }, item),
                  h('select', {
                    value: status,
                    onChange: (e) => updateDocumentStatus(item, e.target.value),
                    className: 'rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:border-tide-600 focus:outline-none'
                  },
                    h('option', { value: 'missing' }, 'Missing'),
                    h('option', { value: 'uploaded' }, 'Uploaded'),
                    h('option', { value: 'verified' }, 'Verified')
                  )
                );
              })
            )
          )
        ),
        h('div', { className: APP_STYLES.section },
          h('h3', { className: 'text-xl font-semibold text-slate-900' }, t.potentialWatchOuts),
          riskAlerts.length > 0
            ? h('ul', { className: 'mt-4 space-y-2' },
              riskAlerts.map((item, index) => h('li', {
                key: `${item}-${index}`,
                className: 'rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900'
              }, item))
            )
            : h('p', { className: 'mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600' },
              t.noRiskAlerts
            )
        )
      ),
      h('div', { className: APP_STYLES.section },
        h('h3', { className: 'text-2xl font-semibold text-slate-900' }, t.filingCenter),
        h('p', { className: 'mt-2 text-sm text-slate-600 sm:text-base' }, t.filingCenterDesc),
        requiredForms.length > 0
          ? h('div', { className: 'mt-5 grid gap-3 md:grid-cols-2' },
            requiredForms.map((form) => h('button', {
              key: form.formId,
              onClick: () => onStartFiling(form),
              className: cn(
                'rounded-2xl border border-slate-200 bg-white p-5 text-left transition-all',
                'hover:-translate-y-0.5 hover:border-tide-300 hover:bg-tide-50/30 focus:outline-none focus:ring-4 focus:ring-tide-100'
              )
            },
              h('p', { className: 'text-xl font-semibold text-slate-900' }, form.formId),
              h('p', { className: 'mt-1 text-sm text-slate-600' }, form.formTitle),
              h('p', { className: 'mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-tide-700' }, 'Open assistant →')
            ))
          )
          : h('p', { className: 'mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600' }, t.noForms)
      ),
      h('div', { className: APP_STYLES.section },
        h('div', { className: 'flex items-center justify-between gap-3' },
          h('h3', { className: 'text-2xl font-semibold text-slate-900' }, t.recentPlans),
          h('span', { className: 'text-xs uppercase tracking-[0.12em] text-slate-500' }, t.savedCount.replace('{count}', historyItems.length))
        ),
        historyItems.length > 0
          ? h('div', { className: 'mt-4 space-y-3' },
            historyItems.map((planItem) => h('div', {
              key: planItem.id,
              className: cn(
                'flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3',
                planItem.id === currentPlanId ? 'border-tide-300 bg-tide-50/30' : 'border-slate-200 bg-white'
              )
            },
              h('div', null,
                h('p', { className: 'text-sm font-semibold text-slate-900' }, `Plan ${planItem.id.slice(0, 8)}`),
                h('p', { className: 'text-xs text-slate-500' }, `${formatDateTime(planItem.createdAt)} • ${(planItem.response?.requiredForms || []).length} forms`)
              ),
              h('div', { className: 'flex gap-2' },
                h('button', {
                  type: 'button',
                  onClick: () => onLoadHistoryPlan(planItem.id),
                  className: 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
                }, t.open),
                h('button', {
                  type: 'button',
                  onClick: () => onDeleteHistoryPlan(planItem.id),
                  className: 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300'
                }, t.deletePlan)
              )
            ))
          )
          : h('p', { className: 'mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600' },
            t.noSavedPlans
          )
      ),
      h('div', { className: 'text-center' },
        h('button', {
          onClick: onReset,
          className: 'rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900'
        }, t.startOver)
      )
    )
  );
};

function App() {
  const [language, setLanguage] = useState(() => {
    const storedLanguage = safeStorageGet(STORAGE_KEYS.language, null);
    if (['en', 'es', 'zh'].includes(storedLanguage)) {
      return storedLanguage;
    }
    return detectBrowserLanguage();
  });
  const [step, setStep] = useState('intro');
  const [formData, setFormData] = useState(null);
  const [aiResponse, setAiResponse] = useState(null);
  const [error, setError] = useState(null);
  const [currentForm, setCurrentForm] = useState(null);
  const [currentStepDetail, setCurrentStepDetail] = useState(null);
  const [planHistory, setPlanHistory] = useState(() => {
    const savedHistory = safeStorageGet(STORAGE_KEYS.planHistory, []);
    return Array.isArray(savedHistory) ? savedHistory : [];
  });
  const [currentPlanId, setCurrentPlanId] = useState(null);

  const t = translations[language || 'en'];

  useEffect(() => {
    if (language) {
      safeStorageSet(STORAGE_KEYS.language, language);
    }
  }, [language]);

  useEffect(() => {
    safeStorageSet(STORAGE_KEYS.planHistory, planHistory);
  }, [planHistory]);

  const handleStart = () => {
    setStep('form');
    setFormData(null);
    setAiResponse(null);
    setError(null);
    setCurrentForm(null);
    setCurrentStepDetail(null);
    setCurrentPlanId(null);
  };

  const handleLoading = () => {
    setStep('loading');
  };

  const handleSubmit = async (data) => {
    setFormData(data);
    setError(null);

    const incomeSources = data.incomeSources
      .map((source) => getPromptValue(source, PROMPT_LABELS.incomeSources))
      .join(', ');

    const userQuery = `Here is my tax situation. Please analyze it and provide a plan.
- Nationality: ${data.nationality || 'Not specified'}
${data.nationality && !['usa', 'us', 'u.s.', 'united states', 'america'].includes(data.nationality.trim().toLowerCase()) ? `- Years in US: ${data.yearsInUS || 'Not specified'}` : ''}
- State: ${data.state || 'Not specified'}
- Filing Status: ${getPromptValue(data.filingStatus, PROMPT_LABELS.filingStatus)}
- Annual Income: ${data.incomeRange || 'Not specified'}
- Number of Dependents: ${data.dependents || '0'}
- Job Status: ${getPromptValue(data.jobStatus, PROMPT_LABELS.jobStatus)}
- Changed Jobs Last Year: ${getPromptValue(data.hadJobChange, PROMPT_LABELS.yesNo)}
- Has SSN/ITIN: ${getPromptValue(data.hasSSN, PROMPT_LABELS.yesNo)}
- Is a student: ${getPromptValue(data.isStudent, PROMPT_LABELS.yesNo)}
- Itemized Deductions Last Year: ${getPromptValue(data.itemizedPreviousYear, PROMPT_LABELS.itemizedPreviousYear)}
- Housing Status: ${getPromptValue(data.housingStatus, PROMPT_LABELS.housingStatus)}
- Owns a car: ${getPromptValue(data.ownsCar, PROMPT_LABELS.yesNo)}
- Transact in Crypto: ${getPromptValue(data.hasCrypto, PROMPT_LABELS.yesNo)}
- Contributed to Retirement: ${getPromptValue(data.hasRetirement, PROMPT_LABELS.yesNo)}
- ACA Marketplace Health Insurance: ${getPromptValue(data.hasMarketplaceHealth, PROMPT_LABELS.yesNo)}
- Paid Student Loans/Tuition: ${getPromptValue(data.hasStudentLoans, PROMPT_LABELS.yesNo)}
- Income Sources: ${incomeSources || 'None listed'}
- Other details: ${data.specifics || 'None'}`;

    try {
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery, language })
      };

      const response = await fetchWithBackoff('/.netlify/functions/getTaxPlan', options);
      const responseText = await response.text();
      const parsedResponse = JSON.parse(responseText);
      const newPlanId = createPlanId();
      const createdAt = new Date().toISOString();
      const planRecord = {
        id: newPlanId,
        createdAt,
        language,
        formData: data,
        response: parsedResponse
      };

      setAiResponse(parsedResponse);
      setCurrentPlanId(newPlanId);
      setPlanHistory((prev) => [planRecord, ...prev].slice(0, MAX_PLAN_HISTORY));
      safeStorageRemove(STORAGE_KEYS.formDraft);
      safeStorageRemove(`${STORAGE_KEYS.formDraft}.savedAt`);
      setError(null);
      setStep('results');
    } catch (err) {
      console.error('Failed to parse AI response:', err);

      const isQuotaError = err?.code === 'QUOTA_EXCEEDED' || /quota|resource_exhausted|429/i.test(String(err?.message || ''));
      if (isQuotaError) {
        const fallbackPlan = buildLocalFallbackPlan(data, language);
        const newPlanId = createPlanId();
        const createdAt = new Date().toISOString();
        const planRecord = {
          id: newPlanId,
          createdAt,
          language,
          formData: data,
          response: fallbackPlan,
          source: 'local-fallback'
        };

        setAiResponse(fallbackPlan);
        setCurrentPlanId(newPlanId);
        setPlanHistory((prev) => [planRecord, ...prev].slice(0, MAX_PLAN_HISTORY));
        safeStorageRemove(STORAGE_KEYS.formDraft);
        safeStorageRemove(`${STORAGE_KEYS.formDraft}.savedAt`);
        setError(null);
        setStep('results');
        return;
      }

      let errorMessage = 'An error occurred. ';
      if (err instanceof SyntaxError) {
        errorMessage += 'The AI response was not in the correct format.';
      } else if (err.message) {
        errorMessage += err.message;
      }
      errorMessage += ' Please try again.';

      setError(errorMessage);
      setStep('form');
    }
  };

  const handleStartFiling = (form) => {
    setCurrentForm(form);
    setStep('filing');
  };

  const handleShowStepDetail = (stepDetail) => {
    setCurrentStepDetail(stepDetail);
  };

  const handleLoadHistoryPlan = (planId) => {
    const selected = planHistory.find((item) => item.id === planId);
    if (!selected) {
      return;
    }

    if (selected.language && selected.language !== language) {
      setLanguage(selected.language);
    }
    setFormData(selected.formData || null);
    setAiResponse(selected.response || null);
    setCurrentPlanId(selected.id);
    setCurrentForm(null);
    setCurrentStepDetail(null);
    setError(null);
    setStep('results');
  };

  const handleDeleteHistoryPlan = (planId) => {
    const updated = planHistory.filter((item) => item.id !== planId);
    setPlanHistory(updated);
    safeStorageRemove(getChecklistStorageKey(planId));
    safeStorageRemove(getDocumentHubStorageKey(planId));
    safeStorageRemove(getFormProgressStorageKey(planId));

    if (currentPlanId === planId) {
      const fallback = updated[0] || null;
      if (fallback) {
        setCurrentPlanId(fallback.id);
        setFormData(fallback.formData || null);
        setAiResponse(fallback.response || null);
      } else {
        setCurrentPlanId(null);
        setFormData(null);
        setAiResponse(null);
        setStep('form');
      }
    }
  };

  const handleCloseModal = () => {
    setCurrentStepDetail(null);
  };

  const currentPlanMeta = planHistory.find((item) => item.id === currentPlanId) || null;

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return h(IntroScreen, { onStart: handleStart, t });
      case 'form':
        return h(IntakeForm, { onSubmit: handleSubmit, onLoading: handleLoading, t });
      case 'loading':
        return h(LoadingScreen, { t });
      case 'results':
        return h(ResultsScreen, {
          response: aiResponse,
          onReset: handleStart,
          onStartFiling: handleStartFiling,
          onShowStepDetail: handleShowStepDetail,
          onLoadHistoryPlan: handleLoadHistoryPlan,
          onDeleteHistoryPlan: handleDeleteHistoryPlan,
          sourceFormData: formData,
          planHistory,
          currentPlanId,
          currentPlanCreatedAt: currentPlanMeta?.createdAt,
          t
        });
      case 'filing':
        return h(FormFilingPage, {
          form: currentForm,
          onBack: () => {
            setStep('results');
            setCurrentForm(null);
          },
          language
        });
      default:
        return h(IntroScreen, { onStart: handleStart, t });
    }
  };

  const stepLabels = [
    { key: 'form', label: 'Profile' },
    { key: 'loading', label: 'Analyze' },
    { key: 'results', label: 'Plan' },
    { key: 'filing', label: 'Assist' }
  ];
  const activeIndex = stepLabels.findIndex((item) => item.key === step);

  return h('div', { className: 'relative min-h-screen overflow-hidden bg-slate-50 font-sans text-slate-900' },
    h('div', { className: 'pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(59,130,246,0.12),transparent_36%),radial-gradient(circle_at_86%_10%,rgba(96,165,250,0.1),transparent_32%),linear-gradient(180deg,#f8fafc_0%,#f3f7ff_52%,#eef3fb_100%)]' }),
    step !== 'intro' && h('header', { className: 'sticky top-0 z-30 border-b border-white/60 bg-white/72 backdrop-blur-xl' },
      h('nav', { className: 'mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-10' },
        h('div', { className: 'flex items-center gap-3' },
          h('div', { className: 'grid h-10 w-10 place-items-center rounded-xl bg-tide-700 text-sm font-semibold text-white shadow-sm' }, 'TP'),
          h('div', null,
            h('p', { className: 'text-lg font-semibold text-slate-900' }, 'TaxPal'),
            h('p', { className: 'text-xs uppercase tracking-[0.14em] text-slate-500' }, t.taxPlanner)
          )
        ),
        h('div', { className: 'flex flex-wrap items-center gap-2 sm:gap-3' },
          h('select', {
            value: language,
            onChange: (e) => setLanguage(e.target.value),
            className: 'rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-tide-500 focus:outline-none focus:ring-4 focus:ring-tide-100'
          },
            h('option', { value: 'en' }, 'English'),
            h('option', { value: 'es' }, 'Español'),
            h('option', { value: 'zh' }, '中文')
          ),
          h('button', {
            onClick: handleStart,
            className: 'rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900'
          }, t.newPlan),
          h('span', { className: 'rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600' }, t.savedCount.replace('{count}', planHistory.length))
        )
      ),
      h('div', { className: 'mx-auto flex max-w-7xl gap-2 px-5 pb-4 sm:px-10' },
        stepLabels.map((item, index) => h('div', {
          key: item.key,
          className: cn(
            'rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition',
            index <= activeIndex
              ? 'bg-tide-700 text-white'
              : 'bg-slate-100 text-slate-500'
          )
        }, item.label))
      )
    ),
    h('main', { className: 'relative z-10' },
      renderStep(),
      error && h('div', { className: 'mx-auto max-w-3xl px-5 pb-8 sm:px-10' },
        h('div', { className: 'rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700' },
          h('strong', { className: 'font-semibold' }, t.errorTitle),
          error
        )
      )
    ),
    currentStepDetail && h(StepDetailModal, {
      step: currentStepDetail,
      onClose: handleCloseModal
    })
  );
}

window.App = App;
