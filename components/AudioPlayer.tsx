
import React, { useState, useRef, useEffect } from 'react';
import { AudioTrack, SiteTheme } from '../types';

interface AudioPlayerProps {
  catalog: AudioTrack[];
  spotifyPlaylistId?: string;
  activeAudioSource?: 'archive' | 'stream';
  theme: SiteTheme;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ catalog, spotifyPlaylistId, activeAudioSource = 'archive', theme }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showMetadata, setShowMetadata] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = catalog[currentIndex];

  useEffect(() => {
    if (activeAudioSource === 'archive' && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.warn("Playback prevented:", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex, activeAudioSource]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleEnded = () => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else {
      skipForward();
    }
  };

  const skipForward = () => {
    setCurrentIndex((prev) => (prev + 1) % catalog.length);
  };

  const skipBack = () => {
    setCurrentIndex((prev) => (prev - 1 + catalog.length) % catalog.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    if (audioRef.current) audioRef.current.currentTime = pct * audioRef.current.duration;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[150] p-2 md:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className="glass-panel border border-white/10 rounded-2xl md:rounded-full overflow-hidden shadow-2xl backdrop-blur-2xl transition-all duration-500">
          
          <div className="flex flex-col md:flex-row">
            <div className="hidden md:flex items-center justify-center p-4 bg-white/5 border-r border-white/10">
              <div className="w-6 h-6 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-[10px]">D</span>
              </div>
            </div>

            <div className="flex-1">
              {activeAudioSource === 'archive' ? (
                <div className="relative">
                  <div 
                    className="absolute top-0 left-0 right-0 h-0.5 md:hidden bg-white/5 cursor-pointer"
                    onClick={seek}
                  >
                    <div 
                      className="h-full bg-white transition-all duration-100"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="px-3 py-2 md:px-6 md:py-4 flex items-center justify-between md:justify-start gap-3 md:gap-8 h-[60px] md:h-auto">
                    {currentTrack ? (
                      <>
                        <audio 
                          ref={audioRef}
                          src={currentTrack.url}
                          onTimeUpdate={handleTimeUpdate}
                          onEnded={handleEnded}
                        />

                        <div className="flex items-center gap-3 min-w-0 flex-1 md:flex-none md:min-w-[200px]">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                             <div className={`w-0.5 h-3 md:w-1 md:h-4 bg-white/40 rounded-full transition-all duration-300 ${isPlaying ? 'animate-[bounce_0.6s_infinite]' : ''}`}></div>
                             <div className={`w-0.5 h-4 md:w-1 md:h-6 bg-white/60 rounded-full mx-0.5 md:mx-1 transition-all duration-300 ${isPlaying ? 'animate-[bounce_0.8s_infinite]' : ''}`}></div>
                             <div className={`w-0.5 h-3 md:w-1 md:h-4 bg-white/40 rounded-full transition-all duration-300 ${isPlaying ? 'animate-[bounce_0.7s_infinite]' : ''}`}></div>
                          </div>
                          <div className="overflow-hidden flex-1 min-w-0 cursor-pointer" onClick={() => setShowMetadata(!showMetadata)} title="Click to view metadata">
                            <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-white truncate">{currentTrack.title}</h4>
                            <p className="text-[8px] md:text-[9px] uppercase tracking-tighter text-zinc-500 font-bold truncate">{currentTrack.artist}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-5 shrink-0">
                          <button 
                            onClick={toggleLoop} 
                            className={`transition-colors p-1 rounded-md ${isLooping ? 'text-red-500 bg-red-500/10' : 'text-zinc-600 hover:text-white'}`}
                            title={isLooping ? "Disable Loop" : "Enable Loop"}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                          
                          <button onClick={skipBack} className="text-zinc-500 hover:text-white transition-colors hidden md:block">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 6h2v12H6zm3.5 6L18 6v12z"/></svg>
                          </button>
                          
                          <button 
                            onClick={togglePlay}
                            className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
                          >
                            {isPlaying ? (
                              <svg className="w-3 h-3 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                            ) : (
                              <svg className="w-3 h-3 md:w-4 md:h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                            )}
                          </button>
                          
                          <button onClick={skipForward} className="text-zinc-500 hover:text-white transition-colors">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                          </button>
                        </div>

                        <div className="hidden md:flex flex-1 items-center gap-4">
                           <span className="text-[8px] font-mono text-zinc-600">
                             {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) + ":" + ("0" + Math.floor(audioRef.current.currentTime % 60)).slice(-2) : "0:00"}
                           </span>
                           <div className="flex-1 h-1 bg-white/5 rounded-full relative overflow-hidden group cursor-pointer" onClick={seek}>
                             <div className="absolute inset-0 bg-white/20 group-hover:bg-white/40 transition-colors"></div>
                             <div 
                               className="absolute inset-y-0 left-0 bg-white transition-all duration-100"
                               style={{ width: `${progress}%` }}
                             ></div>
                           </div>
                           <span className="text-[8px] font-mono text-zinc-600">
                             {audioRef.current && isFinite(audioRef.current.duration) ? Math.floor(audioRef.current.duration / 60) + ":" + ("0" + Math.floor(audioRef.current.duration % 60)).slice(-2) : "0:00"}
                           </span>
                        </div>
                      </>
                    ) : (
                      <div className="text-[10px] uppercase font-black tracking-widest text-zinc-600 px-6">System Archive Restricted</div>
                    )}
                  </div>
                  
                  {/* Metadata Panel */}
                  {showMetadata && currentTrack && (
                    <div className="border-t border-white/10 bg-black/60 backdrop-blur-xl p-4 md:p-6 space-y-4 animate-in slide-in-from-bottom-2">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="text-[10px] uppercase font-black tracking-widest text-zinc-500">Track Metadata</h5>
                        <button onClick={() => setShowMetadata(false)} className="text-zinc-600 hover:text-white transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {currentTrack.isrc && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">ISRC</label>
                            <p className="text-[9px] font-mono text-white">{currentTrack.isrc}</p>
                          </div>
                        )}
                        {currentTrack.upc && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">UPC</label>
                            <p className="text-[9px] font-mono text-white">{currentTrack.upc}</p>
                          </div>
                        )}
                        {currentTrack.label && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Label</label>
                            <p className="text-[9px] text-white">{currentTrack.label}</p>
                          </div>
                        )}
                        {currentTrack.publisher && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Publisher</label>
                            <p className="text-[9px] text-white">{currentTrack.publisher}</p>
                          </div>
                        )}
                        {currentTrack.releaseTitle && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Release</label>
                            <p className="text-[9px] text-white">{currentTrack.releaseTitle}</p>
                          </div>
                        )}
                        {currentTrack.releaseDate && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Release Date</label>
                            <p className="text-[9px] text-white">{currentTrack.releaseDate}</p>
                          </div>
                        )}
                        {currentTrack.catalogNumber && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Catalog #</label>
                            <p className="text-[9px] font-mono text-white">{currentTrack.catalogNumber}</p>
                          </div>
                        )}
                        {currentTrack.genre && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Genre</label>
                            <p className="text-[9px] text-white">{currentTrack.genre}</p>
                          </div>
                        )}
                        {currentTrack.explicit && (
                          <div>
                            <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Content</label>
                            <p className="text-[9px] text-red-500 font-bold">Explicit</p>
                          </div>
                        )}
                      </div>
                      
                      {(currentTrack.territories || currentTrack.publishingSplits) && (
                        <div className="space-y-3 pt-3 border-t border-white/5">
                          {currentTrack.territories && (
                            <div>
                              <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Territories / Rights</label>
                              <p className="text-[9px] text-zinc-400 leading-relaxed">{currentTrack.territories}</p>
                            </div>
                          )}
                          {currentTrack.publishingSplits && (
                            <div>
                              <label className="text-[8px] uppercase font-bold text-zinc-600 tracking-widest block mb-1">Publishing Splits</label>
                              <p className="text-[9px] text-zinc-400 leading-relaxed">{currentTrack.publishingSplits}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-[60px] md:h-[80px] w-full bg-black overflow-hidden relative">
                  <div className="absolute inset-0 z-10 pointer-events-none border-x-4 border-black"></div>
                  <iframe 
                    src={`https://open.spotify.com/embed/playlist/${spotifyPlaylistId}?utm_source=generator&theme=0`} 
                    width="100%" 
                    height="100%" 
                    frameBorder="0" 
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                    loading="lazy"
                    className="absolute inset-0 grayscale contrast-150 opacity-90 hover:opacity-100 transition-all duration-500"
                  ></iframe>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-4 shrink-0 px-6 bg-white/5 border-l border-white/10">
                 <span className="text-[9px] uppercase font-black text-zinc-500 tracking-[0.2em]">{activeAudioSource === 'archive' ? 'DMG Archive' : 'Global Stream'}</span>
                 <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${activeAudioSource === 'archive' ? 'bg-blue-500' : 'bg-white'}`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
