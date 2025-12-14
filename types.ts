
import React from 'react';

export type Operator = '+' | '-' | '×' | '÷';
export type EnemyType = 'goblin' | 'orc' | 'dragon' | 'skeleton' | 'golem' | 'slime' | 'boss';
export type EnemyStatus = 'walking' | 'attacking' | 'dying';

export interface Enemy {
  id: string;
  value: number;
  type: EnemyType;
  x: number; // Progress percentage (100 = start, 0 = castle gate)
  speed: number;
  maxHealth: number; 
  status: EnemyStatus;
  animationStartTime?: number;
  hitsRemaining?: number; // For Boss mechanic
}

export type GamePhase = 'tutorial' | 'playing' | 'level_complete' | 'shop' | 'gameover';

export interface CastleStyle {
  wallColor: string;
  flagType: 'classic' | 'royal' | 'pirate';
  // UPDATED: Now an array of strings to allow multiple decorations
  decorations: string[];
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'wallColor' | 'flagType' | 'decoration';
  value: string;
  cost: number;
  icon: React.ReactNode;
}

export interface GameState {
  phase: GamePhase;
  score: number;
  level: number;
  enemiesDefeated: number; // Current level progress
  health: number;
  maxHealth: number;
  currency: number; // Pedres màgiques
  unlockedItems: string[]; // IDs of unlocked shop items
  castleStyle: CastleStyle;
}

export interface EquationItem {
  id: string;
  value: number | Operator;
  type: 'number' | 'operator';
}

export interface DifficultyConfig {
  spawnRate: number;
  enemySpeedBase: number;
  allowedOperators: Operator[];
  numberRange: { min: number; max: number };
  availableButtons: number[];
}
