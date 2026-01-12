
import React from 'react';
import { SiteTheme } from '../types';

interface FooterProps {
  theme: SiteTheme;
  isAdmin: boolean;
  onOpenAdmin: () => void;
  onExitAdmin: () => void;
  onOpenInquiry: () => void;
}

const Footer: React.FC<FooterProps> = ({ theme, isAdmin, onOpenAdmin, onExitAdmin, onOpenInquiry }) => {
  return (
    <footer id="contact" className="pt-24 pb-40 md:pb-48 border-t border-white/5" style={{ background: theme.background }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-white flex items-center justify-center rounded-sm">
                <span className="text-black font-black text-xs">DMG</span>
              </div>
              <span className="font-bold tracking-tighter text-2xl">
                DMG <span className="font-light" style={{ color: theme.accent }}>HOLDINGS</span>
              </span>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed font-light text-sm">
              Architecting the sustainable future of independent creative enterprise through distribution and management synergy.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Holdings</h4>
            <ul className="space-y-4 text-zinc-600 text-xs font-bold">
              <li><a href="#portfolio" className="hover:text-white transition-colors uppercase">DMG Distributions</a></li>
              <li><a href="#portfolio" className="hover:text-white transition-colors uppercase">DMG Management</a></li>
              <li><a href="#roster" className="hover:text-white transition-colors uppercase">Global Roster</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Inquiries</h4>
            <ul className="space-y-4 text-zinc-600 text-xs font-bold uppercase">
              <li>
                <button onClick={onOpenInquiry} className="hover:text-white transition-colors truncate block text-left">
                  Contact@dmgdistributionholdings.com
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenInquiry}
                  className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors"
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Inquiry Portal Active
                </button>
              </li>
              <li>
                <button 
                  onClick={isAdmin ? onExitAdmin : onOpenAdmin}
                  className="hover:text-white transition-colors uppercase text-left group flex items-center gap-2"
                >
                  <span className={`w-1 h-1 rounded-full ${isAdmin ? 'bg-red-500' : 'bg-zinc-800'}`}></span>
                  {isAdmin ? 'Exit CMS' : 'Admin'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-zinc-700 text-[10px] uppercase tracking-[0.4em] font-black text-center md:text-left">
            © {new Date().getFullYear()} DMG DISTRIBUTION HOLDINGS. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8">
             <a href="#vision" className="text-[10px] uppercase tracking-widest text-zinc-700 hover:text-zinc-400">Privacy Protocol</a>
             <a href="#vision" className="text-[10px] uppercase tracking-widest text-zinc-700 hover:text-zinc-400">Governance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
