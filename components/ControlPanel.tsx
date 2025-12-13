import React from 'react';
import { Operator, EquationItem } from '../types';
import { Delete, Eraser, Swords } from 'lucide-react';

interface ControlPanelProps {
  availableButtons: number[];
  allowedOperators: Operator[];
  currentEquation: EquationItem[];
  onAddNumber: (num: number) => void;
  onAddOperator: (op: Operator) => void;
  onBackspace: () => void;
  onClear: () => void;
  onAttack: () => void;
  evaluatedResult: number | null;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  availableButtons,
  allowedOperators,
  currentEquation,
  onAddNumber,
  onAddOperator,
  onBackspace,
  onClear,
  onAttack,
  evaluatedResult
}) => {
  return (
    // Added safe-area padding-bottom and reduced vertical padding
    <div className="w-full bg-slate-900 pt-3 pb-4 px-2 md:p-4 md:pb-6 rounded-t-2xl md:rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t-4 md:border-t-8 border-slate-700 relative z-50 pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 md:gap-4">
        
        {/* Equation Display */}
        <div className="bg-black/40 rounded-lg md:rounded-xl p-2 md:p-4 border-2 md:border-4 border-slate-600 min-h-[4rem] md:min-h-[5rem] flex items-center justify-between shadow-inner backdrop-blur-sm">
            <div className="flex flex-wrap gap-1 md:gap-2 items-center flex-1 overflow-x-auto custom-scrollbar">
                {currentEquation.length === 0 && (
                    <span className="text-slate-400 italic text-sm md:text-xl animate-pulse">Escriu la teva operació...</span>
                )}
                {currentEquation.map((item) => (
                    <span 
                        key={item.id} 
                        className={`text-xl md:text-3xl font-black px-2 py-1 md:px-4 md:py-2 rounded md:rounded-lg transform transition-all ${
                            item.type === 'number' 
                                ? 'bg-blue-600 text-white shadow-[0_2px_0_#1e3a8a] md:shadow-[0_4px_0_#1e3a8a]' 
                                : 'bg-amber-600 text-white shadow-[0_2px_0_#78350f] md:shadow-[0_4px_0_#78350f]'
                        }`}
                    >
                        {item.value}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l-2 border-slate-600 shrink-0">
                <div className="text-right min-w-[50px] md:min-w-[80px]">
                    <span className="block text-slate-400 text-[10px] md:text-xs uppercase font-bold tracking-wider">Total</span>
                    <span className={`text-2xl md:text-4xl font-mono font-black ${evaluatedResult !== null ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-slate-600'}`}>
                        {evaluatedResult !== null ? evaluatedResult : '?'}
                    </span>
                </div>
                
                <button 
                    onClick={onAttack}
                    disabled={evaluatedResult === null}
                    className="h-12 w-12 md:h-20 md:w-20 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed rounded-lg md:rounded-2xl flex items-center justify-center shadow-[0_3px_0_#7f1d1d] md:shadow-[0_6px_0_#7f1d1d] active:shadow-none active:translate-y-2 transition-all border border-red-400"
                >
                    <Swords size={24} className="text-white fill-white md:w-9 md:h-9" />
                </button>
            </div>
        </div>

        {/* Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2 md:gap-4">
            {/* Number Pad */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center md:justify-start bg-slate-800 p-2 md:p-4 rounded-xl border md:border-2 border-slate-700">
                {availableButtons.map((num) => (
                    <button
                        key={num}
                        onClick={() => onAddNumber(num)}
                        className="h-11 w-11 md:h-18 md:w-18 bg-blue-500 hover:bg-blue-400 rounded-lg md:rounded-xl shadow-[0_3px_0_#1e40af] md:shadow-[0_5px_0_#1e40af] active:shadow-none active:translate-y-1 text-xl md:text-3xl font-black text-white transition-all border-b-2 md:border-b-4 border-blue-700"
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Operators & Actions */}
            <div className="flex flex-wrap gap-2 md:gap-3 justify-center bg-slate-800 p-2 md:p-4 rounded-xl border md:border-2 border-slate-700">
                 {allowedOperators.map((op) => (
                    <button
                        key={op}
                        onClick={() => onAddOperator(op)}
                        className="h-11 w-11 md:h-18 md:w-18 bg-amber-500 hover:bg-amber-400 rounded-lg md:rounded-xl shadow-[0_3px_0_#92400e] md:shadow-[0_5px_0_#92400e] active:shadow-none active:translate-y-1 text-xl md:text-4xl font-black text-white transition-all border-b-2 md:border-b-4 border-amber-700"
                    >
                        {op}
                    </button>
                ))}
                 <div className="w-1 md:w-4"></div> {/* Spacer */}
                 <button
                    onClick={onBackspace}
                    className="h-11 w-11 md:h-18 md:w-18 bg-slate-600 hover:bg-slate-500 rounded-lg md:rounded-xl shadow-[0_3px_0_#334155] md:shadow-[0_5px_0_#334155] active:shadow-none active:translate-y-1 text-white flex items-center justify-center border-b-2 md:border-b-4 border-slate-700"
                    aria-label="Esborrar un"
                >
                    <Delete size={20} className="md:w-7 md:h-7" />
                </button>
                 <button
                    onClick={onClear}
                    className="h-11 w-11 md:h-18 md:w-18 bg-red-800 hover:bg-red-700 rounded-lg md:rounded-xl shadow-[0_3px_0_#450a0a] md:shadow-[0_5px_0_#450a0a] active:shadow-none active:translate-y-1 text-white flex items-center justify-center border-b-2 md:border-b-4 border-red-950"
                    aria-label="Netejar tot"
                >
                    <Eraser size={20} className="md:w-7 md:h-7" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};