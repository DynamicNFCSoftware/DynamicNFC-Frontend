import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, sendPasswordResetEmail, multiFactor, TotpMultiFactorGenerator, TotpSecret } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Hydrate user from sessionStorage so protected routes render instantly
  // while Firebase confirms the session in the background
  const [user, setUser] = useState(() => {
    try {
      const uid = sessionStorage.getItem('accountId');
      const email = sessionStorage.getItem('userEmail');
      if (uid && email) {
        return { uid, email, sessionId: uid, accountId: uid };
      }
    } catch {}
    return null;
  });
  const [loading, setLoading] = useState(true);
  const initialResolved = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          sessionId: firebaseUser.uid,
          accountId: firebaseUser.uid,
        };
        setUser(userData);
        sessionStorage.setItem('sessionId', firebaseUser.uid);
        sessionStorage.setItem('userEmail', firebaseUser.email);
        sessionStorage.setItem('accountId', firebaseUser.uid);
      } else {
        setUser(null);
        sessionStorage.removeItem('sessionId');
        sessionStorage.removeItem('userEmail');
        sessionStorage.removeItem('accountId');
      }
      initialResolved.current = true;
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser({
      ...userData,
      uid: userData.accountId || userData.uid,
    });
    sessionStorage.setItem('sessionId', userData.sessionId);
    sessionStorage.setItem('userEmail', userData.email);
    sessionStorage.setItem('accountId', userData.accountId);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    sessionStorage.clear();
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const isAuthenticated = () => {
    return !!user && !!(user.sessionId || user.uid);
  };

  // 2FA helpers
  const get2FAStatus = () => {
    try {
      const mfa = multiFactor(auth.currentUser);
      return mfa.enrolledFactors.length > 0;
    } catch { return false; }
  };

  const setup2FA = async () => {
    const mfa = multiFactor(auth.currentUser);
    const session = await mfa.getSession();
    const totpSecret = await TotpMultiFactorGenerator.generateSecret(session);
    const qrUrl = totpSecret.generateQrCodeUrl(auth.currentUser.email, 'DynamicNFC');
    return { totpSecret, qrUrl };
  };

  const verify2FA = async (totpSecret, verificationCode) => {
    const assertion = TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, verificationCode);
    const mfa = multiFactor(auth.currentUser);
    await mfa.enroll(assertion, 'Authenticator App');
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    isAuthenticated,
    get2FAStatus,
    setup2FA,
    verify2FA,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
