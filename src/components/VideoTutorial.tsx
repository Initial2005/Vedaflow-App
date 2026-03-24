import { motion } from 'motion/react';
import { PlayCircle } from 'lucide-react';
import { Exercise } from '../types';

export function VideoTutorial({ exercise }: { exercise: Exercise }) {
  return (
    <div className="mt-12 bg-stone/5 rounded-[32px] p-8 border border-stone/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-xl font-display font-black text-stone uppercase tracking-tighter">Video Tutorial</h4>
          <p className="text-sm text-stone/60">Follow along with this short demonstration.</p>
        </div>
        <div className="bg-terracotta/10 text-terracotta p-3 rounded-full">
          <PlayCircle size={24} />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        key={exercise.id}
        className="relative rounded-2xl overflow-hidden aspect-video bg-stone/10 shadow-2xl"
      >
        <iframe
          src={`https://www.youtube.com/embed/${exercise.youtubeId}?autoplay=0&loop=1&playlist=${exercise.youtubeId}&controls=1&mute=1`}
          title={`${exercise.name} Tutorial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full object-cover border-0"
        />
      </motion.div>
    </div>
  );
}
