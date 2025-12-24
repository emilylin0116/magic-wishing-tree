import React, { useState } from 'react';
import { Send, Sparkles, MousePointer2, Hand, RotateCcw } from 'lucide-react';

interface Props {
  onWish: (text: string) => void;
  onReset: () => void;
  bursting: boolean;
  showPunchline: boolean;
}

export const UIOverlay: React.FC<Props> = ({ onWish, onReset, bursting, showPunchline }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onWish(inputValue);
      setInputValue('');
    }
  };

  // 定義一個強制白色的樣式
  const whiteText = { color: '#FFFFFF', textShadow: '0 0 10px rgba(255,255,255,0.5)' };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col font-sans select-none">
      {/* Main Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center w-full px-4">
        <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-yellow-200 to-green-300 drop-shadow-[0_0_30px_rgba(255,182,193,0.8)] italic tracking-tighter uppercase">
          Magic Wishing Tree
        </h1>
      </div>

      {/* English Interaction Guide */}
      <div className="absolute top-28 left-10 pointer-events-auto max-w-[240px]">
        <div className="bg-black/60 backdrop-blur-3xl border border-white/30 p-6 rounded-[2.5rem] shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-white/20 pb-2">
            <Sparkles size={14} color="#FFD700" />
            <span style={{ color: '#FFD700', fontWeight: 'bold', fontSize: '12px', letterSpacing: '0.2em' }}>HOW TO INTERACT</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-[11px] uppercase tracking-wider">
                <MousePointer2 size={12} />
                <span>Mouse</span>
              </div>
              <ul className="text-[12px] space-y-1.5 leading-tight list-none pl-0">
                <li style={whiteText}>• Scroll: Zoom In / Out</li>
                <li style={whiteText}>• Drag: Rotate Scene</li>
                <li style={whiteText}>• Move: Particles react</li>
              </ul>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-3">
              <div className="flex items-center gap-2 text-green-400 font-bold text-[11px] uppercase tracking-wider">
                <Hand size={12} />
                <span>Gestures (Magic)</span>
              </div>
              <ul className="text-[12px] space-y-1.5 leading-tight list-none pl-0">
                <li style={{ color: '#FEF9C3', fontWeight: 'bold' }}>• Move L/R: Rotate Tree</li>
                <li style={whiteText}>• Fist: Shrink Magic</li>
                <li style={{ color: '#FFB6C1', fontWeight: 'bold' }}>• Open Hand: BURST!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Humorous Final Message */}
      {showPunchline && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-8 text-center bg-black/80 backdrop-blur-md animate-in fade-in duration-700">
          <div className="bg-[#050005]/95 backdrop-blur-3xl border border-pink-500/30 p-12 md:p-16 rounded-[4rem] md:rounded-[6rem] shadow-[0_0_120px_rgba(255,20,147,0.4)] flex flex-col items-center max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-medium mb-2 tracking-tight" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Sorry, no gift...
            </h2>
            <h3 className="text-5xl md:text-7xl font-black text-pink-500 drop-shadow-[0_0_50px_rgba(255,20,147,0.8)] leading-none italic uppercase mb-12">
              But Merry Christmas! 🎄
            </h3>
            
            <button
              onClick={onReset}
              className="pointer-events-auto bg-white text-black px-12 py-5 rounded-full transition-all flex items-center gap-4 font-black text-xl active:scale-95 hover:bg-pink-500 hover:text-white group shadow-2xl uppercase tracking-tighter"
            >
              <RotateCcw size={28} className="group-hover:rotate-180 transition-transform duration-700" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Wish Input */}
      <div className="mt-auto mb-20 mx-auto w-full max-w-xl px-10 pointer-events-auto">
        {!bursting && !showPunchline && (
          <div className="flex flex-col gap-6">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-pink-500/20 blur-[80px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your wish and press Enter"
                style={{ color: 'white' }}
                className="w-full bg-black/60 backdrop-blur-3xl border border-white/40 rounded-full px-10 py-6 focus:outline-none focus:border-pink-500 transition-all shadow-[0_0_60px_rgba(0,0,0,0.8)] placeholder:text-white/40 text-xl font-bold"
              />
              <button 
                type="submit"
                className="absolute right-3 top-3 bottom-3 bg-gradient-to-br from-pink-600 to-pink-500 text-white px-8 rounded-full transition-all flex items-center gap-2 font-black text-xs shadow-2xl active:scale-95 uppercase tracking-widest group"
              >
                <Send size={16} />
                <span>Wish</span>
              </button>
            </form>
            <p className="text-center uppercase tracking-[0.5em] font-black animate-pulse" style={whiteText}>
              ✨ Magic Awakens After You Wish ✨
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
