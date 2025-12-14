
import React from 'react';
import { ShieldAlert, Flag, Flame, Flower, Waves, Shield, Cloud, Star } from 'lucide-react';
import { CastleStyle } from '../types';

interface CastleProps {
  health: number;
  maxHealth: number;
  isShaking: boolean;
  style: CastleStyle;
  isAttacking?: boolean; // New prop for animation
}

// Improved CSS-based Dragon Component (No more bird look)
const PixelDragon = () => {
  return (
    <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-50 animate-wiggle scale-[1.8] origin-bottom" style={{ animationDuration: '4s' }}>
        
        {/* Dragon Shadow */}
        <div className="absolute bottom-0 left-2 w-16 h-4 bg-black/20 rounded-full blur-sm"></div>

        <div className="relative w-24 h-24">
            
            {/* Left Wing (Bat/Membrane Style) */}
            <div className="absolute top-6 -left-8 w-12 h-10 origin-bottom-right animate-[pulse_1.5s_ease-in-out_infinite]">
                 {/* Wing Bone */}
                 <div className="absolute top-0 right-0 w-full h-1 bg-red-900 rounded-full -rotate-12"></div>
                 {/* Wing Membrane */}
                 <div className="absolute top-1 right-0 w-full h-full bg-red-600/90 rounded-bl-full border-l-2 border-red-900 clip-path-polygon" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
                 <div className="absolute top-2 right-2 w-2/3 h-2/3 bg-red-500/50 rounded-bl-full"></div>
            </div>

            {/* Right Wing */}
            <div className="absolute top-6 -right-8 w-12 h-10 origin-bottom-left animate-[pulse_1.5s_ease-in-out_infinite]" style={{ transform: 'scaleX(-1)' }}>
                 <div className="absolute top-0 right-0 w-full h-1 bg-red-900 rounded-full -rotate-12"></div>
                 <div className="absolute top-1 right-0 w-full h-full bg-red-600/90 rounded-bl-full border-l-2 border-red-900" style={{ clipPath: 'polygon(100% 0, 0 100%, 100% 100%)' }}></div>
                 <div className="absolute top-2 right-2 w-2/3 h-2/3 bg-red-500/50 rounded-bl-full"></div>
            </div>

            {/* Tail */}
            <div className="absolute bottom-4 -left-4 w-12 h-3 bg-green-700 rounded-full origin-right rotate-12"></div>
            <div className="absolute bottom-4 -left-6 w-4 h-4 bg-red-600 rotate-45 border border-red-800"></div> {/* Tail Spike */}

            {/* Body */}
            <div className="absolute bottom-4 left-6 w-12 h-14 bg-green-700 rounded-b-xl border-x-2 border-green-900"></div>
            {/* Belly Scales */}
            <div className="absolute bottom-5 left-8 w-8 h-10 bg-yellow-400 opacity-90 rounded-b-lg flex flex-col gap-1 p-0.5">
                <div className="w-full h-1 bg-yellow-600 opacity-30"></div>
                <div className="w-full h-1 bg-yellow-600 opacity-30"></div>
                <div className="w-full h-1 bg-yellow-600 opacity-30"></div>
                <div className="w-full h-1 bg-yellow-600 opacity-30"></div>
            </div>

            {/* Head Neck */}
            <div className="absolute top-6 left-8 w-8 h-8 bg-green-700"></div>

            {/* Head */}
            <div className="absolute top-0 left-5 w-14 h-12 bg-green-600 rounded-lg border-2 border-green-800 shadow-sm">
                
                {/* Snout */}
                <div className="absolute top-4 -right-2 w-6 h-6 bg-green-500 rounded-r-md border-y-2 border-r-2 border-green-800">
                     <div className="absolute top-1 right-2 w-1.5 h-1.5 bg-black rounded-full"></div> {/* Nostril */}
                </div>

                {/* Eye */}
                <div className="absolute top-2 left-4 w-4 h-4 bg-yellow-300 border border-black rounded-full overflow-hidden">
                    <div className="w-1.5 h-4 bg-black absolute top-0 left-1.5"></div> {/* Vertical Pupil */}
                </div>

                {/* Horns */}
                <div className="absolute -top-4 left-2 w-3 h-6 bg-white border border-slate-300 rounded-t-full -rotate-12"></div>
                <div className="absolute -top-4 left-8 w-3 h-6 bg-white border border-slate-300 rounded-t-full rotate-12"></div>
            </div>
             
             {/* Fire Breath Animation */}
             <div className="absolute top-8 -right-8 animate-pulse" style={{ animationDuration: '0.5s' }}>
                 <Flame size={24} className="text-orange-500 fill-yellow-400 rotate-90 drop-shadow-lg" />
                 <div className="absolute top-0 left-4 w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
             </div>
        </div>
    </div>
  );
};


