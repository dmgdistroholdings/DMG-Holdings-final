
import React, { useState, useRef, useEffect } from 'react';
import { RosterItem, SiteTheme } from '../types';
import ArtistDetailModal from './ArtistDetailModal';

const RosterSection: React.FC<{ data: RosterItem[]; theme: SiteTheme }> = ({ data, theme }) => {
  const [selectedArtist, setSelectedArtist] = useState<RosterItem | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Lazy load images when they enter viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const container = entry.target as HTMLElement;
            const artistId = container.dataset.artistId;
            if (artistId && !loadedImages.has(artistId)) {
              setLoadedImages(prev => new Set(prev).add(artistId));
            }
          }
        });
      },
      { rootMargin: '100px' }
    );

    // Observe all artist containers
    const containers = document.querySelectorAll('[data-artist-id]');
    containers.forEach((container) => {
      observer.observe(container);
    });

    return () => {
      containers.forEach((container) => {
        observer.unobserve(container);
      });
    };
  }, [data.length]);

  return (
    <>
      <section id="roster" className="py-24 md:py-40 relative overflow-hidden" style={{ background: theme.background }}>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-xs uppercase tracking-[0.5em] text-zinc-500 font-black mb-4 px-1">Global Network</h2>
              <h3 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.8]">
                The <span className="text-zinc-600 italic font-light not-italic">Roster</span>
              </h3>
            </div>
            <p className="text-zinc-500 text-lg max-w-sm font-light leading-relaxed border-l border-white/10 pl-6">
              Immediate access to the elite creative class driving our distribution ecosystem and management divisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {data.map((artist) => {
              const shouldLoadImage = loadedImages.has(artist.id);
              return (
                <div 
                  key={artist.id} 
                  data-artist-id={artist.id}
                  onClick={() => setSelectedArtist(artist)}
                  className="group relative overflow-hidden aspect-[3/4] rounded-[2rem] border border-white/5 bg-zinc-900/40 backdrop-blur-sm shadow-2xl transition-all duration-700 hover:border-white/20 cursor-pointer"
                >
                  <div className="dmg-img-container h-full">
                    {artist.image && shouldLoadImage ? (
                      <img 
                        src={artist.image} 
                        alt={artist.name} 
                        className="transition-transform duration-[2s] group-hover:scale-110 grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-950 flex items-center justify-center italic text-zinc-800 font-black text-8xl select-none">
                        {artist.name.charAt(0)}
                      </div>
                    )}
                  </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 transition-opacity"></div>
                
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full transform transition-all duration-500">
                  <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-4">
                    {artist.role}
                  </div>
                  <h4 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter italic uppercase text-white leading-none">
                    {artist.name}
                  </h4>
                  <div className="mt-4 text-zinc-400 text-xs uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to view bio →
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[20vw] font-black text-white/[0.01] uppercase pointer-events-none select-none italic whitespace-nowrap">
          Institutional Excellence
        </div>
      </section>

      {selectedArtist && (
        <ArtistDetailModal 
          artist={selectedArtist} 
          theme={theme} 
          onClose={() => setSelectedArtist(null)} 
        />
      )}
    </>
  );
};

export default RosterSection;
