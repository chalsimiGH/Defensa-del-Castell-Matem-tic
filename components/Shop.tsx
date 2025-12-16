
import React from 'react';
import { X, Check, Lock, ShoppingBag, Flag, Flame, Flower, Shield, Bird, Ban, Bomb, Bookmark, Hexagon, Triangle, Eye, Heart } from 'lucide-react';
import { SHOP_ITEMS } from '../constants';
import { CastleStyle, ShopItem } from '../types';

interface ShopProps {
  currency: number;
  unlockedItems: string[];
  currentStyle: CastleStyle;
  onClose: () => void;
  onBuy: (item: ShopItem) => void;
  onEquip: (item: ShopItem) => void;
}

export const Shop: React.FC<ShopProps> = ({ 
  currency, 
  unlockedItems, 
  currentStyle, 
  onClose, 
  onBuy, 
  onEquip 
}) => {
  const categories = {
    consumable: "Objectes Especials",
    wallColor: "Colors de Muralla",
    flagType: "Banderes",
    decoration: "Decoracions"
  };

  const isEquipped = (item: ShopItem) => {
    if (item.type === 'wallColor') return currentStyle.wallColor === item.value;
    if (item.type === 'flagType') return currentStyle.flagType === item.value;
    if (item.type === 'decoration') return currentStyle.decorations.includes(item.value);
    return false;
  };

  // Helper to render the specific visual for the shop card
  const renderPreview = (item: ShopItem) => {
    switch (item.type) {
      case 'consumable':
        return <Heart size={56} className="text-red-500 fill-red-400 animate-pulse" />;
      case 'wallColor':
        return (
          <div className={`w-20 h-20 rounded-lg ${item.value} shadow-inner border-4 border-slate-600/50 flex items-center justify-center`}>
            {/* Texture hint */}
            <div className="w-full h-full opacity-20 bg-[radial-gradient(circle,_transparent_20%,_#000_20%)] bg-[length:8px_8px]"></div>
          </div>
        );
      case 'flagType':
        if (item.value === 'pirate') {
          return <Flag size={56} className="text-slate-950 fill-slate-900 drop-shadow-md" />;
        }
        if (item.value === 'royal') {
          return <Flag size={56} className="text-purple-700 fill-yellow-400 drop-shadow-md" />;
        }
        // Classic
        return <Flag size={56} className="text-blue-600 fill-blue-400 drop-shadow-md" />;
      
      case 'decoration':
        switch (item.value) {
          case 'none': return <Ban size={48} className="text-slate-500" />;
          case 'vines': return <div className="text-green-600 flex gap-1"><Flower size={32} /><Flower size={24} className="mt-4"/></div>;
          case 'garden': return <div className="text-pink-500 flex gap-1"><Flower size={32} fill="currentColor" /><Flower size={32} className="text-purple-500" fill="currentColor"/></div>;
          case 'torches': return <Flame size={52} className="text-orange-500 fill-yellow-500 animate-pulse" />;
          case 'statues': return <Shield size={52} className="text-slate-400 fill-slate-300" />;
          case 'cannons': return <div className="relative"><Bomb size={48} className="text-slate-900 fill-slate-800" /><div className="absolute -bottom-1 w-full h-1 bg-black rounded-full blur-sm"></div></div>;
          case 'dragon': return <Bird size={64} className="text-red-600 fill-orange-500" strokeWidth={1.5} />;
          
          // New Items Preview
          case 'banners': return <div className="flex gap-2"><Bookmark size={40} className="text-red-600 fill-red-600" /><Bookmark size={40} className="text-red-600 fill-red-600" /></div>;
          case 'spikes': return <div className="flex gap-[-4px]"><Triangle size={32} className="text-slate-400 fill-slate-600" /><Triangle size={32} className="text-slate-400 fill-slate-600" /><Triangle size={32} className="text-slate-400 fill-slate-600" /></div>;
          case 'gators': return <div className="bg-blue-400/30 p-2 rounded-full"><Eye size={32} className="text-green-600 fill-green-400" /></div>;
          case 'crystal': return <Hexagon size={48} className="text-cyan-400 fill-cyan-200 animate-bounce" />;
          
          default: return <span className="text-4xl">✨</span>;
        }
      default:
        return <span className="text-4xl">?</span>;
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border-4 border-slate-700 overflow-hidden animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="bg-slate-800 p-4 md:p-6 flex justify-between items-center border-b border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl">
               <ShoppingBag className="text-white" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">Botiga</h2>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="bg-slate-950 px-4 py-2 rounded-full border-2 border-slate-600 flex items-center gap-2 shadow-inner">
              <span className="text-2xl animate-pulse">💎</span>
              <span className="text-xl font-bold text-white">{currency}</span>
            </div>
            <button onClick={onClose} className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors shadow-lg active:scale-90">
              <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-10 custom-scrollbar bg-slate-900/50">
          {(Object.keys(categories) as Array<keyof typeof categories>).map((catKey) => (
            <div key={catKey} className="bg-slate-800/50 p-4 rounded-3xl border border-slate-700/50">
              <h3 className="text-xl font-black text-blue-400 mb-6 uppercase tracking-wider flex items-center gap-2">
                {catKey === 'consumable' && '🧪'}
                {catKey === 'wallColor' && '🧱'} 
                {catKey === 'flagType' && '🚩'} 
                {catKey === 'decoration' && '✨'}
                {categories[catKey]}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {SHOP_ITEMS.filter(i => i.type === catKey).map(item => {
                  const unlocked = unlockedItems.includes(item.id);
                  const equipped = isEquipped(item);
                  const canAfford = currency >= item.cost;
                  // Special check for 'none' decoration
                  const isNone = item.value === 'none' && item.type === 'decoration';
                  // Decorations are toggleable (except 'none'), others are exclusive (so "Equipped" means active)
                  const isToggleType = item.type === 'decoration';
                  const isConsumable = item.type === 'consumable';

                  return (
                    <div 
                      key={item.id} 
                      className={`
                        relative rounded-2xl p-4 border-b-4 transition-all duration-200 group
                        ${equipped 
                            ? 'bg-green-900/30 border-green-500 ring-2 ring-green-500/50' 
                            : 'bg-slate-800 border-slate-950 hover:-translate-y-1 hover:bg-slate-750'
                        }
                      `}
                    >
                      {/* Preview Box */}
                      <div className="h-28 mb-3 bg-slate-950/50 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:bg-slate-950/30 transition-colors">
                        {renderPreview(item)}
                        {equipped && (
                             <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                 <Check size={14} strokeWidth={4} />
                             </div>
                        )}
                        {isConsumable && (
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-green-400 bg-black/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                                Recupera +15 HP
                            </div>
                        )}
                      </div>
                      
                      {/* Item Info */}
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-start leading-none">
                            <p className="font-bold text-slate-200 text-sm md:text-base">{item.name}</p>
                        </div>
                        
                        <div className="flex justify-between items-center mt-2">
                            {/* Price Label */}
                            {(!unlocked || isConsumable) ? (
                                <span className={`text-sm font-bold ${canAfford ? 'text-yellow-400' : 'text-slate-500'}`}>
                                    {item.cost === 0 ? 'GRATIS' : `${item.cost} 💎`}
                                </span>
                            ) : (
                                <span className="text-xs font-bold text-slate-500 uppercase">En propietat</span>
                            )}

                            {/* Action Button */}
                            {isConsumable ? (
                                <button 
                                onClick={() => onBuy(item)}
                                disabled={!canAfford}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 uppercase tracking-wide transition-all ${canAfford ? 'bg-green-600 hover:bg-green-500 text-white active:translate-y-0.5' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                >
                                {canAfford ? 'Comprar' : <Lock size={12} />}
                                </button>
                            ) : unlocked ? (
                                <button 
                                onClick={() => onEquip(item)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md active:translate-y-0.5 uppercase tracking-wide
                                    ${equipped 
                                        ? isToggleType && !isNone 
                                            ? 'bg-red-500 hover:bg-red-600 text-white' // Toggle off
                                            : 'bg-green-600 text-white cursor-default' // Active/Exclusive
                                        : 'bg-blue-600 hover:bg-blue-500 text-white' // Equip/Toggle on
                                    }`}
                                >
                                {equipped 
                                    ? isToggleType && !isNone ? 'Treure' : 'Actiu'
                                    : isNone ? 'Netejar' : 'Posar'
                                }
                                </button>
                            ) : (
                                <button 
                                onClick={() => onBuy(item)}
                                disabled={!canAfford}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1 uppercase tracking-wide transition-all ${canAfford ? 'bg-yellow-600 hover:bg-yellow-500 text-white active:translate-y-0.5' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}
                                >
                                {canAfford ? 'Comprar' : <Lock size={12} />}
                                </button>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
