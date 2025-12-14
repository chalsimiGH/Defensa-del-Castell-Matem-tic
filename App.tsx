
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Castle } from './components/Castle';
import { EnemyRenderer } from './components/EnemyRenderer';
import { ControlPanel } from './components/ControlPanel';
import { Tutorial } from './components/Tutorial';
import { Shop } from './components/Shop';
import { GameState, Enemy, EquationItem, Operator, ShopItem, EnemyType } from './types';
import { INITIAL_HEALTH, getDifficultyConfig, ENEMY_TYPES } from './constants';
import { evaluateEquation, generateTargetNumber } from './utils/mathEngine';
import { Trophy, RotateCcw, ShoppingBag, ArrowRight, Star, Volume2, VolumeX, Music } from 'lucide-react';

// --- RETRO BACKGROUND HELPERS ---

const PixelCloud = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <div 
    className={`absolute opacity-80 ${className}`} 
    style={{ animation: `float-slow ${30 + delay * 5}s linear infinite`, animationDelay: `-${delay * 10}s` }}
  >
     <div className="w-16 h-6 bg-white relative shadow-sm">
        <div className="absolute -top-6 left-4 w-8 h-6 bg-white"></div>
        <div className="absolute -top-4 left-8 w-10 h-10 bg-white"></div>
        <div className="absolute top-2 left-2 w-12 h-4 bg-white"></div>
     </div>
  </div>
);

const PixelTree = ({ className, scale = 1 }: { className?: string, scale?: number }) => (
    <div className={`absolute flex flex-col items-center pointer-events-none z-10 ${className}`} style={{ transform: `scale(${scale})` }}>
        {/* Leaves - Pyramid of blocks */}
        <div className="w-4 h-4 bg-emerald-300/40 absolute -top-2 -left-2 rounded-full blur-xl"></div>
        <div className="w-2 h-4 bg-emerald-800"></div>
        <div className="w-8 h-4 bg-emerald-700"></div>
        <div className="w-14 h-4 bg-emerald-800"></div>
        <div className="w-10 h-4 bg-emerald-700"></div>
        <div className="w-20 h-4 bg-emerald-600"></div>
        <div className="w-16 h-4 bg-emerald-700"></div>
        <div className="w-28 h-4 bg-emerald-600"></div>
        <div className="w-24 h-4 bg-emerald-700"></div>
        <div className="w-32 h-4 bg-emerald-600"></div>
        
        {/* Trunk */}
        <div className="w-6 h-8 bg-amber-900 border-x-4 border-amber-950"></div>
    </div>
);

