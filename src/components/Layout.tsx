// ...keep existing imports
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, BookOpen, PenTool, Compass, PlayCircle, LogOut, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function Layout({ children }: LayoutProps) {
  const { user, signIn, logOut, status, error, clearError } = useAuth();
  const [activeSection, setActiveSection] = useState<string>('');

  // ...keep your existing useEffect

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
              If this says “unauthorized-domain”, add your domain in Firebase Console → Auth → Settings → Authorized domains.
            </div>
          </div>
        </div>
      )}

      {/* Desktop TopNavBar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/10 backdrop-blur-xl rounded-full px-8 py-3 border border-white/10 shadow-2xl">
          {/* ...left side unchanged... */}

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

      {/* ...rest of your component unchanged... */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden px-4 pb-6 pt-2">
        {/* keep your mobile nav; optionally also disable sign-in there if you add a sign-in button */}
      </nav>

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
