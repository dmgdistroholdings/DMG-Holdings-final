import React from 'react';
import { RosterItem, SiteTheme } from '../types';

interface ArtistDetailModalProps {
  artist: RosterItem | null;
  theme: SiteTheme;
  onClose: () => void;
}

const ArtistDetailModal: React.FC<ArtistDetailModalProps> = ({ artist, theme, onClose }) => {
  if (!artist) return null;

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all text-white hover:text-red-600"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative aspect-[3/4] md:aspect-auto md:h-full min-h-[400px] bg-zinc-900">
            {artist.image ? (
              <img 
                src={artist.image} 
                alt={artist.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center italic text-zinc-800 font-black text-9xl select-none">
                {artist.name.charAt(0)}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Bio Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <div className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-black mb-4">
                {artist.role}
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter italic uppercase text-white leading-none mb-6">
                {artist.name}
              </h2>
            </div>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-zinc-300 text-base md:text-lg leading-relaxed font-light">
                {artist.description || 'No biography available.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistDetailModal;
