import { motion } from 'motion/react';
import { Flame, TrendingUp, Activity } from 'lucide-react';

interface AgniDashboardProps {
  metabolicRate: number; // 0 to 100
  streak: number;
  weeklyProgress: number;
}

export function AgniDashboard({ metabolicRate, streak, weeklyProgress }: AgniDashboardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mx-auto">
      {/* Metabolic Fire Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden bg-stone p-8 rounded-[40px] border border-white/5 col-span-1 md:col-span-2"
      >
        {/* Rhythmic Pulse Background */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-terracotta blur-[100px]"
        />

        <div className="relative z-10 space-y-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold">
                Current Status
              </span>
              <h3 className="text-4xl font-display font-black text-sand tracking-tighter">
                Metabolic Fire
              </h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-terracotta/20 flex items-center justify-center">
              <Flame size={24} className="text-terracotta" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-5xl font-display font-black text-sand">
                {metabolicRate}%
              </span>
              <span className="text-xs text-sand/40 font-medium mb-2">
                Optimal Ignition
              </span>
            </div>
            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${metabolicRate}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-terracotta rounded-full"
              />
            </div>
          </div>

          <p className="text-sm text-sand/60 leading-relaxed max-w-md">
            Your Agni is currently at peak performance. This state accelerates fat oxidation 
            and enhances nutrient absorption across all Dhatus (tissues).
          </p>
        </div>
      </motion.div>

      {/* Secondary Stats */}
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-stone p-6 rounded-[32px] border border-white/5 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-sage/20 flex items-center justify-center">
            <TrendingUp size={20} className="text-sage" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-sand/40 font-bold block">
              Weekly Progress
            </span>
            <span className="text-lg font-display font-bold text-sand">
              {weeklyProgress > 0 ? '+' : ''}{weeklyProgress}%
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-stone p-6 rounded-[32px] border border-white/5 flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-terracotta/20 flex items-center justify-center">
            <Activity size={20} className="text-terracotta" />
          </div>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-sand/40 font-bold block">
              Practice Streak
            </span>
            <span className="text-lg font-display font-bold text-sand">{streak} Days</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
