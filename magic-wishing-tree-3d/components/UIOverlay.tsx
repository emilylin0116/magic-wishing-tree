
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

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col font-sans select-none">
      {/* Main Title */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 text-center w-full px-4">
        <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-gold-300 to-green-300 drop-shadow-[0_0_20px_rgba(255,20,147,0.6)] italic tracking-tighter uppercase">
          Magic Wishing Tree
        </h1>
      </div>

      {/* English Interaction Guide - Top Left Corner */}
      <div className="absolute top-28 left-10 pointer-events-auto max-w-[220px]">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl space-y-5">
          <div className="flex items-center gap-2 text-gold-300 font-bold text-[11px] uppercase tracking-[0.2em] border-b border-white/10 pb-2">
            <Sparkles size={14} />
            <span>How to Interact</span>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-pink-400 font-bold text-[10px] uppercase tracking-wider">
                <MousePointer2 size={12} />
                <span>Mouse</span>
              </div>
              <ul className="text-[11px] text-white/60 space-y-1 leading-tight list-none pl-0">
                <li>• Scroll: Zoom In / Out</li>
                <li>• Drag: Rotate Scene</li>
                <li>• Move: Particles react</li>
                <li>• Quick move: Trails</li>
              </ul>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-green-400 font-bold text-[10px] uppercase tracking-wider">
                <Hand size={12} />
                <span>Gestures</span>
              </div>
              <ul className="text-[11px] text-white/60 space-y-1 leading-tight list-none pl-0">
                <li>• Fist / Pinch: Shrink</li>
                <li>• Open Hand: Expand</li>
                <li>• Move L/R: Rotate</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Humorous Final Message */}
      {showPunchline && (
        <div className="absolute inset-0 flex items-center justify-center z-20 px-8 text-center bg-black/60 backdrop-blur-md animate-in fade-in duration-700">
          <div className="bg-[#050005]/95 backdrop-blur-3xl border border-pink-500/20 p-16 rounded-[6rem] shadow-[0_0_120px_rgba(255,20,147,0.4)] flex flex-col items-center max-w-2xl scale-110">
            <h2 className="text-2xl md:text-3xl font-medium text-white/40 mb-2 tracking-tight">
              Sorry, no gift...
            </h2>
            <h3 className="text-5xl md:text-8xl font-black text-pink-500 drop-shadow-[0_0_50px_rgba(255,20,147,1)] leading-none italic uppercase mb-12">
              But Merry Christmas! 🎄
            </h3>
            
            <button
              onClick={onReset}
              className="pointer-events-auto bg-white text-black px-16 py-6 rounded-full transition-all flex items-center gap-5 font-black text-2xl active:scale-95 hover:bg-pink-500 hover:text-white group shadow-2xl uppercase tracking-tighter"
            >
              <RotateCcw size={32} className="group-hover:rotate-180 transition-transform duration-700" />
              <span>Play Again</span>
            </button>
          </div>
        </div>
      )}

      {/* Larger and Bolder Wish Input - Bottom Center */}
      <div className="mt-auto mb-20 mx-auto w-full max-w-xl px-10 pointer-events-auto">
        {!bursting && !showPunchline && (
          <div className="flex flex-col gap-4">
            <form onSubmit={handleSubmit} className="relative group">
              <div className="absolute inset-0 bg-pink-500/15 blur-[80px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter your Christmas gift wish"
                className="w-full bg-black/50 backdrop-blur-3xl border border-white/20 text-white rounded-full px-10 py-6 focus:outline-none focus:border-pink-500/60 transition-all shadow-[0_0_60px_rgba(0,0,0,0.7)] placeholder:text-white/20 text-xl font-medium"
              />
              <button 
                type="submit"
                className="absolute right-2.5 top-2.5 bottom-2.5 bg-gradient-to-br from-pink-600 to-pink-500 hover:from-pink-500 hover:to-pink-400 text-white px-6 rounded-full transition-all flex items-center gap-2 font-black text-[10px] shadow-2xl active:scale-95 uppercase tracking-widest group"
              >
                <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                <span>Send</span>
              </button>
            </form>
            <p className="text-center text-white/30 text-[10px] uppercase tracking-[0.7em] font-black animate-pulse">
              Magic Awakens After You Wish
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
