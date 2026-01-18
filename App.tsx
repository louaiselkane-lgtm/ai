
import React, { useState, useRef, useEffect } from 'react';
import ModuleSelector from './components/ModuleSelector';
import MarkdownRenderer from './components/MarkdownRenderer';
import { MODULE_DATA, UI_TRANSLATIONS } from './constants';
import { ModuleId, Message, ChatState, Attachment } from './types';
import { generateAuxiliumResponse, generateSpeech } from './services/gemini';

// Liste des formats supportés officiellement par Gemini pour éviter les erreurs 400
const SUPPORTED_MIME_TYPES = [
  'image/jpeg', 
  'image/png', 
  'image/webp', 
  'application/pdf', 
  'text/plain'
];

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<ModuleId>(ModuleId.SAVOIR);
  const [currentLanguage, setCurrentLanguage] = useState<string>('auto');
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isPlaying, setIsPlaying] = useState<string | null>(null);
  const [perfStats, setPerfStats] = useState({ latency: '0ms', tokens: 0, load: '2%' });
  
  const langKey = currentLanguage === 'auto' ? 'fr' : currentLanguage;
  const t = UI_TRANSLATIONS[langKey];
  const isRTL = currentLanguage === 'ar' || currentLanguage === 'darija';

  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: 'init-1',
        role: 'model',
        content: t.welcome,
        timestamp: Date.now(),
        moduleId: ModuleId.SAVOIR
      }
    ],
    isLoading: false,
    error: null
  });

  useEffect(() => {
    if (chatState.messages.length === 1 && chatState.messages[0].id === 'init-1') {
      setChatState(prev => ({
        ...prev,
        messages: [{
          ...prev.messages[0],
          content: t.welcome
        }]
      }));
    }
  }, [currentLanguage]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    const interval = setInterval(() => {
      setPerfStats(prev => ({
        ...prev,
        load: `${(Math.random() * 5 + 2).toFixed(1)}%`
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, [chatState.messages, chatState.isLoading]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        // Filtrage strict des types MIME
        if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
          console.warn(`Format non supporté : ${file.type}. Seuls JPG, PNG, WEBP, PDF et TXT sont acceptés.`);
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          const base64Data = result.split(',')[1];
          const isImage = file.type.startsWith('image/');
          
          setAttachments(prev => [...prev, {
            mimeType: file.type,
            data: base64Data,
            previewUrl: isImage ? result : undefined,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async () => {
    if ((!input.trim() && attachments.length === 0) || chatState.isLoading) return;

    const startTime = Date.now();
    let langInstruction = "";
    if (currentLanguage === 'darija') {
      langInstruction = "[PRIORITY_LANGUAGE: MOROCCAN_DARIJA] Réponds exclusivement en Darija marocaine.";
    } else if (currentLanguage !== 'auto') {
      langInstruction = `[PRIORITY_LANGUAGE: ${currentLanguage.toUpperCase()}]`;
    }

    const processedInput = langInstruction ? `${langInstruction}\n\n${input}` : input;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      moduleId: activeModule,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null
    }));
    
    const currentAttachments = [...attachments];
    setInput('');
    setAttachments([]);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      const history = chatState.messages.slice(-10);
      const response = await generateAuxiliumResponse(
        processedInput, 
        history, 
        activeModule,
        currentAttachments
      );

      const endTime = Date.now();
      const latency = endTime - startTime;
      
      setPerfStats(prev => ({
        ...prev,
        latency: `${latency}ms`,
        tokens: prev.tokens + Math.floor(response.text.length / 4)
      }));

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: response.text,
        attachments: response.attachments,
        timestamp: Date.now(),
        moduleId: activeModule
      };

      setChatState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false
      }));

    } catch (error: any) {
      setChatState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || "CRITICAL CORE ERROR."
      }));
    }
  };

  const handlePlayVoice = async (text: string, msgId: string) => {
    if (isPlaying === msgId) return;
    setIsPlaying(msgId);
    const base64Audio = await generateSpeech(text);
    if (!base64Audio) { setIsPlaying(null); return; }
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const dataInt16 = new Int16Array(bytes.buffer);
      const audioBuffer = ctx.createBuffer(1, dataInt16.length, 24000);
      const chData = audioBuffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        chData[i] = dataInt16[i] / 32768.0;
      }
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsPlaying(null);
      source.start();
    } catch (e) { 
      console.error("Audio playback error:", e);
      setIsPlaying(null); 
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }
  };

  const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const moduleDef = MODULE_DATA[activeModule];
  const moduleTrans = t.modules[activeModule];

  return (
    <div className={`flex flex-col md:flex-row h-screen w-screen overflow-hidden bg-[#020617] text-slate-100 font-sans selection:bg-cyan-500/30 ${isRTL ? 'rtl-layout' : ''}`}>
      
      <ModuleSelector 
        activeModule={activeModule} 
        onSelect={setActiveModule} 
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
      />

      <main className="flex-1 flex flex-col relative h-full overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
        
        {/* Superior Header */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-slate-800 bg-[#020617]/95 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <span className="text-3xl" style={{ color: moduleDef.color }}>
              <i className={moduleDef.icon}></i>
            </span>
            <div className="flex flex-col">
              <h1 className="font-display font-bold text-xl tracking-[0.25em] text-white uppercase leading-none">
                {moduleTrans.name}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                 <span className="text-[8px] font-mono text-cyan-400 tracking-widest uppercase">{t.synergyOS}</span>
                 <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                 <span className="text-[8px] font-mono text-slate-500 tracking-widest uppercase">{t.creator}: SELKANE_L</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 px-4 py-2 bg-black/30 border border-slate-800 rounded-lg">
             <div className="flex flex-col">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">{t.latency}</span>
                <span className="text-[10px] font-mono text-cyan-400">{perfStats.latency}</span>
             </div>
             <div className="flex flex-col border-l border-slate-800 px-4">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">{t.neuroLoad}</span>
                <span className="text-[10px] font-mono text-purple-400">{perfStats.load}</span>
             </div>
             <div className="flex flex-col border-l border-slate-800 px-4">
                <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">{t.polyglotSync}</span>
                <span className="text-[10px] font-mono text-green-400 uppercase">{currentLanguage === 'auto' ? 'Dynamic' : currentLanguage}</span>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor]`} style={{ color: moduleDef.color, backgroundColor: 'currentColor' }}></div>
            <span className="text-[9px] font-mono text-slate-500 tracking-[0.2em] hidden sm:inline uppercase">{t.universalMode}</span>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 relative scrollbar-hide">
          <div className="fixed inset-0 pointer-events-none z-0">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/carbon-fibre.png')` }}></div>
          </div>

          {chatState.messages.map((msg) => {
            const isMsgUser = msg.role === 'user';
            const moduleColor = msg.moduleId ? MODULE_DATA[msg.moduleId].color : moduleDef.color;
            
            return (
              <div key={msg.id} className={`flex w-full ${isMsgUser ? 'justify-end' : 'justify-start'} relative z-10 animate-fade-in-up`}>
                {!isMsgUser && (
                  <div className={`${isRTL ? 'ml-4' : 'mr-4'} mt-1 flex-shrink-0`}>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-900 border border-slate-700/50 shadow-xl relative overflow-hidden group">
                       <div className="absolute inset-0 opacity-10" style={{ backgroundColor: moduleColor }}></div>
                       <i className={`text-xl relative z-10 ${MODULE_DATA[msg.moduleId || activeModule].icon}`} style={{ color: moduleColor }}></i>
                    </div>
                  </div>
                )}
                
                <div className={`
                    max-w-[85%] md:max-w-[80%] rounded-3xl px-7 py-6 shadow-2xl backdrop-blur-md relative group
                    ${isMsgUser ? 'bg-slate-800/60 text-white border border-slate-700/50 rounded-br-none' : 'bg-slate-900/60 border border-slate-700/30 rounded-bl-none border-l-4'}
                  `}
                  style={!isMsgUser ? { borderLeftColor: moduleColor } : {}}
                >
                  {!isMsgUser && (
                    <button 
                      onClick={() => handlePlayVoice(msg.content, msg.id)}
                      className={`absolute ${isRTL ? '-left-14' : '-right-14'} top-2 p-3 rounded-2xl bg-slate-900/80 border border-slate-700/50 transition-all opacity-0 group-hover:opacity-100 ${isPlaying === msg.id ? 'text-cyan-400 opacity-100' : 'text-slate-500 hover:text-white'}`}
                    >
                      <i className={`fa-solid ${isPlaying === msg.id ? 'fa-waveform-lines animate-pulse' : 'fa-volume-high'}`}></i>
                    </button>
                  )}

                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {msg.attachments.map((att, idx) => (
                        <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-lg max-w-[200px]">
                          {att.previewUrl ? (
                            <img src={att.previewUrl} alt="content" className="max-w-full h-auto max-h-48 object-cover" />
                          ) : (
                            <div className="p-4 bg-slate-800 flex items-center gap-3">
                               <i className={`fa-solid ${att.mimeType.includes('pdf') ? 'fa-file-pdf text-red-400' : 'fa-file-lines text-blue-400'} text-2xl`}></i>
                               <span className="text-[10px] font-mono truncate max-w-[120px]">{att.name || 'document'}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {isMsgUser ? <div className="whitespace-pre-wrap leading-relaxed text-slate-100">{msg.content}</div> : <MarkdownRenderer content={msg.content} />}
                </div>

                {isMsgUser && (
                  <div className={`${isRTL ? 'mr-4' : 'ml-4'} mt-1 flex-shrink-0`}>
                    <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center shadow-lg">
                      <i className="fa-solid fa-circle-user text-xl text-slate-600"></i>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {chatState.isLoading && (
            <div className="flex justify-start relative z-10 animate-pulse">
               <div className="bg-slate-900/60 px-8 py-5 rounded-3xl rounded-bl-none flex flex-col gap-2 border border-slate-800 backdrop-blur-xl">
                 <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    <span className="text-[10px] font-mono text-cyan-400 ml-4 tracking-[0.3em] uppercase">{t.processing}</span>
                 </div>
               </div>
            </div>
          )}
          {chatState.error && (
            <div className="flex justify-center relative z-10">
               <div className="bg-red-500/10 border border-red-500/50 px-6 py-3 rounded-2xl flex items-center gap-3 text-red-400 font-mono text-xs uppercase tracking-widest animate-pulse">
                  <i className="fa-solid fa-triangle-exclamation"></i>
                  <span>{chatState.error}</span>
                  <button onClick={() => setChatState(p => ({...p, error: null}))} className="ml-4 hover:text-white">
                    <i className="fa-solid fa-xmark"></i>
                  </button>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 md:p-10 bg-[#020617]/95 backdrop-blur-2xl border-t border-slate-800/80 relative z-30">
          <div className="max-w-5xl mx-auto relative group">
            
            {attachments.length > 0 && (
              <div className={`absolute bottom-full ${isRTL ? 'right-0' : 'left-0'} mb-8 flex flex-wrap gap-4 p-4 bg-slate-900/90 rounded-2xl border border-slate-700/50 shadow-2xl animate-fade-in-up max-h-[300px] overflow-y-auto`}>
                 {attachments.map((att, index) => (
                   <div key={index} className="relative flex items-center gap-3 p-2 bg-slate-800 rounded-xl border border-slate-700 group/item">
                      {att.previewUrl ? (
                        <img src={att.previewUrl} alt="Preview" className="h-16 w-16 object-cover rounded-lg" />
                      ) : (
                        <div className="h-16 w-16 flex items-center justify-center bg-slate-700 rounded-lg">
                           <i className={`fa-solid ${att.mimeType.includes('pdf') ? 'fa-file-pdf text-red-400' : 'fa-file-lines text-blue-400'} text-xl`}></i>
                        </div>
                      )}
                      <div className="flex flex-col pr-8 max-w-[150px]">
                         <span className="text-[10px] font-bold text-white truncate">{att.name || 'file'}</span>
                         <span className="text-[8px] font-mono text-slate-500 uppercase">{att.mimeType.split('/')[1]}</span>
                      </div>
                      <button 
                        onClick={() => removeAttachment(index)} 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center border-2 border-slate-900 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <i className="fa-solid fa-times text-[10px]"></i>
                      </button>
                   </div>
                 ))}
              </div>
            )}

            <div className="relative flex items-end gap-4 bg-slate-900/95 rounded-2xl p-4 border border-slate-800/80 focus-within:border-slate-500/50 transition-all shadow-3xl">
              <button 
                onClick={() => fileInputRef.current?.click()} 
                className="p-4 text-slate-500 hover:text-cyan-400 rounded-xl transition-all"
                title="IMPORTER DES FICHIERS"
              >
                <i className="fa-solid fa-paperclip text-lg"></i>
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="image/jpeg,image/png,image/webp,application/pdf,text/plain" 
                multiple
                className="hidden" 
              />
              
              <textarea 
                ref={textareaRef} 
                value={input} 
                onChange={handleInputResize} 
                onKeyDown={handleKeyDown} 
                placeholder={t.commandPlaceholder} 
                rows={1} 
                className="w-full bg-transparent text-slate-100 placeholder-slate-700 text-base py-4 px-2 focus:outline-none resize-none max-h-[300px] scrollbar-hide font-medium tracking-wide leading-relaxed" 
              />
              
              <button 
                onClick={handleSendMessage} 
                disabled={(!input.trim() && attachments.length === 0) || chatState.isLoading} 
                className={`p-5 rounded-2xl transition-all ${(!input.trim() && attachments.length === 0) || chatState.isLoading ? 'text-slate-800' : 'text-white hover:scale-110 shadow-[0_0_30px_currentColor]'}`} 
                style={{ color: ((!input.trim() && attachments.length === 0) || chatState.isLoading) ? undefined : moduleDef.color }}
              >
                <i className={`fa-solid ${chatState.isLoading ? 'fa-spinner animate-spin' : 'fa-bolt-lightning'} text-xl`}></i>
              </button>
            </div>
          </div>
        </div>
      </main>
      
      <style>{`
        .animate-fade-in-up { animation: fade-in-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes fade-in-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { display: none; }
        .rtl-layout { flex-direction: row-reverse !important; }
      `}</style>
    </div>
  );
};

export default App;
