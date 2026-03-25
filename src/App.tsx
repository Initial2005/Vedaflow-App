/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { AgniDashboard } from './components/AgniDashboard';
import { PracticeTimer } from './components/PracticeTimer';
import { VideoTutorial } from './components/VideoTutorial';
import { WisdomSection } from './components/WisdomSection';
import { AboutSection } from './components/AboutSection';
import { EXERCISES } from './types';
import { Flame, ArrowRight, Sparkles, Wind } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import { db } from './lib/firebase';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestore-error';

export default function App() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [postureFilter, setPostureFilter] = useState<'all' | 'standing' | 'sitting'>('all');
  const [selectedExercise, setSelectedExercise] = useState(EXERCISES[0]);
  
  const { user, signIn } = useAuth();
  const [metabolicRate, setMetabolicRate] = useState(0);
  const [streak, setStreak] = useState(0);
  const [weeklyProgress, setWeeklyProgress] = useState(0);

  useEffect(() => {
    if (!user) {
      setMetabolicRate(0);
      setStreak(0);
      setWeeklyProgress(0);
      return;
    }

    const q = query(
      collection(db, 'practices'),
      where('userId', '==', user.uid),
      orderBy('completedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const practices = snapshot.docs.map(doc => doc.data());
      
      // Calculate total duration
      const totalSeconds = practices.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
      // Let's say 2 hours (7200s) = 100% metabolic rate
      const rate = Math.min(100, Math.floor((totalSeconds / 7200) * 100));
      setMetabolicRate(rate);

      // Calculate streak
      let currentStreak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const practiceDates = new Set(practices.map(p => {
        const d = p.completedAt?.toDate() || new Date();
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      }));

      let checkDate = new Date(today);
      while (practiceDates.has(checkDate.getTime())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
      
      // If they haven't practiced today, check if they practiced yesterday
      if (currentStreak === 0) {
        checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() - 1);
        while (practiceDates.has(checkDate.getTime())) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
      setStreak(currentStreak);

      // Calculate weekly progress (this week vs last week)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

      const thisWeekSeconds = practices
        .filter(p => (p.completedAt?.toDate() || new Date()) >= oneWeekAgo)
        .reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
        
      const lastWeekSeconds = practices
        .filter(p => {
          const d = p.completedAt?.toDate() || new Date();
          return d >= twoWeeksAgo && d < oneWeekAgo;
        })
        .reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);

      if (lastWeekSeconds === 0) {
        setWeeklyProgress(thisWeekSeconds > 0 ? 100 : 0);
      } else {
        const progress = ((thisWeekSeconds - lastWeekSeconds) / lastWeekSeconds) * 100;
        setWeeklyProgress(Math.round(progress * 10) / 10);
      }

    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'practices');
    });

    return () => unsubscribe();
  }, [user]);

  const heroY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const filteredExercises = EXERCISES.filter(
    (exercise) => postureFilter === 'all' || exercise.posture === postureFilter
  );

  return (
    <Layout>
      {/* Hero Section */}
      <section id="hero" ref={heroRef} className="relative h-screen flex flex-col justify-center items-center overflow-hidden px-6 pt-20">
        {/* Background Mantras */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none flex flex-col justify-around opacity-[0.04] text-terracotta font-display font-black whitespace-nowrap z-20">
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
            className="text-[12vw] leading-none"
          >
            ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्
          </motion.div>
          <motion.div
            animate={{ x: [-2000, 0] }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="text-[14vw] leading-none"
          >
            लोकाः समस्ताः सुखिनो भवन्तु असतो मा सद्गमय तमसो मा ज्योतिर्गमय लोकाः समस्ताः सुखिनो भवन्तु असतो मा सद्गमय तमसो मा ज्योतिर्गमय
          </motion.div>
          <motion.div
            animate={{ x: [0, -2000] }}
            transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
            className="text-[10vw] leading-none"
          >
            ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात् ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्
          </motion.div>
        </div>

        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="container mx-auto relative z-10 text-center space-y-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
            className="w-24 h-24 rounded-full border border-stone/10 flex items-center justify-center mx-auto mb-8 bg-sand/50 backdrop-blur-sm"
          >
            <Flame size={40} className="text-terracotta" />
          </motion.div>

          <div className="flex flex-col items-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.5em] text-stone/40 font-black"
            >
              The Modern Asharama / Digital Sanctuary
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-[16vw] md:text-[14vw] font-display font-black tracking-tighter leading-[0.85] text-stone uppercase"
            >
              Veda<span className="italic text-terracotta">Flow</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-2xl text-stone/60 max-w-3xl mx-auto font-sans leading-relaxed font-light"
            >
              A rhythmic sanctuary for metabolic ignition. 
              Restore your Agni through ancient wisdom and modern precision.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8"
          >
            {user ? (
              <>
                <a href="#practice" className="group bg-stone text-sand px-10 py-5 rounded-full text-xs uppercase tracking-widest font-black hover:bg-terracotta transition-all flex items-center gap-3 shadow-2xl shadow-stone/20">
                  Enter Sanctuary
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#wisdom" className="px-10 py-5 rounded-full text-xs uppercase tracking-widest font-black border border-stone/10 hover:bg-stone/5 transition-all">
                  Explore Wisdom
                </a>
              </>
            ) : (
              <button onClick={signIn} className="group bg-terracotta text-sand px-10 py-5 rounded-full text-xs uppercase tracking-widest font-black hover:bg-stone transition-all flex items-center gap-3 shadow-2xl shadow-terracotta/20">
                Sign In to Begin
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Parallax Background Sanskrit */}
        <motion.div
          style={{ y: useTransform(scrollY, [0, 1000], [0, -300]) }}
          className="absolute top-1/2 left-0 right-0 pointer-events-none select-none opacity-[0.02] text-[30vw] font-display font-black leading-none whitespace-nowrap text-stone"
        >
          अग्नि अग्नि अग्नि
        </motion.div>
      </section>

      {user && (
        <>
          {/* Dashboard Section */}
          <section id="dashboard" className="py-32 px-6 bg-white/30 backdrop-blur-sm border-y border-stone/5">
        <div className="container mx-auto space-y-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-terracotta font-bold">
                Personal Sanctuary
              </span>
              <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none uppercase">
                Your <span className="italic text-terracotta">Agni</span>
              </h2>
            </div>
            <p className="text-stone/60 max-w-sm font-sans leading-relaxed">
              Real-time metabolic tracking synchronized with your daily practice and breathing cycles.
            </p>
          </div>
          
          <AgniDashboard 
            metabolicRate={metabolicRate} 
            streak={streak} 
            weeklyProgress={weeklyProgress} 
          />
        </div>
      </section>

      {/* Practice Section */}
      <section id="practice" className="py-32 px-6">
        <div className="container mx-auto space-y-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Sparkles size={32} className="text-terracotta mx-auto" />
            <h2 className="text-6xl md:text-8xl font-display font-black tracking-tighter leading-none uppercase">
              Daily <span className="italic text-terracotta">Rhythm</span>
            </h2>
            <p className="text-xl text-stone/60 font-light">
              Select a posture to begin your metabolic practice.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              {(['all', 'standing', 'sitting'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setPostureFilter(filter)}
                  className={`px-8 py-3 rounded-full text-xs uppercase tracking-widest font-black transition-all ${
                    postureFilter === filter
                      ? 'bg-terracotta text-sand shadow-xl shadow-terracotta/20'
                      : 'bg-stone/5 text-stone/60 hover:bg-stone/10'
                  }`}
                >
                  {filter} Postures
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            <div className="space-y-16 sticky top-32">
              {filteredExercises.map((exercise, index) => (
                <motion.div
                  key={exercise.id}
                  onClick={() => setSelectedExercise(exercise)}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`group cursor-pointer space-y-4 p-8 rounded-[40px] transition-all border ${
                    selectedExercise.id === exercise.id 
                      ? 'bg-white/80 border-terracotta/20 shadow-xl' 
                      : 'hover:bg-white/50 border-transparent hover:border-stone/5'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-display font-black text-terracotta">0{index + 1}</span>
                    <div className="h-px flex-1 bg-stone/10" />
                  </div>
                  <h3 className="text-4xl font-display font-black tracking-tighter uppercase group-hover:text-terracotta transition-colors">
                    {exercise.name}
                  </h3>
                  <p className="text-stone/60 text-sm leading-relaxed max-w-md">
                    {exercise.description}
                  </p>
                  <div className="flex items-center gap-4 pt-4">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-stone/40 flex items-center gap-2">
                      <Wind size={12} /> {exercise.duration}s
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-stone/40">
                      {exercise.posture}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="lg:pt-32">
              <div className="sticky top-32">
                <PracticeTimer 
                  key={selectedExercise.id}
                  initialDuration={selectedExercise.duration} 
                  exerciseId={selectedExercise.id}
                />
                <div className="mt-12 text-center space-y-4">
                  <p className="text-stone/40 text-[10px] uppercase tracking-[0.3em] font-bold">
                    Currently Practicing
                  </p>
                  <h4 className="text-2xl font-display font-black uppercase tracking-tighter">
                    {selectedExercise.name}
                  </h4>
                </div>
                <VideoTutorial exercise={selectedExercise} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <WisdomSection />
        </>
      )}

      <AboutSection />

      {/* Footer */}
      <footer className="py-12 px-6 bg-stone text-sand border-t border-white/5">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-xl font-display font-black tracking-tighter uppercase">
            Veda<span className="italic text-terracotta">Flow</span>
          </span>
          <div className="flex gap-4 text-[10px] uppercase tracking-widest text-sand/40 font-bold">
            <span>© 2026 VedaFlow Sanctuary</span>
            <span>Designed for Modern Vitality</span>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
