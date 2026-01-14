
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (password: string) => boolean;
  onClose: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onClose }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [resetting, setResetting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(password)) {
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  const resetLocalState = async () => {
    setResetting(true);
    try {
      // Clears local admin/site config stored in IndexedDB so you can fall back to published `/site_data.json` or defaults.
      await new Promise<void>((resolve) => {
        const req = indexedDB.deleteDatabase("DMG_Ecosystem_DB");
        req.onsuccess = () => resolve();
        req.onerror = () => resolve();
        req.onblocked = () => resolve();
      });
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-6">
      <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-white flex items-center justify-center rounded-sm mx-auto mb-6">
            <span className="text-black font-black text-lg">D</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase">Admin Authentication</h2>
          <p className="text-xs text-zinc-500 mt-2 uppercase tracking-widest">DMG Distribution Holdings // Secure Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-zinc-400 tracking-widest block">Access Key</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-white/10'} p-4 text-sm rounded-xl focus:outline-none focus:border-white transition-all text-white`}
              placeholder="••••••••"
              autoFocus
            />
            {error && <p className="text-[10px] text-red-500 uppercase font-bold tracking-wider">Invalid credentials. Access denied.</p>}
          </div>

          <button 
            type="submit"
            className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
          >
            Authorize Session
          </button>
        </form>

        <div className="mt-8 space-y-4">
          <p className="text-center text-[9px] text-zinc-600 uppercase tracking-widest">
            Default Password: admin
          </p>
          <button
            type="button"
            onClick={resetLocalState}
            disabled={resetting}
            className="w-full py-3 bg-red-600/10 text-red-400 border border-red-600/20 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
          >
            {resetting ? "Resetting..." : "Reset Local Admin Data"}
          </button>
          <p className="text-center text-[9px] text-zinc-600 leading-relaxed">
            Use this if your admin password/state changed on one device and you need to recover access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
