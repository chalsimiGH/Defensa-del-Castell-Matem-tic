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
    // Landscape styles: Remove rounded-t, full height, different padding, remove safe-area-bottom (handled by sidebar)
    // Portrait styles: Maintain existing bottom bar look
    <div className="w-full bg-slate-900 pt-1 pb-2 px-2 md:p-3 md:pb-4 rounded-t-2xl md:rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t-4 md:border-t-8 border-slate-700 relative z-50 pb-[env(safe-area-inset-bottom)] landscape:h-full landscape:rounded-none landscape:border-t-0 landscape:pb-2 landscape:overflow-y-auto landscape:flex landscape:flex-col landscape:justify-center">
      <div className="max-w-4xl mx-auto flex flex-col gap-2 md:gap-3 w-full">
        
        {/* Equation Display */}
        <div className="bg-black/40 rounded-lg md:rounded-xl p-1.5 md:px-4 md:py-2 border-2 md:border-4 border-slate-600 min-h-[3rem] md:min-h-[4.5rem] flex items-center justify-between shadow-inner backdrop-blur-sm">
            <div className="flex flex-wrap gap-1 md:gap-2 items-center flex-1 overflow-x-auto custom-scrollbar">
                {currentEquation.length === 0 && (
                    <span className="text-slate-400 italic text-xs md:text-lg animate-pulse px-2">Escriu la teva operació...</span>
                )}
                {currentEquation.map((item) => (
                    <span 
                        key={item.id} 
                        className={`text-lg md:text-2xl font-black px-2 py-0.5 md:px-3 md:py-1 rounded md:rounded-lg transform transition-all ${
                            item.type === 'number' 
                                ? 'bg-blue-600 text-white shadow-[0_2px_0_#1e3a8a] md:shadow-[0_3px_0_#1e3a8a]' 
                                : 'bg-amber-600 text-white shadow-[0_2px_0_#78350f] md:shadow-[0_3px_0_#78350f]'
                        }`}
                    >
                        {item.value}
                    </span>
                ))}
            </div>
            
            <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l-2 border-slate-600 shrink-0">
                <div className="text-right min-w-[40px] md:min-w-[70px]">
                    <span className="block text-slate-400 text-[9px] md:text-xs uppercase font-bold tracking-wider">Total</span>
                    <span className={`text-xl md:text-3xl font-mono font-black ${evaluatedResult !== null ? 'text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.5)]' : 'text-slate-600'}`}>
                        {evaluatedResult !== null ? evaluatedResult : '?'}
                    </span>
                </div>
                
                <button 
                    onClick={onAttack}
                    disabled={evaluatedResult === null}
                    className="h-9 w-9 md:h-16 md:w-16 bg-gradient-to-br from-red-500 to-red-700 hover:from-red-400 hover:to-red-600 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed rounded-lg md:rounded-2xl flex items-center justify-center shadow-[0_3px_0_#7f1d1d] md:shadow-[0_5px_0_#7f1d1d] active:shadow-none active:translate-y-2 transition-all border border-red-400"
                >
                    <Swords size={18} className="text-white fill-white md:w-8 md:h-8" />
                </button>
            </div>
        </div>

        {/* Controls Area */}
        <div className="flex flex-wrap gap-1 justify-center bg-slate-800 p-1.5 rounded-xl border border-slate-700 md:grid md:grid-cols-[1fr_auto] md:gap-3 md:bg-transparent md:p-0 md:border-0 landscape:flex landscape:bg-transparent landscape:border-0 landscape:p-0">
            
            {/* Number Pad Group */}
            <div className="contents md:flex md:flex-wrap md:gap-2 md:justify-start md:bg-slate-800 md:p-3 md:rounded-xl md:border-2 md:border-slate-700 landscape:flex landscape:gap-2 landscape:justify-center landscape:w-full">
                {availableButtons.map((num) => (
                    <button
                        key={num}
                        onClick={() => onAddNumber(num)}
                        className="h-10 w-10 md:h-14 md:w-14 bg-blue-500 hover:bg-blue-400 rounded-lg md:rounded-xl shadow-[0_3px_0_#1e40af] md:shadow-[0_4px_0_#1e40af] active:shadow-none active:translate-y-1 text-xl md:text-2xl font-black text-white transition-all border-b-2 md:border-b-4 border-blue-700"
                    >
                        {num}
                    </button>
                ))}
            </div>

            {/* Visual Divider on Desktop only */}
            <div className="hidden md:block w-2 landscape:hidden"></div> 

            {/* Operators & Actions Group */}
            <div className="contents md:flex md:flex-wrap md:gap-2 md:justify-center md:bg-slate-800 md:p-3 md:rounded-xl md:border-2 md:border-slate-700 landscape:flex landscape:gap-2 landscape:justify-center landscape:w-full landscape:mt-2">
                 {allowedOperators.map((op) => (
                    <button
                        key={op}
                        onClick={() => onAddOperator(op)}
                        className="h-10 w-10 md:h-14 md:w-14 bg-amber-500 hover:bg-amber-400 rounded-lg md:rounded-xl shadow-[0_3px_0_#92400e] md:shadow-[0_4px_0_#92400e] active:shadow-none active:translate-y-1 text-xl md:text-3xl font-black text-white transition-all border-b-2 md:border-b-4 border-amber-700"
                    >
                        {op}
                    </button>
                ))}
                 
                 <div className="w-0.5 h-10 bg-slate-700 mx-0.5 md:hidden landscape:block landscape:w-2 landscape:h-10 landscape:bg-transparent"></div>

                 <button
                    onClick={onBackspace}
                    className="h-10 w-10 md:h-14 md:w-14 bg-slate-600 hover:bg-slate-500 rounded-lg md:rounded-xl shadow-[0_3px_0_#334155] md:shadow-[0_4px_0_#334155] active:shadow-none active:translate-y-1 text-white flex items-center justify-center border-b-2 md:border-b-4 border-slate-700"
                    aria-label="Esborrar un"
                >
                    <Delete size={18} className="md:w-6 md:h-6" />
                </button>
                 <button
                    onClick={onClear}
                    className="h-10 w-10 md:h-14 md:w-14 bg-red-800 hover:bg-red-700 rounded-lg md:rounded-xl shadow-[0_3px_0_#450a0a] md:shadow-[0_4px_0_#450a0a] active:shadow-none active:translate-y-1 text-white flex items-center justify-center border-b-2 md:border-b-4 border-red-950"
                    aria-label="Netejar tot"
                >
                    <Eraser size={18} className="md:w-6 md:h-6" />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};