
import React from 'react';
import { EnterpriseSection, SiteTheme } from '../types';

interface PortfolioProps {
  sections: EnterpriseSection[];
  theme: SiteTheme;
  onOpenInquiry: () => void;
}

const PortfolioSection: React.FC<PortfolioProps> = ({ sections, theme, onOpenInquiry }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <section id="portfolio" className="py-24 md:py-40" style={{ background: theme.background }}>
      <div className="max-w-7xl mx-auto px-6">
        {sections.map((section) => (
          <div key={section.id} className="mb-32 last:mb-0">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-500 font-bold mb-4">{section.title}</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed text-lg px-4">
                {section.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {section.items.map((company) => (
                <div key={company.id} className="group relative glass-panel p-8 md:p-12 rounded-[2rem] transition-all duration-500 hover:bg-white/[0.04] border border-white/5 flex flex-col h-full">
                  <div className="aspect-video mb-10 overflow-hidden rounded-2xl border border-white/10 shadow-inner bg-zinc-900/50 dmg-img-container relative">
                    {company.image ? (
                      <img 
                        src={company.image} 
                        alt={company.name} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center italic text-zinc-800 font-black text-4xl select-none">
                        DMG
                      </div>
                    )}
                    <div className="absolute top-4 right-4 w-2 h-2 bg-red-600 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                  </div>
                  
                  <div className="inline-block px-3 py-1 bg-white/5 rounded-full mb-4 w-fit border border-white/5">
                    <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-black">
                      {company.category}
                    </span>
                  </div>
                  <h4 className="text-4xl md:text-5xl font-black mb-6 tracking-tighter text-white italic uppercase">{company.name}</h4>
                  <p className="text-zinc-400 text-lg leading-relaxed mb-8 font-light">
                    {company.description}
                  </p>

                  <div className="mt-auto pt-8 border-t border-white/5">
                    {company.features && company.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-10">
                        {company.features.map((feature, i) => (
                          <span key={i} className="px-4 py-1.5 bg-zinc-900/50 border border-white/5 text-[9px] uppercase tracking-wider text-zinc-600 rounded-lg font-black">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <button 
                      onClick={onOpenInquiry}
                      className="inline-flex items-center gap-4 text-xs font-black uppercase tracking-[0.3em] text-white hover:text-red-500 transition-colors group/btn"
                    >
                      Strategic Inquiry
                      <svg className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PortfolioSection;
