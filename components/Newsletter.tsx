
import React, { useState } from 'react';
import { SiteTheme } from '../types';

interface NewsletterProps {
  data: { title?: string; subtitle?: string; buttonText?: string; image?: string; subscribers?: Array<{ name: string; email: string; timestamp: number }> };
  theme: SiteTheme;
  onSubscriberAdd?: (name: string, email: string) => void;
}

const Newsletter: React.FC<NewsletterProps> = ({ data, theme, onSubscriberAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Provide fallback values for all fields
  const title = data.title || "Strategic Intelligence";
  const subtitle = data.subtitle || "Subscribe for quarterly industry insights.";
  const buttonText = data.buttonText || "Join Intelligence";
  const image = data.image || "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && name.trim()) {
      if (onSubscriberAdd) {
        onSubscriberAdd(name.trim(), email.trim());
      }
      setSubscribed(true);
      setName('');
      setEmail('');
    }
  };

  return (
    <section className="py-32 md:py-48 relative overflow-hidden" style={{ background: theme.surface }}>
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
        <div className="absolute right-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="relative group">
          {/* HUD Corner Accents */}
          <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-white/20 rounded-tl-xl transition-all duration-700 group-hover:w-16 group-hover:h-16 group-hover:border-white/40 z-20"></div>
          <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-white/20 rounded-br-xl transition-all duration-700 group-hover:w-16 group-hover:h-16 group-hover:border-white/40 z-20"></div>

          <div className="glass-panel rounded-[2rem] border border-white/10 overflow-hidden relative min-h-[500px] flex items-stretch">
            {/* Background Image Layer */}
            {image && (
              <div className="absolute inset-0 z-0">
                <img 
                  src={image} 
                  alt="Newsletter Visual" 
                  loading="lazy"
                  className="w-full h-full object-cover opacity-30 grayscale contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              </div>
            )}

            <div className="relative z-10 p-6 sm:p-12 md:p-24 grid lg:grid-cols-2 gap-8 md:gap-16 items-center w-full">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 mb-8 bg-white/5 px-4 py-1.5 rounded-full border border-white/10 mx-auto lg:mx-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-pulse"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400">Quarterly Briefing</span>
                </div>
                
                <h2 className="text-3xl sm:text-5xl md:text-7xl font-black italic uppercase tracking-tighter mb-6 md:mb-8 leading-[0.9]">
                  {title.split(' ').map((word, i) => (
                    <span key={i} className={i % 2 !== 0 ? "text-zinc-500 font-light not-italic" : "text-white"}>{word} </span>
                  ))}
                </h2>
                
                <p className="text-zinc-400 max-w-md mx-auto lg:mx-0 text-lg font-light leading-relaxed mb-0">
                  {subtitle}
                </p>
              </div>

              <div className="relative">
                {!subscribed ? (
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
                    <div className="relative">
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 backdrop-blur-md"
                        placeholder="Full Name"
                      />
                    </div>
                    <div className="relative">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-8 py-6 text-sm focus:outline-none focus:border-white focus:ring-1 focus:ring-white/20 transition-all text-white placeholder:text-zinc-700 backdrop-blur-md"
                        placeholder="Contact@dmgdistributionholdings.com"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                    </div>
                    
                    <button 
                      type="submit"
                      className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl hover:bg-zinc-200 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] group"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        {buttonText}
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                    
                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest text-center mt-6">
                      Secure transmission protocol // 256-bit encryption
                    </p>
                  </form>
                ) : (
                  <div className="py-12 px-10 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl text-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-black uppercase italic mb-2 tracking-tight">Access Granted</h4>
                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">
                      Transmission successful. Check your secure inbox.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Dynamic blurred circles for atmospheric depth */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-zinc-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>
    </section>
  );
};

export default Newsletter;
