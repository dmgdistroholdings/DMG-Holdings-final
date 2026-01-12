
import React, { useState } from 'react';
import { getGeminiResponse } from '../services/geminiService';
import { SiteTheme } from '../types';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: SiteTheme;
}

const InquiryModal: React.FC<InquiryModalProps> = ({ isOpen, onClose, theme }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    sector: 'Distribution',
    message: ''
  });
  const [isRefining, setIsRefining] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  if (!isOpen) return null;

  const handleRefine = async () => {
    if (!formData.message.trim()) return;
    setIsRefining(true);
    const prompt = `As the CSO of DMG Holdings, rewrite this raw inquiry to be highly professional, executive-ready, and strategically sound. Keep the original intent but improve the tone and vocabulary: "${formData.message}"`;
    const refined = await getGeminiResponse(prompt);
    setFormData(prev => ({ ...prev, message: refined }));
    setIsRefining(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[STRATEGIC INQUIRY] - ${formData.sector} - ${formData.company}`);
    const body = encodeURIComponent(
      `From: ${formData.name}\n` +
      `Company: ${formData.company}\n` +
      `Sector: ${formData.sector}\n\n` +
      `Message:\n${formData.message}`
    );
    window.location.href = `mailto:Contact@dmgdistributionholdings.com?subject=${subject}&body=${body}`;
    setStatus('success');
    
    // Smooth scroll to top when submission protocol is initiated
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
      onClose();
      setStatus('idle');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-500"
        onClick={onClose}
      ></div>
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
        {/* Progress Bar */}
        {isRefining && <div className="absolute top-0 left-0 h-1 bg-white animate-pulse w-full"></div>}

        <div className="p-8 md:p-12">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Strategic <span className="text-zinc-500">Inquiry</span></h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 font-bold">DMG Distribution Holdings // Secure Channel</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {status === 'success' ? (
            <div className="py-20 text-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(255,255,255,0.2)]">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-2xl font-bold italic mb-2">Handoff Complete</h3>
              <p className="text-zinc-500 uppercase text-[10px] tracking-widest font-black">Opening Secure Mail Client...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Full Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm rounded-xl focus:outline-none focus:border-white transition-all"
                    placeholder="Executive Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Company / Entity</label>
                  <input 
                    required
                    value={formData.company}
                    onChange={e => setFormData({...formData, company: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 p-4 text-sm rounded-xl focus:outline-none focus:border-white transition-all"
                    placeholder="Global Organization"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Primary Sector</label>
                <div className="flex flex-wrap gap-2">
                  {['Distribution', 'Management', 'Capital', 'Technology'].map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFormData({...formData, sector: s})}
                      className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border transition-all ${
                        formData.sector === s ? 'bg-white text-black border-white' : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 relative">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Detailed Proposal</label>
                  <button
                    type="button"
                    onClick={handleRefine}
                    disabled={isRefining || !formData.message}
                    className="text-[9px] uppercase font-black text-zinc-400 hover:text-white flex items-center gap-2 group disabled:opacity-30"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                    Gemini Smart Refine
                  </button>
                </div>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 p-4 text-sm rounded-xl focus:outline-none focus:border-white transition-all resize-none font-light leading-relaxed"
                  placeholder="Outline your strategic intent..."
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-white text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-zinc-200 transition-all shadow-xl active:scale-[0.98]"
              >
                Dispatch Inquiry
              </button>
              <p className="text-[9px] text-zinc-700 uppercase tracking-widest text-center">
                Protocol: Secure Mailto Relay // Direct Corporate Channel
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
