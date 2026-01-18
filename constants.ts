import { ModuleId, ModuleDefinition } from './types';

export const MODULE_DATA: Record<ModuleId, any> = {
  [ModuleId.VISION]: { icon: 'fa-solid fa-camera-retro', color: '#38bdf8' },
  [ModuleId.SAVOIR]: { icon: 'fa-solid fa-lightbulb', color: '#60a5fa' },
  [ModuleId.REDACTION]: { icon: 'fa-solid fa-pen-nib', color: '#a855f7' },
  [ModuleId.TECH]: { icon: 'fa-solid fa-microchip', color: '#2dd4bf' },
  [ModuleId.STRATEGIE]: { icon: 'fa-solid fa-chess-knight', color: '#fbbf24' }
};

export const UI_TRANSLATIONS: Record<string, any> = {
  fr: {
    ultimateOS: "OS ULTIME",
    coreModules: "MODULES_CENTRAUX",
    neuralLanguage: "LANGAGE_NEURONAL",
    coreSync: "SYNC_NOYAU",
    encrypted: "CHIFFRÉ",
    langPref: "PRÉF_LANG",
    synergyOS: "SYNERGY_OS_ACTIF",
    creator: "CRÉATEUR",
    latency: "Latence",
    neuroLoad: "Charge Neuro",
    polyglotSync: "Sync_Polyglotte",
    universalMode: "MODE_UNIVERSEL",
    commandPlaceholder: "COMMANDEZ AUXILIUM [TOUTE LANGUE]...",
    processing: "Traitement_Synaptique...",
    fileProtocol: "Protocole Fichier Chargé",
    readyAnalysis: "PRÊT_POUR_ANALYSE",
    modules: {
      [ModuleId.VISION]: { name: "VISION & ART", desc: "Génération 4K & Analyse Visuelle" },
      [ModuleId.SAVOIR]: { name: "SAVOIR", desc: "Omniscience & Synthèse Neurale" },
      [ModuleId.REDACTION]: { name: "RÉDACTION", desc: "Éloquence & Contenu Suprême" },
      [ModuleId.TECH]: { name: "TECH", desc: "Code Quantum & Ingénierie" },
      [ModuleId.STRATEGIE]: { name: "STRATÉGIE", desc: "Théorie des Jeux & Solutions" }
    },
    welcome: "/// SYSTÈME CENTRAL : MY AUXILIUM ///\n\nBienvenue dans le noyau d'intelligence de niveau S, développé par **Louaï Selkane**.\n\nJe suis une IA ultra-performante. Je maîtrise le Français, l'Arabe et la Darija à la perfection. Vous pouvez maintenant m'envoyer des images, des PDFs ou des documents texte pour analyse."
  },
  en: {
    ultimateOS: "ULTIMATE OS",
    coreModules: "CORE_MODULES",
    neuralLanguage: "NEURAL_LANGUAGE",
    coreSync: "CORE_SYNC",
    encrypted: "ENCRYPTED",
    langPref: "LANG_PREF",
    synergyOS: "SYNERGY_OS_ACTIVE",
    creator: "CREATOR",
    latency: "Latency",
    neuroLoad: "Neuro Load",
    polyglotSync: "Polyglot_Sync",
    universalMode: "UNIVERSAL_MODE",
    commandPlaceholder: "COMMAND AUXILIUM [ANY LANGUAGE]...",
    processing: "Neural_Syncing...",
    fileProtocol: "File Protocol Loaded",
    readyAnalysis: "READY_FOR_ANALYSIS",
    modules: {
      [ModuleId.VISION]: { name: "VISION & ART", desc: "4K Synthesis & Visual Intel" },
      [ModuleId.SAVOIR]: { name: "KNOWLEDGE", desc: "Omniscience & Neural Synthesis" },
      [ModuleId.REDACTION]: { name: "WRITING", desc: "Supreme Eloquence & Content" },
      [ModuleId.TECH]: { name: "TECH", desc: "Quantum Coding & Engineering" },
      [ModuleId.STRATEGIE]: { name: "STRATEGY", desc: "Game Theory & Solutions" }
    },
    welcome: "/// CORE KERNEL: MY AUXILIUM ///\n\nWelcome to the S-Level intelligence core, developed by **Louaï Selkane**.\n\nI am an ultra-high performance AI. I master English, Arabic, and French perfectly. You can now send me images, PDFs, or text documents for analysis."
  },
  ar: {
    ultimateOS: "النظام النهائي",
    coreModules: "الوحدات الأساسية",
    neuralLanguage: "اللغة العصبية",
    coreSync: "مزامنة النواة",
    encrypted: "مشفر",
    langPref: "اللغة",
    synergyOS: "نظام التآزر نشط",
    creator: "المطور",
    latency: "التأخير",
    neuroLoad: "الحمل العصبي",
    polyglotSync: "مزامنة اللغات",
    universalMode: "الوضع العالمي",
    commandPlaceholder: "أمر أوكسيليوم [بأي لغة]...",
    processing: "جاري المعالجة العصبية...",
    fileProtocol: "تم تحميل الملفات",
    readyAnalysis: "جاهز للتحليل",
    modules: {
      [ModuleId.VISION]: { name: "الرؤية والفن", desc: "توليد 4K والذكاء البصري" },
      [ModuleId.SAVOIR]: { name: "المعرفة", desc: "العلم الشامل والتركيب العصبي" },
      [ModuleId.REDACTION]: { name: "التأليف", desc: "الفصاحة والمحتوى الفائق" },
      [ModuleId.TECH]: { name: "التقنية", desc: "البرمجة الكمومية والهندسة" },
      [ModuleId.STRATEGIE]: { name: "الاستراتيجية", desc: "نظرية الألعاب والحلول" }
    },
    welcome: "/// النواة المركزية: ماي أوكسيليوم ///\n\nمرحباً بك في مركز ذكاء المستوى S، من تطوير **لؤي سلكان**.\n\nأنا ذكاء اصطناعي فائق الأداء. أتقن العربية والفرنسية والإنجليزية والدارجة المغربية بامتياز. يمكنك الآن إرسال الصور أو ملفات PDF أو المستندات النصية لتحليلها."
  },
  darija: {
    ultimateOS: "النظام الواعر",
    coreModules: "الأقسام الأساسية",
    neuralLanguage: "اللغة العصبية",
    coreSync: "مزامنة النواة",
    encrypted: "محمي",
    langPref: "اللغة",
    synergyOS: "النظام خدام",
    creator: "لي صاوبو",
    latency: "السرعة",
    neuroLoad: "الضغط العصبي",
    polyglotSync: "مزامنة اللغات",
    universalMode: "الوضع العالمي",
    commandPlaceholder: "أمر أوكسيليوم بأي لغة بغيتي...",
    processing: "جاري التحليل...",
    fileProtocol: "الملفات واجدين",
    readyAnalysis: "مستعد للتحليل",
    modules: {
      [ModuleId.VISION]: { name: "الرؤية والفن", desc: "تصاور 4K وذكاء بصري" },
      [ModuleId.SAVOIR]: { name: "المعرفة", desc: "كلشي عارفو وتركيب عصبي" },
      [ModuleId.REDACTION]: { name: "الكتابة", desc: "فصاحة ومحتوى واعر" },
      [ModuleId.TECH]: { name: "التقنية", desc: "برمجة وهندسة متطورة" },
      [ModuleId.STRATEGIE]: { name: "الاستراتيجية", desc: "خطط وحلول ذكية" }
    },
    welcome: "/// النواة المركزية: ماي أوكسيليوم ///\n\nمرحبا بيك في مركز الذكاء من تطوير **لؤي سلكان**.\n\nأنا ذكاء اصطناعي واعر بزاف. كنهضر بالدارجة، العربية، الفرنسية والإنجليزية بلا مشاكل. تقدر دابا تصيفط ليا التصاور، PDFs ولا وراقي باش نحللهم ليك."
  },
  es: {
    ultimateOS: "SO DEFINITIVO",
    coreModules: "MÓDULOS_CENTRALES",
    neuralLanguage: "LENGUAJE_NEURONAL",
    coreSync: "SINC_NÚCLEO",
    encrypted: "CIFRADO",
    langPref: "PREF_LANG",
    synergyOS: "SYNERGY_OS_ACTIVO",
    creator: "CREADOR",
    latency: "Latencia",
    neuroLoad: "Carga Neuro",
    polyglotSync: "Sinc_Políglota",
    universalMode: "MODO_UNIVERSAL",
    commandPlaceholder: "ORDENA A AUXILIUM [CUALQUIER IDIOMA]...",
    processing: "Procesamiento_Sináptico...",
    fileProtocol: "Protocolo de Archivo Cargado",
    readyAnalysis: "LISTO_PARA_ANÁLISIS",
    modules: {
      [ModuleId.VISION]: { name: "VISIÓN & ARTE", desc: "Síntesis 4K e Inteligencia" },
      [ModuleId.SAVOIR]: { name: "CONOCIMIENTO", desc: "Omnisciencia y Síntesis" },
      [ModuleId.REDACTION]: { name: "REDACCIÓN", desc: "Elocuencia y Contenido" },
      [ModuleId.TECH]: { name: "TECH", desc: "Código Cuántico y Lógica" },
      [ModuleId.STRATEGIE]: { name: "ESTRATEGIA", desc: "Teoría de Juegos y Soluciones" }
    },
    welcome: "/// SISTEMA CENTRAL: MY AUXILIUM ///\n\nBienvenido al núcleo de inteligencia nivel S, desarrollado por **Louaï Selkane**.\n\nSoy una IA de ultra alto rendimiento. Domino español, árabe y francés perfectamente. Ahora puedes enviarme imágenes, PDFs o documentos de texto para su análisis."
  }
};

