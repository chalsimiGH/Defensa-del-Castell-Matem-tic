
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Castle } from './components/Castle';
import { EnemyRenderer } from './components/EnemyRenderer';
import { ControlPanel } from './components/ControlPanel';
import { Tutorial } from './components/Tutorial';
import { Shop } from './components/Shop';
import { GameState, Enemy, EquationItem, Operator, ShopItem, EnemyType, LeaderboardEntry } from './types';
import { INITIAL_HEALTH, getDifficultyConfig, ENEMY_TYPES } from './constants';
import { evaluateEquation, generateTargetNumber } from './utils/mathEngine';
import { Trophy, RotateCcw, ShoppingBag, ArrowRight, Star, Volume2, VolumeX, Music, Skull, Heart, Save, List, Loader2, Globe, WifiOff } from 'lucide-react';
import { db } from './firebaseConfig';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

// --- VISUAL COMPONENTS ---

const InkSplatter = () => (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden animate-[fade-out_4s_forwards]">
        {/* Main Blob */}
        <svg viewBox="0 0 200 200" className="w-[120vmax] h-[120vmax] opacity-90 text-slate-900 fill-current animate-[scale-in_0.2s_ease-out]">
            <path d="M45.7,29.9C30.3,39.6,18.4,59.2,19.3,79.5C20.3,99.8,34.1,120.8,53.2,130.4C72.4,140,96.8,138.3,115.4,126.3C133.9,114.3,146.6,92,148.2,70.5C149.8,49,140.3,28.3,123.6,16.2C106.9,4.1,83.1,0.6,65.6,8.2C48.1,15.8,36.9,34.5,45.7,29.9Z" transform="translate(20 20) scale(0.8)" />
        </svg>
        {/* Smaller Splatters */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-slate-900 rounded-full blur-sm animate-[ping_0.5s_reverse]"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-slate-900 rounded-full blur-md"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-slate-900 rounded-full blur-sm"></div>
    </div>
);

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

const PixelBird = ({ delay = 0, yPos = 20 }: { delay: number, yPos: number }) => (
  <div 
    className="absolute -left-10 animate-[float-slow_20s_linear_infinite]"
    style={{ top: `${yPos}%`, animationDelay: `-${delay}s` }}
  >
    <div className="flex gap-1 animate-pulse">
        <div className="w-2 h-1 bg-black/50"></div>
        <div className="w-3 h-1 bg-black/50 mt-1"></div>
        <div className="w-2 h-1 bg-black/50"></div>
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
  const [inkEffect, setInkEffect] = useState(false);
  
  // Audio State
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [isSfxMuted, setIsSfxMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false); 
  
  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [isOnline, setIsOnline] = useState(false); // Track if using Firebase or Local

  // Fetch Leaderboard from Firebase (with Fallback)
  const fetchLeaderboard = useCallback(async () => {
    // Force offline if db is null (wrong config)
    if (!db) {
        setIsOnline(false);
        const saved = localStorage.getItem('math_castle_leaderboard');
        if (saved) {
            try { setLeaderboard(JSON.parse(saved)); } catch(e) {}
        }
        return;
    }

    try {
        const leaderboardRef = collection(db, "leaderboard");
        // Query top 10 scores
        const q = query(leaderboardRef, orderBy("score", "desc"), limit(10));
        const querySnapshot = await getDocs(q);
        
        const fetchedData: LeaderboardEntry[] = [];
        querySnapshot.forEach((doc) => {
            fetchedData.push(doc.data() as LeaderboardEntry);
        });
        setLeaderboard(fetchedData);
        setIsOnline(true);
    } catch (error) {
        console.warn("Firebase unavailable, switching to local leaderboard:", error);
        setIsOnline(false);
        // Fallback to local storage
        const saved = localStorage.getItem('math_castle_leaderboard');
        if (saved) {
            try {
                setLeaderboard(JSON.parse(saved));
            } catch(e) { console.error("Error parsing local leaderboard"); }
        }
    }
  }, []);

  // Load Leaderboard on mount
  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleSaveScore = async () => {
      if (!playerName.trim()) return;
      setIsSavingScore(true);

      const newEntry: LeaderboardEntry = {
          name: playerName.substring(0, 15), // Limit name length
          score: gameState.score,
          level: gameState.level,
          date: Date.now()
      };

      try {
          if (!db) throw new Error("No database configured");

          // Attempt Save to Firebase
          await addDoc(collection(db, "leaderboard"), newEntry);
          // Refresh
          await fetchLeaderboard();
          setScoreSaved(true);
      } catch (e) {
          console.warn("Error saving score to Firebase, saving locally: ", e);
          
          // Fallback: Save to Local Storage
          const currentLeaderboard = leaderboard;
          const newLeaderboard = [...currentLeaderboard, newEntry]
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
          
          setLeaderboard(newLeaderboard);
          localStorage.setItem('math_castle_leaderboard', JSON.stringify(newLeaderboard));
          setScoreSaved(true);
          setIsOnline(false);
      } finally {
          setIsSavingScore(false);
      }
  };

  // --- CHEAT CODE LOGIC ---
  const [cheatClicks, setCheatClicks] = useState(0);
  const cheatTimerRef = useRef<number | null>(null);

  // --- LEVEL CHEAT CODE ---
  const [levelCheatClicks, setLevelCheatClicks] = useState(0);
  const levelCheatTimerRef = useRef<number | null>(null);

  const handleScoreClick = () => {
    // Clear existing timer
    if (cheatTimerRef.current) {
        window.clearTimeout(cheatTimerRef.current);
    }

    const newCount = cheatClicks + 1;
    setCheatClicks(newCount);

    if (newCount >= 5) {
        // TRIGGER CHEAT
        setGameState(prev => ({ ...prev, currency: prev.currency + 100 }));
        setFeedbackEffect({ x: 50, text: '+100 💎', type: 'hit' }); // Visual feedback
        setTimeout(() => setFeedbackEffect(null), 1000);
        setCheatClicks(0); // Reset
    } else {
        // Set timer to reset clicks if user stops clicking quickly
        cheatTimerRef.current = window.setTimeout(() => {
            setCheatClicks(0);
        }, 800);
    }
  };

  const handleLevelClick = () => {
      // Clear existing timer
      if (levelCheatTimerRef.current) {
          window.clearTimeout(levelCheatTimerRef.current);
      }
      
      const newCount = levelCheatClicks + 1;
      setLevelCheatClicks(newCount);

      if (newCount >= 5) {
          // TRIGGER LEVEL SKIP
          setFeedbackEffect({ x: 50, text: 'NIVELL SALTAT! ⏩', type: 'hit' });
          setTimeout(() => setFeedbackEffect(null), 1000);
          nextLevel();
          setLevelCheatClicks(0);
      } else {
          levelCheatTimerRef.current = window.setTimeout(() => {
              setLevelCheatClicks(0);
          }, 800);
      }
  };

  // Constants for level progression
  const getEnemiesPerLevel = (level: number) => {
      // Boss levels (5, 10, 15...) only have 1 enemy (The Boss)
      if (level % 5 === 0) return 1;
      return 5 + (level * 2);
  };

  // Refs for loop
  const lastUpdateRef = useRef<number>(0);
  const animationFrameRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(0);
  const lastBossAttackRef = useRef<number>(0); // Timer for Boss Attacks

  // --- AUDIO LOGIC (Web Audio API) ---
  const musicIntervalRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Simple Synthesizer for SFX
  const playRetroShootSound = () => {
    if (isSfxMuted) return;
    try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        const ctx = audioContextRef.current || new Ctx();
        if (!audioContextRef.current) audioContextRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
        console.error("SFX Error", e);
    }
  };

  const playInkSound = () => {
     if (isSfxMuted) return;
     try {
         const Ctx = window.AudioContext || (window as any).webkitAudioContext;
         if (!Ctx) return;
         const ctx = audioContextRef.current || new Ctx();
         const osc = ctx.createOscillator();
         const gain = ctx.createGain();
         osc.connect(gain);
         gain.connect(ctx.destination);
         osc.type = 'triangle'; // Squishy sound
         osc.frequency.setValueAtTime(150, ctx.currentTime);
         osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
         gain.gain.setValueAtTime(0.3, ctx.currentTime);
         gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
         osc.start();
         osc.stop(ctx.currentTime + 0.3);
     } catch(e) {}
  };

  // Procedural Music Player (Arpeggiator)
  const toggleMusic = useCallback((play: boolean) => {
    if (!play) {
        if (musicIntervalRef.current) window.clearInterval(musicIntervalRef.current);
        musicIntervalRef.current = null;
        return;
    }

    // Don't start if already playing
    if (musicIntervalRef.current) return;

    try {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (!Ctx) return;
        const ctx = audioContextRef.current || new Ctx();
        if (!audioContextRef.current) audioContextRef.current = ctx;

        // Resume context if suspended (browser policy)
        if (ctx.state === 'suspended') ctx.resume();

        // Arpeggio notes (C Major 7: C, E, G, B)
        const notes = [261.63, 329.63, 392.00, 493.88]; 
        let noteIndex = 0;

        musicIntervalRef.current = window.setInterval(() => {
             const osc = ctx.createOscillator();
             const gain = ctx.createGain();
             osc.connect(gain);
             gain.connect(ctx.destination);

             osc.type = 'triangle'; // Softer retro sound
             osc.frequency.setValueAtTime(notes[noteIndex] / 2, ctx.currentTime); // Bass octave
             
             // ADSR Envelope
             gain.gain.setValueAtTime(0, ctx.currentTime);
             gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.05); // Attack
             gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4); // Decay

             osc.start(ctx.currentTime);
             osc.stop(ctx.currentTime + 0.4);

             noteIndex = (noteIndex + 1) % notes.length;
        }, 400); // 150bpm-ish tempo
    } catch (e) {
        console.error("Music Error", e);
    }
  }, []);

  // Sync music state
  useEffect(() => {
    if (hasStarted && !isMusicMuted) {
        toggleMusic(true);
    } else {
        toggleMusic(false);
    }
    return () => toggleMusic(false);
  }, [hasStarted, isMusicMuted, toggleMusic]);


  // Transitions
  const enterShop = () => {
    setGameState(prev => ({ ...prev, phase: 'shop' }));
    // Do NOT clear enemies to preserve Boss state
    setInkEffect(false);
  };

  const closeShop = () => {
    // If we were in level_complete, go back there. Otherwise go to playing.
    const enemiesTarget = getEnemiesPerLevel(gameState.level);
    
    // Reset time trackers to prevent frame jumps or instant attacks upon resuming
    lastUpdateRef.current = performance.now();
    lastBossAttackRef.current = performance.now();

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
    setInkEffect(false);
    lastUpdateRef.current = performance.now();
    nextSpawnTimeRef.current = performance.now() + 2000;
  };

  const startGame = () => {
    setHasStarted(true); 
    // Triggers music via useEffect
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
    setInkEffect(false);
    setScoreSaved(false); // Reset saved status
    setPlayerName(''); // Reset name
    lastUpdateRef.current = performance.now();
    nextSpawnTimeRef.current = performance.now() + 2000;
  };

  // Logic to handle buying an item
  const handleBuyItem = (item: ShopItem) => {
    if (gameState.currency >= item.cost) {
      if (item.type === 'consumable') {
          // Handle Consumables (Instant effect, do not unlock)
          if (item.id === 'potion_health') {
              // Only buy if health is not full
              if (gameState.health < gameState.maxHealth) {
                  setGameState(prev => ({
                      ...prev,
                      currency: prev.currency - item.cost,
                      health: Math.min(prev.maxHealth, prev.health + 15)
                  }));
              }
          }
          return;
      }
      
      // Handle Normal Items (Unlockable)
      if (!gameState.unlockedItems.includes(item.id)) {
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
      playRetroShootSound(); // Trigger synthesized SFX

      // Check if it's the BOSS
      if (target.type === 'boss' && target.hitsRemaining && target.hitsRemaining > 1) {
          // BOSS HIT, BUT NOT DEAD
          setFeedbackEffect({ x: target.x, text: '💥', type: 'hit' });
          setTimeout(() => setFeedbackEffect(null), 500);

          // Reset Boss Attack Timer (Reward for hitting the boss)
          lastBossAttackRef.current = performance.now();

          const newTargetValue = generateTargetNumber(difficulty.numberRange.min, difficulty.numberRange.max);
          
          setEnemies(prev => prev.map(e => 
            e.id === target.id
                ? { ...e, hitsRemaining: (e.hitsRemaining || 1) - 1, value: newTargetValue }
                : e
          ));
      } else {
          // NORMAL ENEMY OR BOSS DEATH
          setFeedbackEffect({ x: target.x, text: '💥', type: 'hit' });
          setTimeout(() => setFeedbackEffect(null), 500);
          
          // Trigger Cannon Animation
          setIsAttacking(true);
          setTimeout(() => setIsAttacking(false), 200);

          // Update Enemy Status to 'dying'
          setEnemies(prev => prev.map(e => 
            e.id === target.id 
              ? { ...e, status: 'dying', animationStartTime: performance.now() } 
              : e
          ));
          
          setGameState(prev => {
            const isBoss = target.type === 'boss';
            const scoreAdd = isBoss ? 500 : (prev.level * 10);
            const newScore = prev.score + scoreAdd;
            const coinGain = isBoss ? 50 : (1 + Math.floor(prev.level / 3));
            const newDefeated = prev.enemiesDefeated + 1;
            
            // Check Level Complete Condition
            const enemiesTarget = getEnemiesPerLevel(prev.level);
            
            if (newDefeated >= enemiesTarget) {
                // Level Complete!
                return {
                    ...prev,
                    score: newScore,
                    enemiesDefeated: newDefeated,
                    currency: prev.currency + coinGain + (isBoss ? 20 : 5), 
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
      }
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

    // 0. Boss Level Logic
    const isBossLevel = gameState.level % 5 === 0;
    
    // 1. Spawning Logic
    const lastEnemy = enemies.length > 0 ? enemies[enemies.length - 1] : null;
    const canSpawn = timestamp > nextSpawnTimeRef.current && (!lastEnemy || lastEnemy.x < 60);

    const enemiesTarget = getEnemiesPerLevel(gameState.level);
    const activeAndDefeatedCount = gameState.enemiesDefeated + enemies.filter(e => e.status !== 'dying').length;
    const enemiesRemainingToSpawn = enemiesTarget - activeAndDefeatedCount;

    if (canSpawn && enemiesRemainingToSpawn > 0) {
       // Check if Boss Level - if so, only spawn Boss once
       if (isBossLevel) {
           // Should only spawn if no boss is currently active and none defeated yet (implied by enemiesRemainingToSpawn > 0 for target 1)
           const newEnemy: Enemy = {
                id: timestamp.toString(),
                value: generateTargetNumber(difficulty.numberRange.min, difficulty.numberRange.max),
                type: 'boss',
                x: 100, 
                speed: ENEMY_TYPES['boss'].speed * difficulty.enemySpeedBase,
                maxHealth: 1,
                status: 'walking',
                animationStartTime: 0,
                hitsRemaining: 5 // Boss needs 5 hits
           };
           setEnemies(prev => [...prev, newEnemy]);
           // Set spawn time way forward so no one else spawns
           nextSpawnTimeRef.current = timestamp + 999999;
           // Reset boss attack timer
           lastBossAttackRef.current = timestamp;
       } else {
           // Normal Spawn
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
    }

    // 2. Boss Mechanics (Ink & Attack)
    if (isBossLevel) {
        const boss = enemies.find(e => e.type === 'boss' && e.status !== 'dying');
        
        if (boss) {
            // INK: Random chance (0.2% per frame approx)
            if (!inkEffect && Math.random() < 0.002) {
                playInkSound();
                setInkEffect(true);
                setTimeout(() => setInkEffect(false), 4000);
            }

            // ATTACK: Every 5 seconds
            if (timestamp - lastBossAttackRef.current > 5000) {
                // Trigger boss attack damage
                setGameState(prev => ({ ...prev, health: Math.max(0, prev.health - 15) }));
                setCastleShaking(true);
                setTimeout(() => setCastleShaking(false), 800); // Shaking lasts longer for boss attack
                
                // Visual feedback for boss attack (we can use the feedback effect)
                setFeedbackEffect({ x: 80, text: '🔥 ATAC!', type: 'miss' });
                setTimeout(() => setFeedbackEffect(null), 1000);

                lastBossAttackRef.current = timestamp;
            }
        }
    }

    // 3. Movement & Animations
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
          damageTaken += (enemy.type === 'boss' ? 100 : 20); // Boss kills instantly if it reaches castle
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
  }, [gameState.phase, gameState.health, gameState.level, difficulty, enemies, gameState.enemiesDefeated, inkEffect]);

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
      
      {/* SFX audio tag removed - now using Web Audio API */}

      {/* --- NEW 8-BIT RETRO BACKGROUND --- */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-b from-blue-400 via-indigo-300 to-pink-200">
        
        {/* Sun (Pixel Square) */}
        <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-300 border-4 border-yellow-500 shadow-lg animate-pulse"></div>

        {/* Pixel Clouds */}
        <PixelCloud className="top-20 -left-20" delay={0} />
        <PixelCloud className="top-40 -left-40 scale-75" delay={1} />
        <PixelCloud className="top-10 -left-10 scale-50 opacity-50" delay={2} />

        {/* Pixel Birds - NEW */}
        <PixelBird delay={0} yPos={25} />
        <PixelBird delay={8} yPos={15} />

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

      {/* --- INK EFFECT OVERLAY --- */}
      {inkEffect && <InkSplatter />}

      {/* Top Stats Bar */}
      <div className="relative z-30 flex flex-col gap-2 p-2 md:p-4 shrink-0">
        <div className="flex justify-between items-center">
            {/* Score (Now with Cheat Click Handler) */}
            <div 
                onClick={handleScoreClick}
                className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-full px-4 py-2 shadow-lg border-2 border-slate-200 cursor-pointer active:scale-95 transition-transform select-none"
            >
                <div className="bg-yellow-400 p-1 rounded-full"><Trophy size={20} className="text-yellow-900"/></div>
                <span className="font-bold text-slate-800 text-lg">{gameState.score}</span>
            </div>
            
            {/* Level (Now with Level Skip Cheat) */}
            <div 
                onClick={handleLevelClick}
                className={`flex items-center gap-2 ${gameState.level % 5 === 0 ? 'bg-purple-800 border-purple-500 animate-pulse' : 'bg-indigo-600/90 border-indigo-400'} text-white rounded-full px-4 py-2 shadow-lg border-2 cursor-pointer active:scale-95 select-none`}
            >
                <span className="font-bold uppercase text-sm">{gameState.level % 5 === 0 ? '☠️ BOSS' : 'Nivell'}</span>
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
                className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 text-5xl md:text-8xl animate-bounce origin-center pointer-events-none z-50 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] font-black"
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
                        {gameState.level % 5 === 0 ? (
                            <Skull size={80} className="text-purple-600 fill-purple-400 animate-bounce" />
                        ) : (
                            <Star size={80} className="text-yellow-400 fill-yellow-400 animate-spin-slow" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-yellow-800">
                            {gameState.level}
                        </div>
                      </div>
                  </div>
                  <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
                      {gameState.level % 5 === 0 ? 'BOSS DERROTAT!' : 'Nivell Completat!'}
                  </h1>
                  <p className="text-slate-500 mb-8 text-lg">
                     {gameState.level % 5 === 0 ? 'El regne està segur... per ara.' : 'Molt bona feina defensant el castell.'}
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
            <div className="bg-slate-900 rounded-3xl p-6 md:p-8 w-full max-w-2xl h-[90vh] flex flex-col shadow-2xl border-4 border-red-500 animate-in zoom-in overflow-hidden">
                
                {/* Score Registration Section (Only if not saved) */}
                {!scoreSaved ? (
                  <div className="flex flex-col items-center justify-center flex-shrink-0 mb-6">
                      <h1 className="text-4xl font-black text-red-500 mb-2 uppercase drop-shadow-md tracking-wider">
                          Castell Derrotat!
                      </h1>
                      <div className="flex gap-8 mb-6 bg-slate-800 p-4 rounded-xl border border-slate-700 w-full justify-center">
                          <div className="text-center">
                              <p className="text-slate-400 text-sm uppercase font-bold">Nivell</p>
                              <p className="text-3xl font-black text-white">{gameState.level}</p>
                          </div>
                          <div className="text-center border-l border-slate-700 pl-8">
                              <p className="text-slate-400 text-sm uppercase font-bold">Punts</p>
                              <p className="text-3xl font-black text-yellow-400">{gameState.score}</p>
                          </div>
                      </div>

                      <div className="w-full bg-slate-800 p-6 rounded-2xl border-2 border-slate-700 shadow-xl">
                          <p className="text-white font-bold mb-3 flex items-center gap-2">
                            <Trophy size={20} className="text-yellow-400"/> 
                            {isOnline ? 'Registra la teva fita global:' : 'Registra la teva fita (Mode Local):'}
                          </p>
                          <div className="flex gap-2">
                              <input 
                                  type="text" 
                                  value={playerName}
                                  onChange={(e) => setPlayerName(e.target.value)}
                                  placeholder="El teu nom..." 
                                  maxLength={15}
                                  disabled={isSavingScore}
                                  className="flex-1 bg-slate-950 border-2 border-slate-600 text-white rounded-xl px-4 py-3 font-bold focus:border-blue-500 outline-none placeholder:text-slate-600 disabled:opacity-50"
                              />
                              <button 
                                  onClick={handleSaveScore}
                                  disabled={!playerName.trim() || isSavingScore}
                                  className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-lg flex items-center gap-2"
                              >
                                  {isSavingScore ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
                                  Guardar
                              </button>
                          </div>
                      </div>
                  </div>
                ) : (
                  // Leaderboard View
                  <div className="flex flex-col flex-1 min-h-0 mb-6">
                      <div className="flex items-center justify-center gap-3 mb-4">
                          <List size={32} className="text-yellow-400" />
                          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-wide">
                            {isOnline ? 'Rànquing Mundial' : 'Rànquing Local'}
                          </h2>
                          {isOnline ? (
                            <Globe size={20} className="text-green-400" title="Connectat al Món" />
                          ) : (
                            <WifiOff size={20} className="text-slate-500" title="Sense connexió / Mode Offline" />
                          )}
                      </div>
                      
                      <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                          <table className="w-full text-left">
                              <thead className="bg-slate-900 sticky top-0 z-10">
                                  <tr>
                                      <th className="p-3 text-slate-400 font-bold text-sm uppercase w-12 text-center">#</th>
                                      <th className="p-3 text-slate-400 font-bold text-sm uppercase">Jugador</th>
                                      <th className="p-3 text-slate-400 font-bold text-sm uppercase text-center">Nivell</th>
                                      <th className="p-3 text-slate-400 font-bold text-sm uppercase text-right">Punts</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-800">
                                  {leaderboard.length === 0 ? (
                                      <tr><td colSpan={4} className="p-8 text-center text-slate-500 italic">Carregant puntuacions...</td></tr>
                                  ) : (
                                      leaderboard.map((entry, idx) => {
                                          let rankColor = "text-slate-300";
                                          if (idx === 0) rankColor = "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]";
                                          if (idx === 1) rankColor = "text-slate-200 drop-shadow-[0_0_5px_rgba(226,232,240,0.5)]";
                                          if (idx === 2) rankColor = "text-orange-400 drop-shadow-[0_0_5px_rgba(251,146,60,0.5)]";

                                          return (
                                              <tr key={idx} className={entry.name === playerName && entry.score === gameState.score ? "bg-blue-900/30" : "hover:bg-slate-900/50"}>
                                                  <td className={`p-3 font-black text-center ${rankColor}`}>{idx + 1}</td>
                                                  <td className={`p-3 font-bold truncate max-w-[120px] ${rankColor}`}>{entry.name}</td>
                                                  <td className="p-3 text-center text-slate-400 font-mono">{entry.level}</td>
                                                  <td className="p-3 text-right font-mono font-bold text-green-400">{entry.score}</td>
                                              </tr>
                                          );
                                      })
                                  )}
                              </tbody>
                          </table>
                      </div>
                  </div>
                )}

                <div className="flex flex-col gap-3 mt-auto shrink-0">
                  <button 
                      onClick={startGame}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xl font-bold py-4 rounded-xl shadow-[0_6px_0_rgb(37,99,235)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all"
                  >
                      <RotateCcw size={24}/> Tornar a jugar
                  </button>
                  <button 
                      onClick={enterShop}
                      className="w-full bg-slate-700 hover:bg-slate-600 text-white text-lg font-bold py-3 rounded-xl shadow-[0_4px_0_rgb(51,65,85)] active:shadow-none active:translate-y-1 flex items-center justify-center gap-3 transition-all"
                  >
                      <ShoppingBag size={20}/> Botiga
                  </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
