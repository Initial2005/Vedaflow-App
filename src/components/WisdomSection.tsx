import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';

const ARTICLES = [
  {
    title: "The Science of Agni",
    category: "Metabolism",
    readTime: "5 min read",
    excerpt: "Understanding your metabolic fire and how Ayurvedic principles align with modern thermogenesis.",
    image: "https://picsum.photos/seed/agni/800/600"
  },
  {
    title: "Pranayama Basics",
    category: "Breathwork",
    readTime: "8 min read",
    excerpt: "Breath is the bridge between body and mind. Learn the foundational techniques for vital energy.",
    image: "https://picsum.photos/seed/prana/800/600"
  },
  {
    title: "Asana & Alignment",
    category: "Movement",
    readTime: "6 min read",
    excerpt: "Perfecting your posture to ensure maximum energy flow and prevent practice-related injuries.",
    image: "https://picsum.photos/seed/asana/800/600"
  },
  {
    title: "The Mind-Body Connection",
    category: "Philosophy",
    readTime: "10 min read",
    excerpt: "Exploring the ancient texts that map the intricate relationship between our thoughts and our physical health.",
    image: "https://picsum.photos/seed/mind/800/600"
  },
  {
    title: "Morning Rituals",
    category: "Lifestyle",
    readTime: "4 min read",
    excerpt: "Start your day by igniting your inner fire with these simple, effective Ayurvedic morning practices.",
    image: "https://picsum.photos/seed/morning/800/600"
  }
];

export function WisdomSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  return (
    <section ref={targetRef} id="wisdom" className="relative h-[300vh] bg-stone text-sand">
      <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden py-24">
        <div className="container mx-auto px-6 mb-12">
          <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold">
            Ancient Knowledge
          </span>
          <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none uppercase mt-4">
            Explore <span className="italic text-terracotta">Wisdom</span>
          </h2>
        </div>
        
        <motion.div style={{ x }} className="flex gap-8 px-6 w-max">
          {ARTICLES.map((article, idx) => (
            <div 
              key={idx} 
              className="w-[85vw] md:w-[600px] h-[500px] flex flex-col justify-end relative rounded-[40px] overflow-hidden group cursor-pointer"
            >
              <img 
                src={article.image} 
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone via-stone/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="relative z-10 p-10 space-y-4">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-terracotta">
                  <span>{article.category}</span>
                  <span className="w-1 h-1 rounded-full bg-terracotta" />
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-4xl font-display font-black tracking-tighter leading-tight">
                  {article.title}
                </h3>
                <p className="text-sand/70 line-clamp-2 max-w-md">
                  {article.excerpt}
                </p>
                <div className="pt-4">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-terracotta transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
