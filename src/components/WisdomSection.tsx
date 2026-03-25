import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { ArrowRight, X, Share2 } from 'lucide-react';

const ARTICLES = [
  {
    title: "The Science of Agni",
    category: "Metabolism",
    readTime: "5 min read",
    excerpt: "Understanding your metabolic fire and how Ayurvedic principles align with modern thermogenesis.",
    content: "Agni, the Ayurvedic concept of digestive and metabolic fire, is central to our overall health. In modern terms, it closely aligns with our basal metabolic rate and thermogenesis. When Agni is strong, we digest food efficiently, absorb nutrients effectively, and maintain a vibrant energy level. A weak Agni leads to the accumulation of Ama (toxins), resulting in lethargy, weight gain, and weakened immunity. By practicing specific asanas, pranayama, and mindful eating, we can stoke this internal fire, optimizing our body's natural ability to heal and thrive.",
    image: "https://picsum.photos/seed/agni/800/600"
  },
  {
    title: "Pranayama Basics",
    category: "Breathwork",
    readTime: "8 min read",
    excerpt: "Breath is the bridge between body and mind. Learn the foundational techniques for vital energy.",
    content: "Pranayama, the formal practice of controlling the breath, is the source of our prana, or vital life force. Techniques like Nadi Shodhana (alternate nostril breathing) balance the left and right hemispheres of the brain, while Kapalabhati (skull-shining breath) invigorates the nervous system and clears the respiratory tract. Regular practice not only improves lung capacity but also profoundly calms the mind, reducing stress and anxiety. It is the essential bridge that connects our physical postures (asanas) to deep meditation.",
    image: "https://picsum.photos/seed/prana/800/600"
  },
  {
    title: "Asana & Alignment",
    category: "Movement",
    readTime: "6 min read",
    excerpt: "Perfecting your posture to ensure maximum energy flow and prevent practice-related injuries.",
    content: "Proper alignment in yoga asanas is not about achieving a perfect shape, but about creating a safe and stable structure for energy to flow. When our bones and joints are aligned correctly, our muscles don't have to overwork, and our breath can move freely. This prevents injuries and allows us to hold postures longer, deepening the physical and mental benefits. Focus on grounding through your foundation, engaging your core, and extending through the crown of your head in every pose.",
    image: "https://picsum.photos/seed/asana/800/600"
  },
  {
    title: "The Mind-Body Connection",
    category: "Philosophy",
    readTime: "10 min read",
    excerpt: "Exploring the ancient texts that map the intricate relationship between our thoughts and our physical health.",
    content: "Ancient yogic texts like the Yoga Sutras of Patanjali emphasize that the mind and body are not separate entities, but interconnected layers of our being. Our physical ailments often have roots in mental or emotional blockages, and conversely, our physical state deeply influences our mental clarity. By cultivating mindfulness and observing our thoughts without judgment, we can begin to untangle these knots. This holistic approach recognizes that true healing requires addressing both the physical symptoms and their underlying psychological causes.",
    image: "https://picsum.photos/seed/mind/800/600"
  },
  {
    title: "Morning Rituals",
    category: "Lifestyle",
    readTime: "4 min read",
    excerpt: "Start your day by igniting your inner fire with these simple, effective Ayurvedic morning practices.",
    content: "How you start your morning sets the tone for the entire day. Ayurvedic morning rituals, known as Dinacharya, are designed to align our biological rhythms with nature. Simple practices like waking up before sunrise, scraping your tongue to remove overnight toxins, drinking warm water with lemon to stimulate digestion, and a brief session of stretching and breathwork can profoundly impact your energy levels. These rituals help clear the mind, ignite your Agni, and prepare you to face the day with clarity and purpose.",
    image: "https://picsum.photos/seed/morning/800/600"
  }
];

export function WisdomSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const [selectedArticle, setSelectedArticle] = useState<typeof ARTICLES[0] | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-75%"]);

  const handleShare = async (e: React.MouseEvent, article: typeof ARTICLES[0]) => {
    e.stopPropagation();
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${article.title}\n${window.location.href}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

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
            <motion.div 
              key={idx} 
              layoutId={`article-${idx}`}
              onClick={() => setSelectedArticle(article)}
              className="w-[85vw] md:w-[600px] h-[500px] flex flex-col justify-end relative rounded-[40px] overflow-hidden group cursor-pointer"
            >
              <motion.img 
                layoutId={`image-${idx}`}
                src={article.image} 
                alt={article.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone via-stone/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              
              <div className="relative z-10 p-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-terracotta">
                    <span>{article.category}</span>
                    <span className="w-1 h-1 rounded-full bg-terracotta" />
                    <span>{article.readTime}</span>
                  </div>
                  <button 
                    onClick={(e) => handleShare(e, article)}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-terracotta transition-colors text-white"
                    title="Share article"
                  >
                    <Share2 size={16} />
                  </button>
                </div>
                <motion.h3 layoutId={`title-${idx}`} className="text-4xl font-display font-black tracking-tighter leading-tight">
                  {article.title}
                </motion.h3>
                <p className="text-sand/70 line-clamp-2 max-w-md">
                  {article.excerpt}
                </p>
                <div className="pt-4">
                  <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-terracotta transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-stone/80 backdrop-blur-sm"
            onClick={() => setSelectedArticle(null)}
          >
            <motion.div
              layoutId={`article-${ARTICLES.indexOf(selectedArticle)}`}
              className="bg-stone border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[40px] relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-6 right-6 z-20 flex gap-3">
                <button 
                  onClick={(e) => handleShare(e, selectedArticle)}
                  className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-terracotta transition-colors"
                  title="Share article"
                >
                  <Share2 size={20} />
                </button>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-terracotta transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="relative h-64 md:h-96 w-full">
                <motion.img 
                  layoutId={`image-${ARTICLES.indexOf(selectedArticle)}`}
                  src={selectedArticle.image} 
                  alt={selectedArticle.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone to-transparent" />
              </div>
              
              <div className="p-8 md:p-12 space-y-6 relative z-10 -mt-20">
                <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest font-bold text-terracotta">
                  <span>{selectedArticle.category}</span>
                  <span className="w-1 h-1 rounded-full bg-terracotta" />
                  <span>{selectedArticle.readTime}</span>
                </div>
                
                <motion.h3 
                  layoutId={`title-${ARTICLES.indexOf(selectedArticle)}`} 
                  className="text-4xl md:text-6xl font-display font-black tracking-tighter leading-tight text-sand"
                >
                  {selectedArticle.title}
                </motion.h3>
                
                <p className="text-xl text-sand/80 font-light leading-relaxed italic">
                  {selectedArticle.excerpt}
                </p>
                
                <div className="h-px w-full bg-white/10 my-8" />
                
                <div className="prose prose-invert prose-stone max-w-none">
                  <p className="text-lg text-sand/70 leading-relaxed">
                    {selectedArticle.content}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
