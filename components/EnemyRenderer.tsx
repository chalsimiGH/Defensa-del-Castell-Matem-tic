import React from 'react';
import { Enemy } from '../types';
import { ENEMY_TYPES } from '../constants';
import { Ghost, Skull, Swords, Bot, Dna, Droplets } from 'lucide-react';

interface EnemyRendererProps {
  enemies: Enemy[];
  // castlePos is less relevant now with Bezier, but we keep it for consistency if needed
}

// Bezier Curve Logic
// Returns CSS % values for top/left based on progress t (0 to 1)
// t=1 is start (right), t=0 is end (castle)
const getPathPosition = (progress: number) => {
  // Normalize t: Game uses 100->0. Math usually uses 0->1.
  // Let's treat input 100 as t=0 (Start) and 0 as t=1 (End)
  const t = (100 - progress) / 100;

  // Points (in percentage of container)
  // Start (Bottom Right)
  const P0 = { x: 100, y: 10 }; 
  // Control Point 1 (Curve up/left)
  const P1 = { x: 70, y: 10 };
  // Control Point 2 (Curve 'S' shape)
  const P2 = { x: 60, y: 40 };
  // End (Castle Gate - Center Bottom)
  const P3 = { x: 50, y: 28 };

  // Cubic Bezier Formula: (1-t)³P0 + 3(1-t)²tP1 + 3(1-t)t²P2 + t³P3
  const cx = Math.pow(1-t, 3)*P0.x + 3*Math.pow(1-t, 2)*t*P1.x + 3*(1-t)*Math.pow(t, 2)*P2.x + Math.pow(t, 3)*P3.x;
  const cy = Math.pow(1-t, 3)*P0.y + 3*Math.pow(1-t, 2)*t*P1.y + 3*(1-t)*Math.pow(t, 2)*P2.y + Math.pow(t, 3)*P3.y;

  return { left: cx, bottom: cy };
};

export const EnemyRenderer: React.FC<EnemyRendererProps> = ({ enemies }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
      {enemies.map((enemy) => {
        const config = ENEMY_TYPES[enemy.type];
        const pos = getPathPosition(enemy.x);
        
        // Dynamic Z-Index based on Y position so lower enemies appear in front
        const zIndex = 1000 - Math.floor(pos.bottom);

        return (
          <div
            key={enemy.id}
            className={`absolute flex flex-col items-center transition-transform duration-100 ease-linear`}
            style={{ 
              left: `${pos.left}%`,
              bottom: `${pos.bottom}%`,
              transform: `scale(${config.visualScale}) translateX(-50%)`,
              zIndex: zIndex
            }}
          >
            {/* Target Value Bubble - More prominent */}
            <div className="relative mb-2">
                <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                <div className="bg-white border-4 border-red-700 rounded-full w-12 h-12 flex items-center justify-center font-black text-2xl text-slate-900 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-10">
                {enemy.value}
                </div>
            </div>

            {/* Visual Icon with Background Glow */}
            <div className="relative group">
                <div className={`absolute inset-0 blur-md opacity-50 rounded-full ${enemy.type === 'dragon' ? 'bg-red-500' : 'bg-black'}`}></div>
                <div className={`${config.color} filter drop-shadow-2xl relative z-10`}>
                  {/* Icon Mapping based on updated Types */}
                  {enemy.type === 'goblin' && <Ghost size={48} fill="currentColor" strokeWidth={1.5} />}
                  {enemy.type === 'orc' && <Dna size={48} fill="currentColor" strokeWidth={2} />} {/* Orc look tough */}
                  {enemy.type === 'dragon' && <Swords size={56} fill="currentColor" className="rotate-90" strokeWidth={2} />}
                  
                  {/* New Types */}
                  {enemy.type === 'skeleton' && <Skull size={48} fill="#e2e8f0" className="text-slate-600" strokeWidth={1.5} />}
                  {enemy.type === 'golem' && <Bot size={52} fill="currentColor" strokeWidth={1.5} />}
                  {enemy.type === 'slime' && <Droplets size={48} fill="currentColor" strokeWidth={2} />}
                </div>
                
                {/* Simple walking animation via bounce */}
                <div className="absolute -bottom-2 w-full h-2 bg-black/30 rounded-full blur-sm"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
