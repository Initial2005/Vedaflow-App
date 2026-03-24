import { motion } from 'motion/react';
import { Exercise } from '../types';
import { PracticeTimer } from './PracticeTimer';
import { Info, CheckCircle2 } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  index: number;
  key?: string | number;
}

export function ExerciseCard({ exercise, index }: ExerciseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.215, 0.61, 0.355, 1] }}
      className="group relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-32 border-b border-stone/5 last:border-0"
    >
      <div className="space-y-10 order-2 lg:order-1">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-display font-black uppercase tracking-[0.4em] text-terracotta">
              0{index + 1} / {exercise.sanskritName}
            </span>
            <div className="h-px flex-1 bg-stone/10" />
          </div>
          <h3 className="text-6xl md:text-8xl font-display font-black tracking-tighter text-stone leading-[0.8] uppercase">
            {exercise.name}
          </h3>
          <p className="text-lg text-stone/60 max-w-md leading-relaxed font-sans font-light">
            {exercise.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-stone/40 flex items-center gap-2">
              <CheckCircle2 size={12} className="text-terracotta" />
              Key Benefits
            </h4>
            <ul className="space-y-3">
              {exercise.benefits.map((benefit) => (
                <li key={benefit} className="text-sm text-stone/80 font-medium">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-stone/40 flex items-center gap-2">
              <Info size={12} className="text-terracotta" />
              Posture
            </h4>
            <span className="inline-block px-4 py-1.5 rounded-full bg-stone/5 text-[10px] uppercase tracking-widest font-black text-stone/60">
              {exercise.posture}
            </span>
          </div>
        </div>

        <div className="pt-10">
          <PracticeTimer initialDuration={exercise.duration} />
        </div>
      </div>

      <div className="relative aspect-[4/5] overflow-hidden rounded-[60px] shadow-2xl order-1 lg:order-2">
        <motion.img
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
          src={exercise.imageUrl}
          alt={exercise.name}
          className="w-full h-full object-cover grayscale-[0.5] hover:grayscale-0 transition-all duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-terracotta/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </div>
    </motion.div>
  );
}
