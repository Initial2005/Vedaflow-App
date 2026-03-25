import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

interface TimerProps {
  key?: string | number;
  initialDuration: number;
  exerciseId: string;
  onComplete?: () => void;
}

export function PracticeTimer({ initialDuration, exerciseId, onComplete }: TimerProps) {
  const [duration, setDuration] = useState(initialDuration);
  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isActive, setIsActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { user } = useAuth();

  // Breathing cycle: 4s Inhale, 4s Hold, 4s Exhale
  useEffect(() => {
    if (!isActive) return;
    
    const cycleTime = (duration - timeLeft) % 12;
    if (cycleTime < 4) setBreathPhase('Inhale');
    else if (cycleTime < 8) setBreathPhase('Hold');
    else setBreathPhase('Exhale');
  }, [timeLeft, isActive, duration]);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Save practice session if user is logged in
      if (user) {
        addDoc(collection(db, 'practices'), {
          userId: user.uid,
          exerciseId,
          durationSeconds: duration,
          completedAt: serverTimestamp()
        }).catch((error) => {
          handleFirestoreError(error, OperationType.CREATE, 'practices');
        });
      }
      
      onComplete?.();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, onComplete, user, exerciseId, duration]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
  };

  const adjustDuration = (amount: number) => {
    setDuration((prev) => Math.max(30, prev + amount));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="bg-stone p-8 rounded-[40px] shadow-2xl border border-white/5 w-full max-w-sm mx-auto">
      <div className="flex flex-col items-center gap-8">
        <div className="relative w-56 h-56 flex items-center justify-center">
          {/* Breathing Ring */}
          <motion.div
            animate={{
              scale: breathPhase === 'Inhale' ? 1.2 : breathPhase === 'Hold' ? 1.2 : 1,
              opacity: breathPhase === 'Inhale' ? 0.3 : 0.1
            }}
            transition={{ duration: 4, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-terracotta blur-2xl"
          />
          
          <svg className="w-full h-full -rotate-90 relative z-10">
            <circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="4"
            />
            <motion.circle
              cx="112"
              cy="112"
              r="100"
              fill="none"
              stroke="#9E2016"
              strokeWidth="4"
              strokeDasharray="628"
              initial={{ strokeDashoffset: 628 }}
              animate={{ strokeDashoffset: 628 - (628 * progress) / 100 }}
              transition={{ duration: 0.5, ease: "linear" }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <AnimatePresence mode="wait">
              <motion.span
                key={breathPhase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold mb-2"
              >
                {isActive ? breathPhase : 'Ready'}
              </motion.span>
            </AnimatePresence>
            <span className="text-5xl font-display font-black text-sand tracking-tighter">
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => adjustDuration(-30)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-sand/60 transition-colors"
            disabled={isActive}
          >
            <Minus size={20} />
          </button>
          <span className="text-sm font-display font-bold text-sand/80 w-16 text-center">
            {Math.floor(duration / 60)}m {duration % 60}s
          </span>
          <button
            onClick={() => adjustDuration(30)}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 text-sand/60 transition-colors"
            disabled={isActive}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-full font-display text-xs uppercase tracking-widest transition-all ${
              isActive 
                ? 'bg-white/10 text-sand hover:bg-white/20' 
                : 'bg-terracotta text-sand font-black hover:bg-terracotta/90'
            }`}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            {isActive ? 'Pause' : 'Start Practice'}
          </button>
          <button
            onClick={resetTimer}
            className="p-4 rounded-full bg-white/5 text-sand/60 hover:bg-white/10 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