const PixelMountain = () => (
    <svg className="absolute bottom-0 w-full h-[60%] pointer-events-none opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
        {/* Rear Mountains (Purple/Dark) */}
        <path d="M0,100 L0,70 L5,70 L5,60 L10,60 L10,45 L15,45 L15,35 L20,35 L20,40 L25,40 L25,50 L30,50 L30,65 L35,65 L35,80 L40,80 L40,60 L45,60 L45,40 L50,40 L50,30 L55,30 L55,45 L60,45 L60,70 L65,70 L65,85 L70,85 L70,60 L75,60 L75,50 L80,50 L80,65 L85,65 L85,45 L90,45 L90,60 L95,60 L95,80 L100,80 L100,100 Z" fill="#475569" />
        
        {/* Front Mountains (Blueish) */}
        <path d="M0,100 L0,85 L8,85 L8,75 L15,75 L15,65 L22,65 L22,75 L30,75 L30,85 L38,85 L38,70 L45,70 L45,60 L52,60 L52,70 L60,70 L60,80 L68,80 L68,65 L75,65 L75,55 L82,55 L82,65 L90,65 L90,80 L95,80 L95,90 L100,90 L100,100 Z" fill="#64748b" opacity="0.8" />
    </svg>
);


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
    unlockedItems: ['color_slate', 'flag_classic', 'deco_cannons'],
    castleStyle: {
      wallColor: 'bg-slate-400',
      flagType: 'classic',
      decorations: ['cannons']
    }
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [equation, setEquation] = useState<EquationItem[]>([]);
  const [evaluatedResult, setEvaluatedResult] = useState<number | null>(null);
  const [castleShaking, setCastleShaking] = useState(false);
  const [isAttacking, setIsAttacking] = useState(false);
  const [feedbackEffect, setFeedbackEffect] = useState<{ x: number, text: string, type: 'hit' | 'miss' } | null>(null);
  
  // Audio State
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);
  
  const musicRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<HTMLAudioElement>(null);
  
  // Track if game has started to allow autoplay after interaction
  const [hasStarted, setHasStarted] = useState(false); 

  // Constants for level progression
  const getEnemiesPerLevel = (level: number) => 5 + (level * 2);

  // Refs for loop
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(0);

  // Background Music Logic
  useEffect(() => {
    if (!musicRef.current) return;

    if (hasStarted && !isMusicMuted) {
        musicRef.current.volume = 0.3;
        const playPromise = musicRef.current.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Audio autoplay prevented:", error);
            });
        }
    } else {
        musicRef.current.pause();
    }
  }, [hasStarted, isMusicMuted]);

  // SFX Helper
  const playHitSound = () => {
    if (!isSfxMuted && sfxRef.current) {
        // Clone the node to allow overlapping sounds (rapid fire)
        const sound = sfxRef.current.cloneNode() as HTMLAudioElement;
        sound.volume = 0.5;
        sound.play().catch(e => console.log("SFX play failed:", e));
    }
  };

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
    setHasStarted(true); 
    
    // Explicitly try to play music on user interaction event
    if (musicRef.current && !isMusicMuted) {
        musicRef.current.volume = 0.3;
        musicRef.current.play().catch(e => console.log("Start game music play failed:", e));
    }

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

  // Logic to handle buying an item
  const handleBuyItem = (item: ShopItem) => {
    if (gameState.currency >= item.cost && !gameState.unlockedItems.includes(item.id)) {
      setGameState(prev => {
        // Logic for auto-equipping after purchase
        let newStyle = { ...prev.castleStyle };
        
        if (item.type === 'decoration') {
            // For decorations, we add to the array (stackable)
            if (!newStyle.decorations.includes(item.value) && item.value !== 'none') {
                newStyle.decorations = [...newStyle.decorations, item.value];
            }
        } else {
            // For walls and flags, we replace (exclusive)
            // @ts-ignore - dynamic key access
            newStyle[item.type] = item.value;
        }

        return {
          ...prev,
          currency: prev.currency - item.cost,
          unlockedItems: [...prev.unlockedItems, item.id],
          castleStyle: newStyle
        };
      });
    }
  };

  // Logic to handle equipping/unequipping items
  const handleEquipItem = (item: ShopItem) => {
    setGameState(prev => {
        let newStyle = { ...prev.castleStyle };

        if (item.type === 'decoration') {
            if (item.value === 'none') {
                 // Clicking "none" clears all decorations
                 newStyle.decorations = [];
            } else {
                // Toggle logic: If equipped, remove it. If not, add it.
                if (newStyle.decorations.includes(item.value)) {
                    newStyle.decorations = newStyle.decorations.filter(d => d !== item.value);
                } else {
                    newStyle.decorations = [...newStyle.decorations, item.value];
                }
            }
        } else {
            // Exclusive logic for walls and flags
            // @ts-ignore
            newStyle[item.type] = item.value;
        }

        return {
            ...prev,
            castleStyle: newStyle
        };
    });
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

    // Filter out already dying or attacking enemies from being targeted
    const activeEnemies = [...enemies].filter(e => e.status === 'walking');
    const sortedEnemies = activeEnemies.sort((a, b) => a.x - b.x);
    const targetIndex = sortedEnemies.findIndex(e => e.value === evaluatedResult);

    if (targetIndex !== -1) {
      // HIT!
      const target = sortedEnemies[targetIndex];
      playHitSound(); // Trigger SFX

      setFeedbackEffect({ x: target.x, text: '💥', type: 'hit' });
      setTimeout(() => setFeedbackEffect(null), 500);
      
      // Trigger Cannon Animation
      setIsAttacking(true);
      setTimeout(() => setIsAttacking(false), 200);

      // Update Enemy Status to 'dying' instead of removing immediately
      setEnemies(prev => prev.map(e => 
        e.id === target.id 
          ? { ...e, status: 'dying', animationStartTime: performance.now() } 
          : e
      ));
      
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
    // Count active and defeated enemies to know if we need more
    const activeAndDefeatedCount = gameState.enemiesDefeated + enemies.filter(e => e.status !== 'dying').length;
    const enemiesRemainingToSpawn = enemiesTarget - activeAndDefeatedCount;

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
        status: 'walking',
        animationStartTime: 0
      };

      setEnemies(prev => [...prev, newEnemy]);
      nextSpawnTimeRef.current = timestamp + difficulty.spawnRate + (Math.random() * 1000 - 500);
    }

    // 2. Movement & Animations
    setEnemies(prevEnemies => {
      const nextEnemies: Enemy[] = [];
      let damageTaken = 0;
      const now = performance.now();

      prevEnemies.forEach(enemy => {
        // Handle Dying Animation
        if (enemy.status === 'dying') {
            // Keep for 500ms to show animation
            if (now - (enemy.animationStartTime || 0) < 500) {
                nextEnemies.push(enemy);
            }
            return;
        }

        // Handle Attacking Animation
        if (enemy.status === 'attacking') {
             // Keep for 300ms to show attack impact
             if (now - (enemy.animationStartTime || 0) < 300) {
                nextEnemies.push(enemy);
             }
             return;
        }

        // Handle Walking
        const moveAmount = (enemy.speed * deltaTime) / 16;
        const newX = enemy.x - moveAmount;

        if (newX <= 0) {
          // Trigger Attack
          damageTaken += 20; 
          nextEnemies.push({
              ...enemy,
              x: 0,
              status: 'attacking',
              animationStartTime: now
          });
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
    // UPDATED: 'fixed inset-0 h-[100dvh]' prevents scrolling and respects mobile address bars
    <div className="fixed inset-0 w-full h-[100dvh] bg-sky-300 overflow-hidden flex flex-col font-sans select-none">
      
      {/* Background Music */}
      <audio 
        ref={musicRef} 
        loop 
        preload="auto"
        src="https://ia800104.us.archive.org/18/items/8-bit-loop/8-bit-loop.mp3" 
      />
      
      {/* Attack SFX */}
      <audio 
        ref={sfxRef} 
        preload="auto"
        src="https://ia902302.us.archive.org/19/items/8-bit-sfx-pack/12_Explosion_02.mp3" 
      />

      {/* --- NEW 8-BIT RETRO BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-blue-400 via-indigo-300 to-pink-200">
        
        {/* Sun (Pixel Square) */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-300 border-4 border-yellow-500 shadow-lg animate-pulse"></div>

        {/* Pixel Clouds */}
        <PixelCloud className="top-20 -left-20" delay={0} />
        <PixelCloud className="top-40 -left-40 scale-75" delay={1} />
        <PixelCloud className="top-10 -left-10 scale-50 opacity-50" delay={2} />

        {/* 8-Bit Mountains */}
        <PixelMountain />

        {/* Pixel Trees - Scattered randomly */}
        <PixelTree className="bottom-[33%] left-[5%] opacity-90" scale={0.8} />
        <PixelTree className="bottom-[33%] left-[15%]" scale={1.2} />
        <PixelTree className="bottom-[33%] left-[85%]" scale={1} />
        <PixelTree className="bottom-[33%] left-[95%] opacity-80" scale={0.6} />

        {/* Ground with pixel grass border */}
        <div className="absolute bottom-0 w-full h-1/3 bg-green-600">
             {/* Pixel Grass Border Top */}
             <div className="absolute -top-4 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIiBmaWxsPSJub25lIj48cmVjdCB4PSIwIiB5PSIxMCIgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjMTY2NTM0Ii8+PHJlY3QgeD0iMTAiIHk9IjAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzE2NjUzNCIvPjwvc3ZnPg==')] bg-repeat-x"></div>
             {/* Gradient Overlay for depth */}
             <div className="absolute inset-0 bg-gradient-to-t from-green-900 via-green-800 to-transparent opacity-60"></div>
        </div>

      </div>
      {/* --- END BACKGROUND --- */}

      {/* Top Stats Bar */}
      <div className="relative z-30 flex flex-col gap-2 p-2 md:p-4 shrink-0">
        <div className="flex justify-between items-center">
            {/* Score */}
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg border-2 border-slate-200">
                <div className="bg-yellow-400 p-1 rounded-full"><Trophy size={20} className="text-yellow-900"/></div>
                <span className="font-bold text-slate-800 text-lg">{gameState.score}</span>
            </div>
            
            {/* Level */}
            <div className="flex items-center gap-2 bg-indigo-600/90 text-white rounded-full px-4 py-2 shadow-lg border-2 border-indigo-400">
                <span className="font-bold uppercase text-sm">Nivell</span>
                <span className="font-bold text-xl">{gameState.level}</span>
            </div>

            <div className="flex gap-2">
                {/* Music Toggle */}
                <button
                    onClick={() => setIsMusicMuted(!isMusicMuted)}
                    className={`flex items-center justify-center rounded-full w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 shadow-lg font-bold border-2 transition-transform active:scale-95 ${isMusicMuted ? 'bg-slate-200 text-slate-400 border-slate-300' : 'bg-white/90 hover:bg-white text-pink-600 border-pink-200'}`}
                    title="Música"
                >
                    {isMusicMuted ? <Music size={20} className="opacity-50" /> : <Music size={20} />}
                </button>

                {/* SFX Toggle */}
                <button
                    onClick={() => setIsSfxMuted(!isSfxMuted)}
                    className={`flex items-center justify-center rounded-full w-10 h-10 md:w-auto md:h-auto md:px-4 md:py-2 shadow-lg font-bold border-2 transition-transform active:scale-95 ${isSfxMuted ? 'bg-slate-200 text-slate-400 border-slate-300' : 'bg-white/90 hover:bg-white text-blue-600 border-blue-200'}`}
                    title="Efectes de so"
                >
                    {isSfxMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                </button>

                {/* Shop Button */}
                <button 
                    onClick={enterShop}
                    className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4 py-2 shadow-lg font-bold border-2 border-blue-400 transition-transform active:scale-95"
                >
                    <span>💎 {gameState.currency}</span>
                    <ShoppingBag size={18} />
                </button>
            </div>
        </div>
        
        {/* Level Progress Bar */}
        <div className="w-full max-w-md mx-auto bg-slate-900/50 rounded-full h-3 border border-slate-700 overflow-hidden backdrop-blur-sm">
             <div className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>

      {/* 
          SPLIT LAYOUT CONTAINER 
          Portrait: Flex-Col (Game Top, Controls Bottom)
          Landscape: Flex-Row (Game Left, Controls Right)
      */}
      <div className="flex-1 flex flex-col landscape:flex-row min-h-0 relative z-10 overflow-hidden">
        
        {/* Game Area */}
        <div className="flex-1 relative flex items-end justify-center pb-12 md:pb-24 landscape:pb-4 landscape:items-end"> 
            {/* Scale down castle slightly on landscape mobile so it fits in height */}
            <div className="landscape:scale-[0.85] landscape:origin-bottom">
              <Castle 
                  health={gameState.health} 
                  maxHealth={gameState.maxHealth} 
                  isShaking={castleShaking}
                  style={gameState.castleStyle}
                  isAttacking={isAttacking}
              />
            </div>
            
            <EnemyRenderer enemies={enemies} />

            {feedbackEffect && (
              <div 
                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 text-8xl animate-ping origin-center pointer-events-none z-50 text-white drop-shadow-md"
              >
                {feedbackEffect.text}
              </div>
            )}
        </div>

        {/* Inputs / Control Panel Container */}
        <div className="relative z-50 shrink-0 landscape:w-[350px] lg:landscape:w-[450px] landscape:h-full landscape:border-l-4 landscape:border-slate-700 landscape:shadow-xl">
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
