import React from 'react';
import { Play } from 'lucide-react';

interface TutorialProps {
  onStart: () => void;
}

export const Tutorial: React.FC<TutorialProps> = ({ onStart }) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl border-8 border-indigo-500 animate-in fade-in zoom-in duration-300">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 mb-6">
          🏰 Com defensar el Castell?
        </h1>
        
        <div className="space-y-6 text-lg text-slate-700">
          <div className="flex items-start gap-4">
            <div className="bg-red-100 p-3 rounded-full text-2xl">👾</div>
            <div>
              <p className="font-bold">Els enemics tenen un número.</p>
              <p className="text-sm text-slate-500">Exemple: Un Goblin amb el número 8.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full text-2xl">🧮</div>
            <div>
              <p className="font-bold">Crea una operació que doni aquest número.</p>
              <p className="text-sm text-slate-500">Exemple: 4 + 4 o 10 - 2.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-green-100 p-3 rounded-full text-2xl">⚔️</div>
            <div>
              <p className="font-bold">Prem el botó d'Atac!</p>
              <p className="text-sm text-slate-500">Si encertes, l'enemic sortirà disparat!</p>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200 text-center">
            <p className="text-yellow-800 font-bold">Consell: Guanya gemmes 💎 per personalitzar el teu castell!</p>
          </div>
        </div>

        <button 
          onClick={onStart}
          className="mt-8 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-2xl font-bold py-4 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all"
        >
          <Play size={32} fill="white" />
          Entesos, a jugar!
        </button>
      </div>
    </div>
  );
};
