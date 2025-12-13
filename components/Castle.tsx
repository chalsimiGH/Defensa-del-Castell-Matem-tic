import React from 'react';
import { ShieldAlert, Flag, Flame, Flower, Waves, Bird, Shield } from 'lucide-react';
import { CastleStyle } from '../types';

interface CastleProps {
  health: number;
  maxHealth: number;
  isShaking: boolean;
  style: CastleStyle;
}

export const Castle: React.FC<CastleProps> = ({ health, maxHealth, isShaking, style }) => {
  const healthPercent = (health / maxHealth) * 100;
  const wallColor = style.wallColor;
  
  // Create derived colors for shading
  const getShade = (base: string) => {
    if (base.includes('slate-400')) return 'bg-slate-600 border-slate-700';
    if (base.includes('amber-200')) return 'bg-amber-400 border-amber-600';
    if (base.includes('slate-800')) return 'bg-slate-950 border-black';
    if (base.includes('pink-300')) return 'bg-pink-500 border-pink-700';
    return 'bg-slate-600 border-slate-700';
  };
  
  const shadeClass = getShade(wallColor);

  // Updated Flag Rendering to match Shop Visuals
  const renderFlag = (defaultColorClass: string) => {
    if (style.flagType === 'pirate') {
      return (
        <div className="relative">
            <Flag size={28} className="text-slate-950 fill-slate-900 drop-shadow-sm" />
            {/* Skull hint */}
            <div className="absolute top-1 left-2 w-2 h-2 bg-white/80 rounded-full"></div>
        </div>
      );
    }
    if (style.flagType === 'royal') {
      return <Flag size={28} className="text-purple-700 fill-yellow-400 drop-shadow-sm" />;
    }
    // Classic (Team Colors)
    return <Flag size={28} fill="currentColor" className={defaultColorClass} />;
  };

  return (
    <div className={`relative z-10 flex flex-col items-center ${isShaking ? 'animate-shake' : ''}`}>
      {/* Health Bar */}
      <div className="mb-4 md:mb-6 relative group z-20 scale-75 md:scale-100 origin-bottom">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative w-56 h-8 bg-slate-900 rounded-lg border-2 border-slate-700 overflow-hidden shadow-2xl">
             <div 
            className={`h-full transition-all duration-300 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)] ${healthPercent > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : healthPercent > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' : 'bg-gradient-to-r from-red-500 to-red-700'}`}
            style={{ width: `${healthPercent}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white shadow-black drop-shadow-md uppercase tracking-wider">
                Resistència: {health}
            </span>
        </div>
      </div>

      {/* CASTLE COMPLEX - Scaled for responsiveness */}
      <div className="relative w-64 h-48 sm:w-80 sm:h-64 md:w-96 md:h-72 flex items-end justify-center perspective-500">
        
        {/* Moat / Water Base */}
        <div className="absolute -bottom-4 w-[120%] h-12 md:h-16 bg-blue-500/50 rounded-full blur-sm flex items-center justify-center overflow-hidden border-t-4 border-blue-400/30">
             <div className="animate-wiggle opacity-50 text-blue-200 w-full flex justify-around">
                <Waves size={24} className="md:w-8 md:h-8" /> <Waves size={24} className="md:w-8 md:h-8" /> <Waves size={24} className="md:w-8 md:h-8" />
             </div>
        </div>

        {/* Drawbridge (Open) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-16 md:h-20 bg-amber-900 border-x-4 border-amber-950 origin-bottom transform perspective-origin-bottom rotate-x-12 z-10 flex flex-col items-center justify-around py-2 shadow-lg">
             <div className="w-full h-1 bg-black/20"></div>
             <div className="w-full h-1 bg-black/20"></div>
             <div className="w-full h-1 bg-black/20"></div>
             <div className="w-full h-1 bg-black/20"></div>
        </div>

        {/* Back Towers (Shadowed) */}
        <div className={`absolute bottom-6 md:bottom-8 -left-2 md:-left-4 w-16 md:w-20 h-36 md:h-48 ${shadeClass.split(' ')[0]} rounded-t-lg z-0 opacity-80 scale-90`}></div>
        <div className={`absolute bottom-6 md:bottom-8 -right-2 md:-right-4 w-16 md:w-20 h-36 md:h-48 ${shadeClass.split(' ')[0]} rounded-t-lg z-0 opacity-80 scale-90`}></div>

        {/* Main Left Tower */}
        <div className={`absolute bottom-0 left-2 md:left-4 w-16 md:w-24 h-40 sm:h-56 md:h-64 ${wallColor} border-r-4 md:border-r-8 border-black/10 rounded-t-lg flex flex-col items-center shadow-2xl overflow-hidden`}>
             <div className="w-20 md:w-28 h-4 md:h-6 bg-slate-700 absolute -top-1 md:-top-2 rounded-sm flex justify-between px-2 shadow-md z-20">
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
             </div>
             <div className="w-4 md:w-6 h-6 md:h-10 bg-slate-900 rounded-t-full mt-8 md:mt-12 border-2 md:border-4 border-slate-600 shadow-inner"></div>
             
             {/* Flag */}
             <div className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 origin-bottom animate-wiggle z-10 scale-90 md:scale-110">
                 {renderFlag('text-blue-500 fill-blue-300')} 
                 <div className="h-14 w-1 bg-slate-800 mx-auto"></div>
             </div>

             {/* Pet Dragon - Made larger and more visible */}
             {style.decoration === 'dragon' && (
               <div className="absolute -top-6 md:-top-10 -left-8 md:-left-12 animate-bounce z-40" style={{ animationDuration: '3s' }}>
                  <Bird className="text-red-600 drop-shadow-xl w-14 h-14 md:w-20 md:h-20 transform -scale-x-100" strokeWidth={2} fill="#ea580c"/>
               </div>
             )}
        </div>

        {/* Main Right Tower */}
        <div className={`absolute bottom-0 right-2 md:right-4 w-16 md:w-24 h-40 sm:h-56 md:h-64 ${wallColor} border-l-4 md:border-l-8 border-black/10 rounded-t-lg flex flex-col items-center shadow-2xl overflow-hidden`}>
             <div className="w-20 md:w-28 h-4 md:h-6 bg-slate-700 absolute -top-1 md:-top-2 rounded-sm flex justify-between px-2 shadow-md z-20">
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
             </div>
             <div className="w-4 md:w-6 h-6 md:h-10 bg-slate-900 rounded-t-full mt-8 md:mt-12 border-2 md:border-4 border-slate-600 shadow-inner"></div>
             
             {/* Flag */}
             <div className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 origin-bottom animate-wiggle z-10 scale-90 md:scale-110" style={{ animationDelay: '0.5s' }}>
                 {renderFlag('text-blue-600 fill-blue-400 transform scale-x-[-1]')}
                 <div className="h-14 w-1 bg-slate-800 mx-auto"></div>
             </div>
        </div>

        {/* Main Keep (Center) */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-28 md:w-48 h-32 md:h-48 ${wallColor} shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 flex flex-col items-center justify-end rounded-t-sm`}>
          {/* Battlements */}
           <div className="w-full h-6 md:h-8 bg-slate-700 absolute -top-3 md:-top-4 rounded-sm flex justify-around px-2 shadow-lg relative">
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>

                {/* Cannons - Made larger and sticking out more */}
                {style.decoration === 'cannons' && (
                  <>
                    <div className="absolute -top-4 -left-2 w-3 h-8 md:w-5 md:h-10 bg-slate-900 border border-slate-600 rounded-sm -rotate-45 z-0 shadow-lg"></div>
                    <div className="absolute -top-4 -right-2 w-3 h-8 md:w-5 md:h-10 bg-slate-900 border border-slate-600 rounded-sm rotate-45 z-0 shadow-lg"></div>
                  </>
                )}
           </div>

           {/* Royal Shield Symbol */}
           <div className="absolute top-6 md:top-8 text-slate-900/20 scale-75 md:scale-100">
              <ShieldAlert size={40} />
           </div>

          {/* Gate Archway */}
          <div className="relative w-16 md:w-24 h-20 md:h-28 bg-slate-800 rounded-t-full border-4 md:border-8 border-slate-600 shadow-inner flex items-end justify-center overflow-hidden">
             <div className="absolute inset-0 bg-black/60 z-0"></div>
             <div className="absolute top-0 w-full h-1/2 flex justify-around items-start z-10">
                 <div className="w-1 md:w-2 h-full bg-slate-900 border-x border-slate-700"></div>
                 <div className="w-1 md:w-2 h-full bg-slate-900 border-x border-slate-700"></div>
                 <div className="w-1 md:w-2 h-full bg-slate-900 border-x border-slate-700"></div>
             </div>
          </div>
        </div>

        {/* --- DECORATIONS RENDERING --- */}
        
        {/* Torches */}
        {style.decoration === 'torches' && (
            <>
                <div className="absolute bottom-24 md:bottom-32 left-6 md:left-8 animate-pulse text-orange-500 drop-shadow-[0_0_15px_orange] z-30 scale-90 md:scale-125"><Flame fill="orange" /></div>
                <div className="absolute bottom-24 md:bottom-32 right-6 md:right-8 animate-pulse text-orange-500 drop-shadow-[0_0_15px_orange] z-30 scale-90 md:scale-125"><Flame fill="orange" /></div>
            </>
        )}
        
        {/* Vines */}
        {style.decoration === 'vines' && (
            <>
                <div className="absolute bottom-0 left-0 text-green-800 z-30 scale-90 md:scale-125"><Flower size={32} /></div>
                <div className="absolute bottom-16 md:bottom-20 -left-2 text-green-700 z-30 -rotate-12 scale-90 md:scale-110"><Flower size={20} /></div>
                <div className="absolute bottom-8 md:bottom-10 right-0 text-green-800 z-30 rotate-45 scale-90 md:scale-110"><Flower size={24} /></div>
                <div className="absolute bottom-24 left-1 text-green-700 z-30 rotate-45 scale-75"><Flower size={18} /></div>
            </>
        )}

        {/* Royal Garden */}
        {style.decoration === 'garden' && (
            <>
                <div className="absolute bottom-0 -left-6 md:-left-12 text-pink-500 z-30 scale-100 md:scale-125 drop-shadow-md"><Flower size={32} fill="currentColor" /></div>
                <div className="absolute bottom-0 -right-6 md:-right-12 text-purple-500 z-30 scale-100 md:scale-125 drop-shadow-md"><Flower size={32} fill="currentColor" /></div>
                <div className="absolute bottom-4 left-4 text-green-500 z-30 scale-90 md:scale-110 animate-bounce" style={{ animationDuration: '4s' }}><Flower size={20} fill="#fce7f3" /></div>
                <div className="absolute bottom-4 right-4 text-green-500 z-30 scale-90 md:scale-110 animate-bounce" style={{ animationDuration: '3.5s' }}><Flower size={20} fill="#fce7f3" /></div>
                <div className="absolute bottom-0 w-full h-6 bg-green-700/80 rounded-full blur-sm z-20"></div>
            </>
        )}

        {/* Guardian Statues */}
        {style.decoration === 'statues' && (
            <>
                <div className="absolute bottom-0 -left-8 md:-left-16 text-slate-300 z-30 scale-100 md:scale-125 drop-shadow-xl">
                   <Shield size={40} fill="currentColor" className="text-slate-500"/>
                </div>
                <div className="absolute bottom-0 -right-8 md:-right-16 text-slate-300 z-30 scale-100 md:scale-125 drop-shadow-xl">
                   <Shield size={40} fill="currentColor" className="text-slate-500"/>
                </div>
            </>
        )}

        {/* Damage Effect */}
        {isShaking && (
           <div className="absolute inset-0 -top-10 md:-top-20 flex items-center justify-center text-red-600 opacity-90 animate-ping z-50">
             <ShieldAlert size={80} className="md:w-[100px] md:h-[100px]" fill="white" />
           </div>
        )}
      </div>
    </div>
  );
};