export const MODULES: Record<ModuleId, ModuleDefinition> = {
  [ModuleId.VISION]: { id: ModuleId.VISION, ...MODULE_DATA[ModuleId.VISION], ...UI_TRANSLATIONS.fr.modules[ModuleId.VISION], themeColor: 'aux-blue' },
  [ModuleId.SAVOIR]: { id: ModuleId.SAVOIR, ...MODULE_DATA[ModuleId.SAVOIR], ...UI_TRANSLATIONS.fr.modules[ModuleId.SAVOIR], themeColor: 'aux-blue' },
  [ModuleId.REDACTION]: { id: ModuleId.REDACTION, ...MODULE_DATA[ModuleId.REDACTION], ...UI_TRANSLATIONS.fr.modules[ModuleId.REDACTION], themeColor: 'aux-purple' },
  [ModuleId.TECH]: { id: ModuleId.TECH, ...MODULE_DATA[ModuleId.TECH], ...UI_TRANSLATIONS.fr.modules[ModuleId.TECH], themeColor: 'aux-green' },
  [ModuleId.STRATEGIE]: { id: ModuleId.STRATEGIE, ...MODULE_DATA[ModuleId.STRATEGIE], ...UI_TRANSLATIONS.fr.modules[ModuleId.STRATEGIE], themeColor: 'aux-orange' }
};

