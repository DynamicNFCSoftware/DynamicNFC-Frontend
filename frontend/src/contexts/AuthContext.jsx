import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        localStorage.setItem('sessionId', firebaseUser.uid);
        localStorage.setItem('userEmail', firebaseUser.email);
        localStorage.setItem('accountId', firebaseUser.uid);
      } else {
        setUser(null);
        localStorage.removeItem('sessionId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('accountId');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser({
      ...userData,
      uid: userData.accountId || userData.uid,
    });
    localStorage.setItem('sessionId', userData.sessionId);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('accountId', userData.accountId);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accountId');
  };

  const resetPassword = async (email) => {
    await sendPasswordResetEmail(auth, email);
  };

  const isAuthenticated = () => {
    return !!user && !!(user.sessionId || user.uid);
  };

  const value = {
    user,
    login,
    logout,
    resetPassword,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
