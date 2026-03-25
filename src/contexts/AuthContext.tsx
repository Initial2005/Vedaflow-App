import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestore-error';

type AuthStatus = 'idle' | 'signing-in' | 'signing-out';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  status: AuthStatus;
  error: string | null;
  clearError: () => void;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function isPopupFallbackError(code: string | undefined) {
  // These commonly indicate popup won’t work; redirect is more reliable.
  return (
    code === 'auth/popup-blocked' ||
    code === 'auth/popup-closed-by-user' ||
    code === 'auth/cancelled-popup-request'
  );
}

function normalizeAuthError(error: unknown): { code?: string; message: string } {
  const maybe = error as Partial<AuthError> | undefined;
  const code = typeof maybe?.code === 'string' ? maybe.code : undefined;

  // Provide clearer messages for the most common real-world failures
  switch (code) {
    case 'auth/operation-not-allowed':
      return {
        code,
        message: 'Google sign-in is disabled in Firebase. Enable Google provider in Firebase Console → Authentication.',
      };
    case 'auth/unauthorized-domain':
      return {
        code,
        message:
          'This domain is not authorized for Firebase Auth. Add your domain in Firebase Console → Authentication → Settings → Authorized domains.',
      };
    case 'auth/popup-blocked':
      return {
        code,
        message: 'Popup was blocked by the browser. Retrying with redirect sign-in…',
      };
    default:
      return {
        code,
        message: error instanceof Error ? error.message : String(error),
      };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  useEffect(() => {
    // Handle redirect results (if we used signInWithRedirect)
    getRedirectResult(auth).catch((e) => {
      const info = normalizeAuthError(e);
      setError(info.message);
    });

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        try {
          // Create user profile doc if missing (don’t block auth UI on failure)
          const userRef = doc(db, 'users', currentUser.uid);
          const userSnap = await getDoc(userRef);

          if (!userSnap.exists()) {
            await setDoc(userRef, {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              createdAt: serverTimestamp(),
            });
          }
        } catch (e) {
          // Keep the app usable even if Firestore rules/config are wrong.
          console.error('Failed to create user profile document:', e);
          try {
            // still log structured info for debugging
            handleFirestoreError(e, OperationType.WRITE, `users/${currentUser.uid}`);
          } catch {
            // handleFirestoreError throws; swallow here to avoid breaking auth state updates
          }
        }
      }

      setLoading(false);
      setStatus('idle');
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    setError(null);
    setStatus('signing-in');

    try {
      await signInWithPopup(auth, googleProvider);
      // onAuthStateChanged will update state
    } catch (e) {
      const info = normalizeAuthError(e);
      console.error('Error signing in with Google:', e);

      // Fallback to redirect for popup-related failures (mobile/Safari/adblock)
      if (isPopupFallbackError(info.code)) {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (e2) {
          const info2 = normalizeAuthError(e2);
          setError(info2.message);
        }
      } else {
        setError(info.message);
      }

      setStatus('idle');
    }
  };

  const logOut = async () => {
    setError(null);
    setStatus('signing-out');

    try {
      await signOut(auth);
      // onAuthStateChanged will update state
    } catch (e) {
      const info = normalizeAuthError(e);
      console.error('Error signing out:', e);
      setError(info.message);
      setStatus('idle');
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({ user, loading, status, error, clearError, signIn, logOut }),
    [user, loading, status, error]
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
