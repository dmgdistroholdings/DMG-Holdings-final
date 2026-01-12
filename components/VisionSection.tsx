
import React from 'react';
import { SiteTheme } from '../types';

interface VisionProps {
  data: { title: string; paragraphs: string[]; image: string };
  theme: SiteTheme;
}

const VisionSection: React.FC<VisionProps> = ({ data, theme }) => {
  return (
    <section id="vision" className="py-24 md:py-48 relative overflow-hidden" style={{ background: theme.surface }}>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-24 items-center">
          <div>
            <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-500 font-bold mb-6">Founding Principles</h2>
            <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-10 leading-none">
              {data.title.split(' ').map((word, i) => (
                <span key={i} className={i === data.title.split(' ').length - 1 ? "italic font-display text-zinc-500" : ""}>{word} </span>
              ))}
            </h3>
            
            <div className="space-y-8 text-zinc-400 text-xl leading-relaxed font-light">
              {data.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            <div className="mt-16 grid grid-cols-2 gap-12">
              <div className="border-l border-white/10 pl-6">
                <div className="text-4xl font-black text-white mb-2 tracking-tighter">GLOBAL</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Reach Potential</div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="text-4xl font-black text-white mb-2 tracking-tighter">100%</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Ownership</div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden glass-panel p-4 shadow-2xl">
              {data.image ? (
                <img 
                  src={data.image} 
                  alt="Vision Visual" 
                  className="w-full h-full object-cover rounded-2xl transition-all duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-black/20 rounded-2xl flex items-center justify-center italic text-zinc-800">Vision Placeholder</div>
              )}
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 border-t border-r border-white/10 -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 border-b border-l border-white/10 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
