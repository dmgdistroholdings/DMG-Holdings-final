
import React from 'react';
import { SiteTheme } from '../types';

interface HeroProps {
  data: { title: string; subtitle: string; image: string; badge: string };
  theme: SiteTheme;
  onOpenInquiry: () => void;
}

const Hero: React.FC<HeroProps> = ({ data, theme, onOpenInquiry }) => {
  const scrollToRoster = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('roster');
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-32 pb-20">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        {data.image ? (
          <img 
            src={data.image} 
            alt="DMG Visual Identity" 
            className="w-full h-full object-cover object-center opacity-70 transition-opacity duration-1000 grayscale-[0.2] contrast-[1.2]"
          />
        ) : (
          <div className="w-full h-full bg-zinc-950 flex items-center justify-center">
            <span className="text-zinc-900 text-[30vw] font-black select-none pointer-events-none opacity-20">DMG</span>
          </div>
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 0%, ${theme.background} 100%)` }}></div>
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="inline-block px-4 py-2 border border-red-600/30 bg-red-600/5 backdrop-blur-xl rounded-full mb-8">
          <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-zinc-300 font-black flex items-center gap-3">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            {data.badge}
          </span>
        </div>
        
        <h1 className="text-5xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 leading-[0.85] uppercase italic drop-shadow-2xl">
          {data.title.split(' ').map((word, i) => (
            <span key={i} className={i % 2 !== 0 ? "text-red-600 not-italic font-light block md:inline" : "text-white block md:inline"}>{word} </span>
          ))}
        </h1>
        
        <p className="max-w-2xl mx-auto text-lg md:text-2xl text-zinc-300 mb-12 leading-relaxed font-light drop-shadow-md px-4">
          {data.subtitle}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 px-4">
          <button 
            onClick={onOpenInquiry}
            className="w-full sm:w-auto px-12 py-5 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:bg-white hover:text-black transition-all transform active:scale-95 shadow-[0_0_30px_rgba(220,38,38,0.2)]"
          >
            Strategic Inquiry
          </button>
          <button 
            onClick={scrollToRoster}
            className="w-full sm:w-auto px-12 py-5 bg-transparent border border-zinc-700 text-white font-black uppercase tracking-widest text-xs rounded-sm hover:border-red-600 transition-all backdrop-blur-sm active:scale-95"
          >
            Explore Roster
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
