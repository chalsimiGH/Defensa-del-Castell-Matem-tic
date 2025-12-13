
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Castle } from './components/Castle';
import { EnemyRenderer } from './components/EnemyRenderer';
import { ControlPanel } from './components/ControlPanel';
import { Tutorial } from './components/Tutorial';
import { Shop } from './components/Shop';
import { GameState, Enemy, EquationItem, Operator, ShopItem, EnemyType } from './types';
import { INITIAL_HEALTH, getDifficultyConfig, ENEMY_TYPES } from './constants';
import { evaluateEquation, generateTargetNumber } from './utils/mathEngine';
import { Zap, Trophy, RotateCcw, ShoppingBag, ArrowRight, Star } from 'lucide-react';

export default function App() {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    phase: 'tutorial',
    score: 0,
    level: 1,
    enemiesDefeated: 0,
    health: INITIAL_HEALTH,
    maxHealth: INITIAL_HEALTH,
    currency: 0,
    unlockedItems: ['color_slate', 'flag_classic', 'deco_none'],
    castleStyle: {
      wallColor: 'bg-slate-400',
      flagType: 'classic',
      decoration: 'none'
    }
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [equation, setEquation] = useState<EquationItem[]>([]);
  const [evaluatedResult, setEvaluatedResult] = useState<number | null>(null);
  const [castleShaking, setCastleShaking] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<{ x: number, text: string, type: 'hit' | 'miss' } | null>(null);

  // Constants for level progression
  const getEnemiesPerLevel = (level: number) => 5 + (level * 2);

  // Refs for loop
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(0);

  // Transitions
  const enterShop = () => {
    setGameState(prev => ({ ...prev, phase: 'shop' }));
    setEnemies([]); // Clear enemies when entering shop to be safe
  };

  const closeShop = () => {
    // If we were in level_complete, go back there. Otherwise go to playing.
    const enemiesTarget = getEnemiesPerLevel(gameState.level);
    if (gameState.enemiesDefeated >= enemiesTarget) {
        setGameState(prev => ({ ...prev, phase: 'level_complete' }));
    } else {
        setGameState(prev => ({ ...prev, phase: 'playing' }));
    }
  };

  const nextLevel = () => {
    setGameState(prev => ({
      ...prev,
      level: prev.level + 1,
      enemiesDefeated: 0, // Reset progress for new level
      phase: 'playing',
      health: Math.min(prev.maxHealth, prev.health + 20) // Small heal
    }));
    setEnemies([]);
    setEquation([]);
    setEvaluatedResult(null);
    lastUpdateRef.current = performance.now();
    nextSpawnTimeRef.current = performance.now() + 2000;
  };

  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      score: 0,
      level: 1,
      enemiesDefeated: 0,
      health: INITIAL_HEALTH,
      maxHealth: INITIAL_HEALTH,
    }));
    setEnemies([]);
    setEquation([]);
    setEvaluatedResult(null);
    lastUpdateRef.current = performance.now();
    nextSpawnTimeRef.current = performance.now() + 2000;
  };

  const handleBuyItem = (item: ShopItem) => {
    if (gameState.currency >= item.cost && !gameState.unlockedItems.includes(item.id)) {
      setGameState(prev => ({
        ...prev,
        currency: prev.currency - item.cost,
        unlockedItems: [...prev.unlockedItems, item.id]
      }));
    }
  };

  const handleEquipItem = (item: ShopItem) => {
    setGameState(prev => ({
      ...prev,
      castleStyle: {
        ...prev.castleStyle,
        [item.type]: item.value
      }
    }));
  };

  const difficulty = getDifficultyConfig(gameState.level);

  // Input Handlers
  const handleAddNumber = (num: number) => {
    const newItem: EquationItem = { id: Date.now().toString() + Math.random(), value: num, type: 'number' };
    const newEq = [...equation, newItem];
    setEquation(newEq);
    setEvaluatedResult(evaluateEquation(newEq));
  };

  const handleAddOperator = (op: Operator) => {
    if (equation.length === 0 || equation[equation.length - 1].type === 'operator') return;
    const newItem: EquationItem = { id: Date.now().toString() + Math.random(), value: op, type: 'operator' };
    const newEq = [...equation, newItem];
    setEquation(newEq);
    setEvaluatedResult(evaluateEquation(newEq));
  };

  const handleBackspace = () => {
    const newEq = equation.slice(0, -1);
    setEquation(newEq);
    setEvaluatedResult(evaluateEquation(newEq));
  };

  const handleClear = () => {
    setEquation([]);
    setEvaluatedResult(null);
  };

  const handleAttack = () => {
    if (evaluatedResult === null) return;

    const sortedEnemies = [...enemies].sort((a, b) => a.x - b.x);
    const targetIndex = sortedEnemies.findIndex(e => e.value === evaluatedResult);

    if (targetIndex !== -1) {
      // HIT!
      const target = sortedEnemies[targetIndex];
      setFeedbackEffect({ x: target.x, text: '💥', type: 'hit' });
      setTimeout(() => setFeedbackEffect(null), 500);
      setEnemies(prev => prev.filter(e => e.id !== target.id));
      
      setGameState(prev => {
        const newScore = prev.score + (prev.level * 10);
        const coinGain = 1 + Math.floor(prev.level / 3);
        const newDefeated = prev.enemiesDefeated + 1;
        
        // Check Level Complete Condition
        const enemiesTarget = getEnemiesPerLevel(prev.level);
        
        if (newDefeated >= enemiesTarget) {
            // Level Complete!
            return {
                ...prev,
                score: newScore,
                enemiesDefeated: newDefeated,
                currency: prev.currency + coinGain + 5, // Bonus currency for level finish
                phase: 'level_complete'
            };
        }

        return {
          ...prev,
          score: newScore,
          enemiesDefeated: newDefeated,
          currency: prev.currency + coinGain
        };
      });
      handleClear();
    } else {
      // MISS!
      setCastleShaking(true);
      setTimeout(() => setCastleShaking(false), 500);
      setEnemies(prev => prev.map(e => ({ ...e, x: Math.max(0, e.x - 5) })));
    }
  };

  // Helper for enemy types based on number
  const getEnemyTypeForNumber = (num: number, level: number): EnemyType => {
    if (num === 5 || (num > 10 && num % 5 === 0 && num % 10 !== 0)) return 'skeleton'; 
    if (num === 7 || (num > 10 && num % 10 === 7)) return 'golem';
    if (num % 10 === 0) return 'slime';

    if (level >= 5 && Math.random() > 0.8) return 'dragon';
    if (level >= 3 && Math.random() > 0.6) return 'orc';
    
    return 'goblin';
  };

  // Game Loop
  const loop = useCallback((timestamp: number) => {
    if (gameState.phase !== 'playing') return;

    if (gameState.health <= 0) {
      setGameState(prev => ({ ...prev, phase: 'gameover' }));
      return;
    }

    const deltaTime = timestamp - lastUpdateRef.current;
    lastUpdateRef.current = timestamp;

    // 1. Spawning Logic
    const lastEnemy = enemies.length > 0 ? enemies[enemies.length - 1] : null;
    const canSpawn = timestamp > nextSpawnTimeRef.current && (!lastEnemy || lastEnemy.x < 60);

    // Stop spawning if we are close to finishing level to let user clear screen
    const enemiesTarget = getEnemiesPerLevel(gameState.level);
    const enemiesRemainingToSpawn = enemiesTarget - gameState.enemiesDefeated - enemies.length;

    if (canSpawn && enemiesRemainingToSpawn > 0) {
      const newVal = generateTargetNumber(difficulty.numberRange.min, difficulty.numberRange.max);
      const type = getEnemyTypeForNumber(newVal, gameState.level);
      
      const newEnemy: Enemy = {
        id: timestamp.toString(),
        value: newVal,
        type: type,
        x: 100, 
        speed: ENEMY_TYPES[type].speed * difficulty.enemySpeedBase,
        maxHealth: 1,
      };

      setEnemies(prev => [...prev, newEnemy]);
      nextSpawnTimeRef.current = timestamp + difficulty.spawnRate + (Math.random() * 1000 - 500);
    }

    // 2. Movement
    setEnemies(prevEnemies => {
      const nextEnemies: Enemy[] = [];
      let damageTaken = 0;

      prevEnemies.forEach(enemy => {
        const moveAmount = (enemy.speed * deltaTime) / 16; 
        const newX = enemy.x - moveAmount;

        if (newX <= 0) {
          damageTaken += 20; 
        } else {
          nextEnemies.push({ ...enemy, x: newX });
        }
      });

      if (damageTaken > 0) {
        setGameState(prev => ({ ...prev, health: Math.max(0, prev.health - damageTaken) }));
        setCastleShaking(true);
        setTimeout(() => setCastleShaking(false), 500);
      }
      return nextEnemies;
    });

    animationFrameRef.current = requestAnimationFrame(loop);
  }, [gameState.phase, gameState.health, gameState.level, difficulty, enemies, gameState.enemiesDefeated]);

  useEffect(() => {
    if (gameState.phase === 'playing') {
      lastUpdateRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animationFrameRef.current);
  }, [loop, gameState.phase]);

  // Calculations for progress bar
  const progressPercent = Math.min(100, (gameState.enemiesDefeated / getEnemiesPerLevel(gameState.level)) * 100);

  return (
    <div className="h-[100dvh] w-full bg-sky-300 overflow-hidden flex flex-col font-sans select-none relative">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-20 text-white/40 animate-pulse"><Zap size={64} /></div>
        <div className="absolute top-24 right-40 text-white/40 animate-pulse delay-700"><Zap size={48} /></div>
        
        {/* Ground */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-green-800 to-green-500"></div>
        
        {/* SVG Path Visual */}
        <svg className="absolute bottom-0 left-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
             <path 
                d="M 100% 90% C 70% 90%, 60% 60%, 50% 72%" 
                stroke="#78350f" 
                strokeWidth="60" 
                fill="none" 
                strokeLinecap="round"
                className="opacity-50"
             />
             <path 
                d="M 100% 90% C 70% 90%, 60% 60%, 50% 72%" 
                stroke="#92400e" 
                strokeWidth="40" 
                fill="none" 
                strokeLinecap="round"
                strokeDasharray="20 10"
             />
        </svg>
      </div>

      {/* Top Stats Bar */}
      <div className="relative z-30 flex flex-col gap-2 p-4">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg border-2 border-slate-200">
            <div className="bg-yellow-400 p-1 rounded-full"><Trophy size={20} className="text-yellow-900"/></div>
            <span className="font-bold text-slate-800 text-lg">{gameState.score}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-indigo-600/90 text-white rounded-full px-4 py-2 shadow-lg border-2 border-indigo-400">
            <span className="font-bold uppercase text-sm">Nivell</span>
            <span className="font-bold text-xl">{gameState.level}</span>
            </div>

            <button 
            onClick={enterShop}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg font-bold border-2 border-blue-400 transition-transform active:scale-95"
            >
            <span>💎 {gameState.currency}</span>
            <ShoppingBag size={18} />
            </button>
        </div>
        
        {/* Level Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-slate-900/50 rounded-full h-3 border border-slate-700 overflow-hidden backdrop-blur-sm">
             <div className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative w-full max-w-7xl mx-auto flex flex-col z-10">
        <div className="flex-1 relative flex items-end justify-center pb-8 md:pb-12"> 
            <Castle 
                health={gameState.health} 
                maxHealth={gameState.maxHealth} 
                isShaking={castleShaking}
                style={gameState.castleStyle}
            />
            
            <EnemyRenderer enemies={enemies} />

            {feedbackEffect && (
              <div 
                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 text-8xl animate-ping origin-center pointer-events-none z-50 text-white drop-shadow-md"
              >
                {feedbackEffect.text}
              </div>
            )}
        </div>
      </div>

      {/* Inputs */}
      <div className="relative z-50 shrink-0">
        <ControlPanel 
            availableButtons={difficulty.availableButtons}
            allowedOperators={difficulty.allowedOperators}
            currentEquation={equation}
            evaluatedResult={evaluatedResult}
            onAddNumber={handleAddNumber}
            onAddOperator={handleAddOperator}
            onBackspace={handleBackspace}
            onClear={handleClear}
            onAttack={handleAttack}
        />
      </div>

      {/* Overlays */}
      {gameState.phase === 'tutorial' && (
        <Tutorial onStart={startGame} />
      )}

      {gameState.phase === 'shop' && (
        <Shop 
          currency={gameState.currency}
          unlockedItems={gameState.unlockedItems}
          currentStyle={gameState.castleStyle}
          onClose={closeShop}
          onBuy={handleBuyItem}
          onEquip={handleEquipItem}
        />
      )}

      {gameState.phase === 'level_complete' && (
          <div className="absolute inset-0 z-50 bg-indigo-900/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl p-8 max-w-lg w-full text-center border-8 border-yellow-400 shadow-[0_0_50px_rgba(250,204,21,0.5)] animate-in zoom-in">
                  <div className="flex justify-center mb-4">
                      <div className="relative">
                        <Star size={80} className="text-yellow-400 fill-yellow-400 animate-spin-slow" />
                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-yellow-800">
                            {gameState.level}
                        </div>
                      </div>
                  </div>
                  <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
                      Nivell Completat!
                  </h1>
                  <p className="text-slate-500 mb-8 text-lg">
                     Molt bona feina defensant el castell.
                  </p>

                  <div className="grid grid-cols-1 gap-4">
                    <button 
                        onClick={enterShop}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-xl shadow-[0_6px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all"
                    >
                        <ShoppingBag size={28}/> Visitar la Botiga
                    </button>
                    <button 
                        onClick={nextLevel}
                        className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all animate-pulse"
                    >
                        Següent Nivell <ArrowRight size={28}/> 
                    </button>
                  </div>
              </div>
          </div>
      )}

      {gameState.phase === 'gameover' && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border-8 border-red-500 animate-in zoom-in">
                <h1 className="text-4xl font-extrabold text-red-600 mb-2">
                    Castell Derrotat!
                </h1>
                <p className="text-slate-500 mb-8 text-lg">
                   Has sobreviscut fins al nivell <span className="font-bold text-slate-900">{gameState.level}</span><br/>
                   Puntuació final: <span className="font-bold text-slate-900">{gameState.score}</span>
                </p>

                <div className="flex flex-col gap-3">
                  <button 
                      onClick={startGame}
                      className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-bold py-4 rounded-xl shadow-[0_6px_0_rgb(21,128,61)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all"
                  >
                      <RotateCcw size={28}/> Tornar a intentar
                  </button>
                  <button 
                      onClick={enterShop}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xl font-bold py-4 rounded-xl shadow-[0_6px_0_rgb(29,78,216)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all"
                  >
                      <ShoppingBag size={28}/> Anar a la Botiga
                  </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
