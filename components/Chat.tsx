import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { getAquaAssistantResponse } from '../services/gemini';

const Chat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Systems initialized. I am AI Aqua. How can I assist with your environmental analysis or lake registry queries today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await getAquaAssistantResponse(messages, input);
    
    setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-0 right-0 p-4 md:p-8 z-[2000] flex flex-col items-end gap-6 pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto w-[360px] md:w-[420px] h-[600px] bg-white rounded-[2.5rem] shadow-[0_30px_100px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden border border-slate-100 animate-in slide-in-from-bottom-12 duration-500 ease-out">
          {/* Professional Header */}
          <div className="bg-slate-900 p-6 text-white flex items-center justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Bot size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight">AI Aqua Intelligence</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  <p className="text-[10px] text-blue-200 uppercase tracking-widest font-black">Online Context Engine</p>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-all active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conversation Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 custom-scrollbar">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`flex gap-3 max-w-[88%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-slate-100 text-slate-400'}`}>
                    {m.role === 'user' ? <User size={18} strokeWidth={2.5} /> : <Bot size={18} strokeWidth={2.5} />}
                  </div>
                  <div className={`p-4 rounded-[1.5rem] text-sm font-medium leading-relaxed ${
                    m.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-100' 
                      : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-100">
            <div className="relative flex gap-3 items-center">
              <input
                type="text"
                className="flex-1 bg-slate-50 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-4 focus:ring-blue-600/5 focus:bg-white focus:border-blue-200 border border-transparent transition-all"
                placeholder="Query environmental data..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-slate-900 text-white w-14 h-14 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xl active:scale-95 group"
              >
                <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-20 h-20 bg-slate-900 text-white rounded-[2rem] flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:bg-blue-600 hover:scale-110 transition-all active:scale-90 group relative"
      >
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-blue-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black shadow-lg">
          <Sparkles size={12} className="text-white fill-white" />
        </div>
        <MessageCircle size={36} className="group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default Chat;