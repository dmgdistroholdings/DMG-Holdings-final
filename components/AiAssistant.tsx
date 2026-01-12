
import React, { useState, useRef, useEffect } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the DMG Strategic Intelligence Portal. I am the Chief Strategy Officer AI. How can I assist you with your inquiries regarding our holding operations, market position, or artist ecosystem today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const aiResponse = await getGeminiResponse(userMessage);
    setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <section id="ai-assistant" className="py-24 bg-[#0a0a0a] border-y border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-500 font-bold mb-4">Strategic Intelligence</h2>
          <h3 className="text-4xl font-black mb-4 uppercase italic">Executive <span className="text-red-600 not-italic font-light">Insights</span></h3>
          <p className="text-zinc-500 max-w-lg mx-auto font-light text-sm">
            Consult with our high-fidelity intelligence engine regarding DMG Distribution Holdings' global strategy and operational philosophy.
          </p>
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col h-[600px] relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-600/20"></div>
          
          {/* Chat header */}
          <div className="p-5 border-b border-white/5 bg-white/5 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.8)]"></div>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">DMG CSO CORE</span>
            </div>
            <span className="text-[8px] text-zinc-600 font-mono tracking-widest">PROTOCOL: ACTIVE_SYNC_2.5</span>
          </div>

          {/* Chat messages */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide bg-zinc-950/20"
          >
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-6 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap shadow-xl ${
                  msg.role === 'user' 
                    ? 'bg-red-600 text-white font-bold rounded-tr-none' 
                    : 'bg-zinc-900/80 border border-white/5 text-zinc-300 rounded-tl-none font-light italic'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl rounded-tl-none flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">Synthesizing Executive Brief...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat input */}
          <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-black/60 backdrop-blur-xl">
            <div className="flex gap-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Inquire about our holding structure..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-5 text-sm focus:outline-none focus:border-red-600/50 transition-all placeholder:text-zinc-800 text-white font-light"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-white text-black px-10 py-5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95 disabled:opacity-20 shadow-2xl"
              >
                Execute
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AiAssistant;
