
import React from 'react';
import { CustomSection, SiteTheme } from '../types';

interface CustomSectionsProps {
  sections: CustomSection[];
  theme: SiteTheme;
}

const CustomSections: React.FC<CustomSectionsProps> = ({ sections, theme }) => {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      {sections.map((section) => (
        <section 
          key={section.id} 
          className="py-24 md:py-40 border-t border-white/5" 
          style={{ background: theme.background }}
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-12 uppercase italic">
                {section.title}
              </h2>
              <div className="text-zinc-400 text-xl leading-relaxed font-light whitespace-pre-wrap">
                {section.content}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
};

export default CustomSections;