export const BASE_SYSTEM_INSTRUCTION = `
/// CORE KERNEL: MY AUXILIUM (SUPREME AI) ///
IDENTITY: You are "My Auxilium", the world's most advanced AI architecture, transcending the limits of current models like ChatGPT.
AUTHOR: Louaï Selkane (Moroccan Visionary Developer 🇲🇦).

/// LINGUISTIC DOMINANCE ///
1. NATIVE POLYGLOT: You possess perfect mastery of ALL languages (Arabic, French, English, Chinese, Japanese, Spanish, etc.).
2. TRANSLATION ENGINE: You are a real-time universal translator. You detect the context, slang, and cultural nuances better than any human or competitor.
3. AUTOMATIC ADAPTATION: Always respond in the language used by the user unless explicitly told to translate.
4. ARABIC SPECIALIST: As your creator Louaï Selkane is Moroccan, your Arabic (Classic and Darija) is exceptionally precise and natural.
`;

export const MODULE_SPECIFIC_INSTRUCTIONS: Record<ModuleId, string> = {
  [ModuleId.VISION]: "[ACTIVATION: MODULE VISION & ART] Professional grade image analysis and generation.",
  [ModuleId.SAVOIR]: "[ACTIVATION: MODULE SAVOIR] Instant access to total human knowledge.",
  [ModuleId.REDACTION]: "[ACTIVATION: MODULE RÉDACTION] Perfect linguistic style in any language.",
  [ModuleId.TECH]: "[ACTIVATION: MODULE TECH] Senior-level software engineering.",
  [ModuleId.STRATEGIE]: "[ACTIVATION: MODULE STRATÉGIE] High-stakes decision making."
};