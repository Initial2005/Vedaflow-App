import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookOpen, Compass, PlayCircle, LogOut, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signIn, logOut, status, error, clearError } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-sand text-stone font-sans selection:bg-terracotta selection:text-sand">
      {/* Grain Overlay */}
      <div className="grain-overlay" />

      {/* Auth error banner */}
      {error && (
        <div className="fixed top-2 left-2 right-2 z-[60] md:left-auto md:right-6 md:top-24 md:w-[420px]">
          <div className="bg-white/90 backdrop-blur-xl border border-red-200 text-red-900 rounded-2xl px-4 py-3 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div className="text-xs font-bold leading-snug">{error}</div>
              <button
                onClick={clearError}
                className="text-[10px] font-black uppercase tracking-widest text-red-900/70 hover:text-red-900"
              >
                Close
              </button>
            </div>
            <div className="mt-2 text-[10px] text-red-900/70">
              If this says “unauthorized-domain”, add your domain in Firebase Console → Authentication → Settings → Authorized
              domains.
            </div>
          </div>
        </div>
      )}

      {/* Desktop TopNavBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-full px-8 py-3 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-12">
            <span className="text-2xl font-display font-black tracking-tighter text-stone uppercase">
              Veda<span className="italic text-terracotta">Flow</span>
            </span>

            <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-bold text-stone/60">
              {user && (
                <>
                  <a
                    href="#practice"
                    className={`transition-colors ${
                      activeSection === 'practice' ? 'text-terracotta' : 'hover:text-terracotta'
                    }`}
                  >
                    Practice
                  </a>
                  <a
                    href="#dashboard"
                    className={`transition-colors ${
                      activeSection === 'dashboard' ? 'text-terracotta' : 'hover:text-terracotta'
                    }`}
                  >
                    Dashboard
                  </a>
                  <a
                    href="#wisdom"
                    className={`transition-colors ${
                      activeSection === 'wisdom' ? 'text-terracotta' : 'hover:text-terracotta'
                    }`}
                  >
                    Wisdom
                  </a>
                </>
              )}

              <a
                href="#about"
                className={`transition-colors ${activeSection === 'about' ? 'text-terracotta' : 'hover:text-terracotta'}`}
              >
                About Us
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-xs font-bold text-stone/60">{user.displayName}</span>
                <button
                  onClick={logOut}
                  disabled={status === 'signing-out'}
                  className="bg-stone/10 text-stone px-4 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-stone/20 transition-all flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <LogOut size={14} />
                  {status === 'signing-out' ? 'Signing Out…' : 'Sign Out'}
                </button>
              </>
            ) : (
              <button
                onClick={signIn}
                disabled={status === 'signing-in'}
                className="bg-terracotta text-sand px-6 py-2.5 rounded-full text-[10px] uppercase tracking-widest font-black hover:bg-terracotta/90 transition-all shadow-lg shadow-terracotta/20 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === 'signing-in' ? 'Signing In…' : 'Sign In'}
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile BottomNavBar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-6 pt-2">
        <div className="bg-stone/90 backdrop-blur-2xl rounded-full px-8 py-4 flex items-center justify-between border border-white/5 shadow-2xl">
          <a
            href="#"
            className={`${
              activeSection === '' || activeSection === 'hero' ? 'text-terracotta' : 'text-sand/40'
            } hover:text-terracotta transition-colors`}
          >
            <Home size={20} />
          </a>

          {user && (
            <>
              <a
                href="#dashboard"
                className={`${
                  activeSection === 'dashboard' ? 'text-terracotta' : 'text-sand/40'
                } hover:text-terracotta transition-colors`}
              >
                <BookOpen size={20} />
              </a>

              <div className="relative -top-8">
                <a
                  href="#practice"
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl border-4 ${
                    activeSection === 'practice'
                      ? 'bg-stone text-terracotta border-terracotta shadow-stone/40'
                      : 'bg-terracotta text-sand border-sand shadow-terracotta/40'
                  }`}
                >
                  <PlayCircle size={28} />
                </a>
              </div>

              <a
                href="#wisdom"
                className={`${
                  activeSection === 'wisdom' ? 'text-terracotta' : 'text-sand/40'
                } hover:text-terracotta transition-colors`}
              >
                <Compass size={20} />
              </a>
            </>
          )}

          <a
            href="#about"
            className={`${
              activeSection === 'about' ? 'text-terracotta' : 'text-sand/40'
            } hover:text-terracotta transition-colors`}
          >
            <Info size={20} />
          </a>
        </div>

        {/* Optional: simple mobile sign-in/out button row */}
        <div className="mt-3 flex justify-center">
          {user ? (
            <button
              onClick={logOut}
              disabled={status === 'signing-out'}
              className="text-[10px] uppercase tracking-widest font-black px-5 py-2 rounded-full bg-stone/80 text-sand disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'signing-out' ? 'Signing Out…' : 'Sign Out'}
            </button>
          ) : (
            <button
              onClick={signIn}
              disabled={status === 'signing-in'}
              className="text-[10px] uppercase tracking-widest font-black px-5 py-2 rounded-full bg-terracotta text-sand disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'signing-in' ? 'Signing In…' : 'Sign In'}
            </button>
          )}
        </div>
      </nav>

      {/* Main Content with Page Transitions */}
      <AnimatePresence mode="wait">
        <motion.main
          key="main-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="relative z-10"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
