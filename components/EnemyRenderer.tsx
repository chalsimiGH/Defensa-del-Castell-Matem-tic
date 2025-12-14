
import React from 'react';
import { Enemy } from '../types';
import { ENEMY_TYPES } from '../constants';
import { Ghost, Skull, Swords, Bot, Shield, Droplets, Flame, Bird, Bone, Eye, Cloud, Zap } from 'lucide-react';

interface EnemyRendererProps {
  enemies: Enemy[];
}

// Bezier Curve Logic
const getPathPosition = (progress: number) => {
  const t = (100 - progress) / 100;

  // Points (in percentage of container)
  const P0 = { x: 100, y: 25 }; 
  const P1 = { x: 70, y: 25 };
  const P2 = { x: 60, y: 50 };
  const P3 = { x: 50, y: 35 };

  // Cubic Bezier
  const cx = Math.pow(1-t, 3)*P0.x + 3*Math.pow(1-t, 2)*t*P1.x + 3*(1-t)*Math.pow(t, 2)*P2.x + Math.pow(t, 3)*P3.x;
  const cy = Math.pow(1-t, 3)*P0.y + 3*Math.pow(1-t, 2)*t*P1.y + 3*(1-t)*Math.pow(t, 2)*P2.y + Math.pow(t, 3)*P3.y;

  return { left: cx, bottom: cy };
};