export const Castle: React.FC<CastleProps> = ({ health, maxHealth, isShaking, style, isAttacking = false }) => {
  const healthPercent = (health / maxHealth) * 100;
  const wallColor = style.wallColor;
  
  const getShade = (base: string) => {
    if (base.includes('slate-400')) return 'bg-slate-600 border-slate-700';
    if (base.includes('amber-200')) return 'bg-amber-400 border-amber-600';
    if (base.includes('slate-800')) return 'bg-slate-950 border-black';
    if (base.includes('pink-300')) return 'bg-pink-500 border-pink-700';
    return 'bg-slate-600 border-slate-700';
  };
  
  const shadeClass = getShade(wallColor);

  const renderFlag = (defaultColorClass: string) => {
    if (style.flagType === 'pirate') {
      return (
        <div className="relative drop-shadow-md">
            <Flag size={28} className="text-slate-950 fill-slate-900" />
            <div className="absolute top-1 left-2 w-2 h-2 bg-white/90 rounded-full shadow-sm"></div>
        </div>
      );
    }
    if (style.flagType === 'royal') {
      return <Flag size={28} className="text-purple-600 fill-yellow-400 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]" />;
    }
    return <Flag size={28} fill="currentColor" className={`${defaultColorClass} drop-shadow-sm`} />;
  };

  // 3D Cannon Component
  const RenderCannon = ({ side }: { side: 'left' | 'right' }) => {
    // Rotation based on side
    const rotation = side === 'left' ? '-rotate-45' : 'rotate-45';
    // Recoil animation transform
    const recoilClass = isAttacking 
        ? (side === 'left' ? 'translate-x-2 translate-y-2' : '-translate-x-2 translate-y-2') 
        : '';
    
    return (
        <div className={`absolute -top-8 ${side === 'left' ? '-left-6' : '-right-6'} z-20 transition-transform duration-75 ease-out ${recoilClass}`}>
            <div className={`absolute bottom-0 ${side === 'left' ? 'right-1' : 'left-1'} w-5 h-5 bg-amber-900 rounded-full border-4 border-slate-800 shadow-md z-10`}></div>
            <div className={`relative w-8 h-16 bg-gradient-to-r from-slate-900 via-slate-600 to-slate-800 border-2 border-slate-900 rounded-t-sm rounded-b-lg ${rotation} shadow-2xl flex flex-col items-center justify-between py-1 overflow-visible`}>
                 <div className="w-full h-1 bg-slate-950/50 shadow-sm"></div>
                 <div className="w-full h-1 bg-slate-950/50 shadow-sm mt-auto mb-2"></div>
                 <div className="absolute -top-1 w-6 h-3 bg-black rounded-[100%] border border-slate-700 shadow-[inset_0_2px_4px_rgba(0,0,0,1)]"></div>
                 {isAttacking && (
                    <div className="absolute -top-10 w-full flex flex-col items-center animate-pulse">
                        <div className="relative">
                            <div className="absolute inset-0 bg-orange-500 blur-md rounded-full scale-150 opacity-80"></div>
                            <Star size={36} className="text-yellow-200 fill-yellow-100 rotate-45 relative z-20" strokeWidth={0} />
                            <Cloud size={24} className="text-white/60 fill-white/60 absolute -top-4 -left-4 z-10" />
                        </div>
                    </div>
                 )}
            </div>
        </div>
    );
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

      {/* CASTLE COMPLEX */}
      <div className="relative w-64 h-48 sm:w-80 sm:h-64 md:w-96 md:h-72 flex items-end justify-center perspective-500">
        
        {/* Moat */}
        <div className="absolute -bottom-4 w-[120%] h-12 md:h-16 bg-blue-500/50 rounded-full blur-sm flex items-center justify-center overflow-hidden border-t-4 border-blue-400/30">
             <div className="animate-wiggle opacity-50 text-blue-200 w-full flex justify-around">
                <Waves size={24} className="md:w-8 md:h-8" /> <Waves size={24} className="md:w-8 md:h-8" /> <Waves size={24} className="md:w-8 md:h-8" />
             </div>
             
             {/* Gator Decoration - Blinking Eyes */}
             {style.decorations.includes('gators') && (
                <>
                  <div className="absolute left-[20%] top-2 animate-bounce" style={{ animationDuration: '4s' }}>
                      <div className="w-10 h-3 bg-green-800 rounded-full shadow-sm"></div>
                      <div className="absolute -top-1 left-2 w-2 h-2 bg-yellow-400 rounded-full border border-black animate-[pulse_3s_infinite]"></div>
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-yellow-400 rounded-full border border-black animate-[pulse_3s_infinite]"></div>
                  </div>
                  <div className="absolute right-[20%] top-4 animate-bounce" style={{ animationDuration: '3s' }}>
                      <div className="w-10 h-3 bg-green-800 rounded-full shadow-sm"></div>
                      <div className="absolute -top-1 left-2 w-2 h-2 bg-yellow-400 rounded-full border border-black animate-[pulse_2.5s_infinite]"></div>
                      <div className="absolute -top-1 left-6 w-2 h-2 bg-yellow-400 rounded-full border border-black animate-[pulse_2.5s_infinite]"></div>
                  </div>
                </>
             )}
        </div>

        {/* Drawbridge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-16 md:h-20 bg-amber-900 border-x-4 border-amber-950 origin-bottom transform perspective-origin-bottom rotate-x-12 z-10 flex flex-col items-center justify-around py-2 shadow-lg">
             <div className="w-full h-1 bg-black/20"></div>
             <div className="w-full h-1 bg-black/20"></div>
             <div className="w-full h-1 bg-black/20"></div>
             <div className="w-full h-1 bg-black/20"></div>
        </div>

        {/* Back Towers */}
        <div className={`absolute bottom-6 md:bottom-8 -left-2 md:-left-4 w-16 md:w-20 h-36 md:h-48 ${shadeClass.split(' ')[0]} rounded-t-lg z-0 opacity-80 scale-90`}></div>
        <div className={`absolute bottom-6 md:bottom-8 -right-2 md:-right-4 w-16 md:w-20 h-36 md:h-48 ${shadeClass.split(' ')[0]} rounded-t-lg z-0 opacity-80 scale-90`}></div>
        
        {/* Wizard Crystal Decoration - Placed on Back Tower Right */}
        {style.decorations.includes('crystal') && (
            <div className="absolute bottom-[160px] md:bottom-[200px] -right-2 md:-right-4 z-40 animate-[bounce_4s_infinite]">
                 <div className="w-10 h-14 bg-cyan-400 rotate-45 border-2 border-white opacity-90 shadow-[0_0_25px_cyan]"></div>
                 <div className="absolute inset-0 w-10 h-14 bg-cyan-200 rotate-45 border-2 border-white opacity-60 blur-md animate-pulse"></div>
            </div>
        )}

        {/* Main Left Tower */}
        <div className={`absolute bottom-0 left-2 md:left-4 w-16 md:w-24 h-40 sm:h-56 md:h-64 ${wallColor} border-r-4 md:border-r-8 border-black/10 rounded-t-lg flex flex-col items-center shadow-2xl`}>
             <div className="w-20 md:w-28 h-4 md:h-6 bg-slate-700 absolute -top-1 md:-top-2 rounded-sm flex justify-between px-2 shadow-md z-20">
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
             </div>
             <div className="w-4 md:w-6 h-6 md:h-10 bg-slate-900 rounded-t-full mt-8 md:mt-12 border-2 md:border-4 border-slate-600 shadow-inner"></div>
             
             {/* Banners Decoration Left */}
             {style.decorations.includes('banners') && (
                <div className="absolute top-24 md:top-32 w-10 md:w-14 h-24 md:h-36 bg-red-700 border-x-2 border-red-900 shadow-lg flex flex-col items-center origin-top animate-wiggle" style={{ animationDuration: '3s' }}>
                    <div className="w-full h-full border-b-[20px] border-b-transparent border-l-[18px] border-l-red-700 border-r-[18px] border-r-red-700 md:border-l-[26px] md:border-r-[26px]"></div>
                    <div className="absolute top-4 w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-sm flex items-center justify-center">
                        <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    </div>
                </div>
             )}

             {/* Flag */}
             <div className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 origin-bottom animate-wiggle z-10 scale-90 md:scale-110">
                 {renderFlag('text-blue-500 fill-blue-300')} 
                 <div className="h-14 w-1 bg-slate-800 mx-auto"></div>
             </div>
        </div>

        {/* Main Right Tower */}
        <div className={`absolute bottom-0 right-2 md:right-4 w-16 md:w-24 h-40 sm:h-56 md:h-64 ${wallColor} border-l-4 md:border-l-8 border-black/10 rounded-t-lg flex flex-col items-center shadow-2xl`}>
             <div className="w-20 md:w-28 h-4 md:h-6 bg-slate-700 absolute -top-1 md:-top-2 rounded-sm flex justify-between px-2 shadow-md z-20">
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-2 md:w-3 h-3 md:h-4 bg-slate-700 -mt-2 border-t border-slate-500"></div>
             </div>
             <div className="w-4 md:w-6 h-6 md:h-10 bg-slate-900 rounded-t-full mt-8 md:mt-12 border-2 md:border-4 border-slate-600 shadow-inner"></div>
             
             {/* Banners Decoration Right */}
             {style.decorations.includes('banners') && (
                <div className="absolute top-24 md:top-32 w-10 md:w-14 h-24 md:h-36 bg-red-700 border-x-2 border-red-900 shadow-lg flex flex-col items-center origin-top animate-wiggle" style={{ animationDuration: '2.5s' }}>
                     <div className="w-full h-full border-b-[20px] border-b-transparent border-l-[18px] border-l-red-700 border-r-[18px] border-r-red-700 md:border-l-[26px] md:border-r-[26px]"></div>
                     <div className="absolute top-4 w-6 h-6 rounded-full bg-yellow-400 border-2 border-yellow-600 shadow-sm flex items-center justify-center">
                         <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                     </div>
                </div>
             )}

             {/* Flag */}
             <div className="absolute -top-10 md:-top-14 left-1/2 -translate-x-1/2 origin-bottom animate-wiggle z-10 scale-90 md:scale-110" style={{ animationDelay: '0.5s' }}>
                 {renderFlag('text-blue-600 fill-blue-400 transform scale-x-[-1]')}
                 <div className="h-14 w-1 bg-slate-800 mx-auto"></div>
             </div>
        </div>

        {/* Main Keep (Center) */}
        <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-28 md:w-48 h-32 md:h-48 ${wallColor} shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 flex flex-col items-center justify-end rounded-t-sm`}>
           <div className="w-full h-6 md:h-8 bg-slate-700 absolute -top-3 md:-top-4 rounded-sm flex justify-around px-2 shadow-lg relative">
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>
                <div className="w-3 md:w-5 h-3 md:h-5 bg-slate-700 -mt-2 border-t border-slate-500"></div>

                {/* Cannons */}
                {style.decorations.includes('cannons') && (
                  <>
                    <RenderCannon side="left" />
                    <RenderCannon side="right" />
                  </>
                )}
           </div>
           
           {/* Spikes Decoration */}
           {style.decorations.includes('spikes') && (
              <div className="absolute -top-4 w-[110%] flex justify-between px-1 z-30">
                 {[...Array(6)].map((_, i) => (
                    <div key={i} className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[20px] border-b-slate-800"></div>
                 ))}
              </div>
           )}

           {/* Pet Dragon - MOVED HERE (Top of Central Keep) */}
           {style.decorations.includes('dragon') && (
              <PixelDragon />
           )}

           <div className="absolute top-6 md:top-8 text-slate-900/20 scale-75 md:scale-100">
              <ShieldAlert size={40} />
           </div>

          <div className="relative w-16 md:w-24 h-20 md:h-28 bg-slate-800 rounded-t-full border-4 md:border-8 border-slate-600 shadow-inner flex items-end justify-center overflow-hidden">
             <div className="absolute inset-0 bg-black/60 z-0"></div>
             <div className="absolute top-0 w-full h-1/2 flex justify-around items-start z-10">
                 <div className="w-1 md:w-2 h-full bg-slate-900 border-x border-slate-700"></div>
                 <div className="w-1 md:w-2 h-full bg-slate-900 border-x border-slate-700"></div>
                 <div className="w-1 md:w-2 h-full bg-slate-900 border-x border-slate-700"></div>
             </div>
          </div>
        </div>

        {/* --- DECORATIONS RENDERING (UPDATED TO CHECK ARRAY) --- */}
        
        {/* Torches */}
        {style.decorations.includes('torches') && (
            <>
                <div className="absolute bottom-32 md:bottom-48 left-4 md:left-8 animate-pulse text-orange-500 drop-shadow-[0_0_15px_orange] z-50 scale-125"><Flame fill="orange" /></div>
                <div className="absolute bottom-32 md:bottom-48 right-4 md:right-8 animate-pulse text-orange-500 drop-shadow-[0_0_15px_orange] z-50 scale-125"><Flame fill="orange" /></div>
            </>
        )}
        
        {/* Vines */}
        {style.decorations.includes('vines') && (
            <>
                <div className="absolute bottom-0 -left-6 text-green-800 z-50 scale-150"><Flower size={32} /></div>
                <div className="absolute bottom-20 md:bottom-32 left-0 text-green-700 z-50 -rotate-12 scale-125"><Flower size={20} /></div>
                <div className="absolute bottom-20 md:bottom-32 right-0 text-green-800 z-50 rotate-45 scale-125"><Flower size={24} /></div>
                <div className="absolute bottom-10 -right-6 text-green-700 z-50 rotate-45 scale-125"><Flower size={18} /></div>
                
                {/* Vines on Keep */}
                <div className="absolute bottom-12 left-1/2 -translate-x-12 text-green-900 z-50 rotate-12 opacity-80 scale-110"><Flower size={16} /></div>
            </>
        )}

        {/* Royal Garden */}
        {style.decorations.includes('garden') && (
            <>
                <div className="absolute bottom-0 -left-12 md:-left-20 text-pink-500 z-50 scale-150 drop-shadow-md"><Flower size={32} fill="currentColor" /></div>
                <div className="absolute bottom-0 -right-12 md:-right-20 text-purple-500 z-50 scale-150 drop-shadow-md"><Flower size={32} fill="currentColor" /></div>
                <div className="absolute bottom-4 -left-4 text-green-500 z-50 scale-125 animate-bounce" style={{ animationDuration: '4s' }}><Flower size={20} fill="#fce7f3" /></div>
                <div className="absolute bottom-4 -right-4 text-green-500 z-50 scale-125 animate-bounce" style={{ animationDuration: '3.5s' }}><Flower size={20} fill="#fce7f3" /></div>
                <div className="absolute bottom-0 w-[120%] h-8 bg-green-700/80 rounded-full blur-md z-40"></div>
            </>
        )}

        {/* Guardian Statues */}
        {style.decorations.includes('statues') && (
            <>
                <div className="absolute bottom-0 -left-12 md:-left-20 text-slate-300 z-50 scale-150 drop-shadow-2xl">
                   <Shield size={40} fill="currentColor" className="text-slate-600"/>
                   <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-slate-400/20 blur-sm rounded-full"></div>
                </div>
                <div className="absolute bottom-0 -right-12 md:-right-20 text-slate-300 z-50 scale-150 drop-shadow-2xl">
                   <Shield size={40} fill="currentColor" className="text-slate-600"/>
                   <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-slate-400/20 blur-sm rounded-full"></div>
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
