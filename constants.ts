
import { DifficultyConfig, EnemyType, ShopItem } from './types';

export const INITIAL_HEALTH = 100;

export const ENEMY_TYPES: Record<EnemyType, { speed: number; visualScale: number; color: string; label: string }> = {
  goblin: { speed: 0.04, visualScale: 1.2, color: 'text-green-500', label: 'Goblin' },
  orc: { speed: 0.025, visualScale: 1.6, color: 'text-emerald-700', label: 'Orc' },
  dragon: { speed: 0.015, visualScale: 2.5, color: 'text-red-600', label: 'Drac' },
  skeleton: { speed: 0.035, visualScale: 1.3, color: 'text-slate-300', label: 'Esquelet' },
  golem: { speed: 0.02, visualScale: 1.8, color: 'text-stone-600', label: 'Golem' },
  slime: { speed: 0.03, visualScale: 1.4, color: 'text-lime-400', label: 'Slime' },
  boss: { speed: 0.01, visualScale: 3.5, color: 'text-purple-950', label: 'El Segador' },
};

// Difficulty Progression Logic
export const getDifficultyConfig = (level: number): DifficultyConfig => {
  if (level === 1) {
    return {
      spawnRate: 5500,
      enemySpeedBase: 0.8,
      allowedOperators: ['+', '-'],
      numberRange: { min: 2, max: 9 },
      availableButtons: [1, 2, 3, 4, 5],
    };
  }
  if (level === 2) {
    return {
      spawnRate: 5000,
      enemySpeedBase: 1.0,
      allowedOperators: ['+', '-'],
      numberRange: { min: 2, max: 15 },
      availableButtons: [1, 2, 3, 4, 5, 10],
    };
  }
  if (level <= 4) {
    return {
      spawnRate: 4500,
      enemySpeedBase: 1.1,
      allowedOperators: ['+', '-', '×'],
      numberRange: { min: 5, max: 25 },
      availableButtons: [1, 2, 3, 4, 5, 10],
    };
  }
  return {
    spawnRate: 4000,
    enemySpeedBase: 1.3 + (level * 0.05),
    allowedOperators: ['+', '-', '×', '÷'],
    numberRange: { min: 8, max: 30 + (level * 2) },
    availableButtons: [1, 2, 3, 4, 5, 10, 20],
  };
};

export const SHOP_ITEMS: ShopItem[] = [
  // Colors
  { id: 'color_slate', name: 'Pedra Clàssica', type: 'wallColor', value: 'bg-slate-400', cost: 0, icon: null },
  { id: 'color_sand', name: 'Sorra del Desert', type: 'wallColor', value: 'bg-amber-200', cost: 10, icon: null },
  { id: 'color_dark', name: 'Fortalesa Fosca', type: 'wallColor', value: 'bg-slate-800', cost: 25, icon: null },
  { id: 'color_pink', name: 'Castell de Somni', type: 'wallColor', value: 'bg-pink-300', cost: 40, icon: null },
  
  // Flags
  { id: 'flag_classic', name: 'Banderes Blaves', type: 'flagType', value: 'classic', cost: 0, icon: null },
  { id: 'flag_royal', name: 'Estendard Reial', type: 'flagType', value: 'royal', cost: 15, icon: null },
  { id: 'flag_pirate', name: 'Pirata', type: 'flagType', value: 'pirate', cost: 30, icon: null },

  // Decorations (Now tiered)
  { id: 'deco_cannons', name: 'Canons de Defensa', type: 'decoration', value: 'cannons', cost: 0, icon: null },
  { id: 'deco_none', name: 'Sense Decoració', type: 'decoration', value: 'none', cost: 0, icon: null },
  
  { id: 'deco_vines', name: 'Enfiladisses', type: 'decoration', value: 'vines', cost: 10, icon: null },
  { id: 'deco_garden', name: 'Jardí Reial', type: 'decoration', value: 'garden', cost: 20, icon: null },
  { id: 'deco_torches', name: 'Torxes Màgiques', type: 'decoration', value: 'torches', cost: 35, icon: null },
  { id: 'deco_statues', name: 'Estàtues Guardians', type: 'decoration', value: 'statues', cost: 50, icon: null },
  
  // New Items
  { id: 'deco_banners', name: 'Estendards Llargs', type: 'decoration', value: 'banners', cost: 60, icon: null },
  { id: 'deco_spikes', name: 'Punxes de Ferro', type: 'decoration', value: 'spikes', cost: 80, icon: null },
  { id: 'deco_gators', name: 'Cocodrils al Fossat', type: 'decoration', value: 'gators', cost: 100, icon: null },
  
  { id: 'deco_dragon', name: 'Drac Mascota', type: 'decoration', value: 'dragon', cost: 150, icon: null },
  { id: 'deco_crystal', name: 'Cristall del Mag', type: 'decoration', value: 'crystal', cost: 200, icon: null },
];