const RenderEnemyVisual = ({ type, color }: { type: string, color: string }) => {
    switch (type) {
        case 'goblin':
            return (
                <div className="relative group">
                    <Ghost size={56} className={`${color} fill-green-900/40 drop-shadow-lg`} strokeWidth={1.5} />
                    {/* Eyes */}
                    <div className="absolute top-4 left-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]" />
                    <div className="absolute top-4 right-3 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_5px_red]" />
                    {/* Dagger */}
                    <div className="absolute -right-2 bottom-0 rotate-45">
                        <Swords size={24} className="text-slate-300 fill-slate-500" />
                    </div>
                </div>
            );
        case 'orc':
            return (
                <div className="relative">
                    {/* Body Shield */}
                    <Shield size={64} className={`${color} fill-emerald-900`} strokeWidth={2} />
                    {/* Face Paint */}
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-8 h-2 bg-red-800 rounded-full opacity-60"></div>
                    {/* Weapon */}
                    <div className="absolute top-0 -right-4 rotate-12 z-[-1]">
                        <Swords size={40} className="text-slate-400 fill-slate-700" />
                    </div>
                     <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-yellow-400 rounded-full border border-black" />
                     <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-yellow-400 rounded-full border border-black" />
                </div>
            );
        case 'dragon':
            return (
                <div className="relative animate-wiggle" style={{ animationDuration: '3s' }}>
                    {/* Wings simulated by Swords for now or structure */}
                    <div className="absolute -top-4 -left-4 -rotate-45 opacity-80">
                         <Flame size={40} className="text-red-500 fill-orange-500 scale-x-[-1]" />
                    </div>
                    <div className="absolute -top-4 -right-4 rotate-45 opacity-80">
                         <Flame size={40} className="text-red-500 fill-orange-500" />
                    </div>
                    {/* Body */}
                    <Bird size={72} className={`${color} fill-red-900`} strokeWidth={2} />
                    {/* Fire Breath */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2">
                        <Flame size={24} className="text-yellow-400 fill-yellow-200 animate-bounce" />
                    </div>
                </div>
            );
        case 'skeleton':
            return (
                <div className="relative">
                    <Skull size={56} className="text-slate-200 fill-slate-800 drop-shadow-xl" strokeWidth={1.5} />
                    {/* Glowing Eyes */}
                    <div className="absolute top-5 left-3 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
                    <div className="absolute top-5 right-3 w-3 h-3 bg-cyan-400 rounded-full shadow-[0_0_8px_cyan]" />
                    {/* Crossed Bones */}
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex">
                        <Bone size={24} className="text-slate-300 rotate-45" />
                        <Bone size={24} className="text-slate-300 -rotate-45 -ml-2" />
                    </div>
                </div>
            );
        case 'golem':
            return (
                <div className="relative">
                     {/* Rocky Body */}
                    <Bot size={64} className={`${color} fill-stone-800`} strokeWidth={2} />
                    {/* Energy Core */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_10px_blue]"></div>
                </div>
            );
        case 'slime':
            return (
                <div className="relative transform scale-y-75 origin-bottom">
                    <Droplets size={56} className={`${color} fill-lime-400/50`} strokeWidth={2} />
                    <div className="absolute bottom-1 left-1 opacity-70">
                         <Droplets size={32} className="text-lime-200 fill-lime-100" />
                    </div>
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rounded-full opacity-50"></div>
                    <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-black rounded-full opacity-50"></div>
                </div>
            );
        case 'boss':
            return (
                <div className="relative animate-[float-slow_4s_ease-in-out_infinite]">
                    {/* Aura */}
                    <div className="absolute inset-0 bg-purple-600/30 blur-xl rounded-full animate-pulse"></div>
                    
                    {/* Main Head */}
                    <div className="relative z-10">
                        <Skull size={80} className="text-gray-200 fill-black drop-shadow-[0_0_15px_rgba(147,51,234,0.8)]" strokeWidth={1.5} />
                        {/* Scary Eyes */}
                        <div className="absolute top-7 left-4 w-4 h-4 bg-red-600 rounded-full shadow-[0_0_10px_red] animate-pulse">
                            <div className="w-1 h-2 bg-black absolute top-1 left-1.5 rounded-full"></div>
                        </div>
                        <div className="absolute top-7 right-4 w-4 h-4 bg-red-600 rounded-full shadow-[0_0_10px_red] animate-pulse">
                            <div className="w-1 h-2 bg-black absolute top-1 left-1.5 rounded-full"></div>
                        </div>
                        {/* Horns */}
                        <div className="absolute -top-6 -left-2 rotate-[-20deg]">
                            <Zap size={30} className="text-purple-400 fill-purple-900" />
                        </div>
                        <div className="absolute -top-6 -right-2 rotate-[20deg] scale-x-[-1]">
                            <Zap size={30} className="text-purple-400 fill-purple-900" />
                        </div>
                    </div>

                    {/* Flames around */}
                    <div className="absolute -bottom-4 -left-6 z-0 animate-bounce delay-100">
                        <Flame size={40} className="text-purple-600 fill-black" />
                    </div>
                    <div className="absolute -bottom-4 -right-6 z-0 animate-bounce delay-300">
                        <Flame size={40} className="text-purple-600 fill-black" />
                    </div>
                    
                    {/* Glitchy Effect Lines */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 opacity-0 animate-[ping_2s_infinite]"></div>
                </div>
            );
        default:
            return <Ghost size={48} className={color} />;
    }
}

export const EnemyRenderer: React.FC<EnemyRendererProps> = ({ enemies }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {enemies.map((enemy) => {
        const config = ENEMY_TYPES[enemy.type];
        const pos = getPathPosition(enemy.x);
        const zIndex = 1000 - Math.floor(pos.bottom);
        const isDying = enemy.status === 'dying';
        const isAttacking = enemy.status === 'attacking';
        const isBoss = enemy.type === 'boss';
        
        return (
          <div
            key={enemy.id}
            className="absolute flex flex-col items-center transition-transform duration-100 ease-linear"
            style={{ 
              left: `${pos.left}%`,
              bottom: `${pos.bottom}%`,
              transform: `scale(${config.visualScale}) translateX(-50%)`,
              zIndex: zIndex
            }}
          >
            {/* Boss Hits Remaining Indicator */}
            {isBoss && enemy.hitsRemaining && (
                <div className="flex gap-1 mb-2 absolute -top-12">
                    {[...Array(5)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full border border-black ${i < enemy.hitsRemaining! ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-gray-800'}`}
                        ></div>
                    ))}
                </div>
            )}

            {/* Target Value Bubble */}
            <div className={`relative mb-1 ${isDying ? 'hidden' : ''} z-20`}>
                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isBoss ? 'bg-purple-500' : 'bg-red-500'}`}></div>
                <div className={`${isBoss ? 'bg-purple-950 border-purple-500 text-white' : 'bg-white border-red-800 text-slate-900'} border-2 rounded-full min-w-[32px] h-8 px-2 flex items-center justify-center font-black text-lg shadow-md`}>
                   {enemy.value}
                </div>
            </div>

            {/* Visual Icon Container - Handles Animations without conflicting with parent positioning */}
            <div className={`
                relative transition-all duration-500 ease-in-out
                ${isAttacking ? 'drop-shadow-[0_0_15px_rgba(255,0,0,0.8)] scale-150 -translate-y-8 opacity-0' : ''}
                ${isDying ? 'opacity-0 scale-0 rotate-[720deg] translate-x-32 -translate-y-32' : ''}
            `}>
                {/* Shadow underneath */}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black/40 rounded-[100%] blur-sm"></div>
                
                <RenderEnemyVisual type={enemy.type} color={config.color} />
                
                {/* Death Poof Effect */}
                {isDying && (
                    <div className="absolute inset-0 -top-8 flex items-center justify-center animate-ping">
                         <Cloud className="text-white fill-slate-200 opacity-80" size={64} />
                    </div>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
