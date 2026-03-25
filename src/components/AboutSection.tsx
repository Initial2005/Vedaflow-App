import { motion } from 'motion/react';
import { Github, Linkedin, Mail } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-32 px-6 bg-sand text-stone border-t border-stone/10">
      <div className="container mx-auto max-w-4xl text-center space-y-12">
        <div className="space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold">
            The Creator
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-black tracking-tighter leading-none uppercase">
            About <span className="italic text-terracotta">Us</span>
          </h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="prose prose-stone mx-auto text-stone/70 text-lg leading-relaxed"
        >
          <p>
            VedaFlow was born from a desire to bridge the gap between ancient Ayurvedic wisdom and modern lifestyle needs. Our mission is to provide a sanctuary where you can cultivate your inner fire (Agni), find balance through mindful movement, and deepen your understanding of holistic wellness.
          </p>
          <p>
            Whether you're beginning your journey or deepening your practice, we're here to guide you toward optimal vitality and peace.
          </p>
        </motion.div>

        <div className="pt-12 flex items-center justify-center gap-8">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-stone text-sand flex items-center justify-center hover:bg-terracotta transition-colors shadow-xl">
            <Github size={24} />
          </a>
          <a href="https://www.linkedin.com/in/pratham-srivastav-2a2537284/" target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-stone text-sand flex items-center justify-center hover:bg-terracotta transition-colors shadow-xl">
            <Linkedin size={24} />
          </a>
          <a href="mailto:prathamkartiksrivastav@gmail.com" className="w-14 h-14 rounded-full bg-stone text-sand flex items-center justify-center hover:bg-terracotta transition-colors shadow-xl">
            <Mail size={24} />
          </a>
        </div>
      </div>
    </section>
  );
}
