import React, { createContext, useContext, useState, useEffect } from 'react';

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
    try {
      // Check if user is logged in on app start
      const sessionId = localStorage?.getItem('sessionId');
      const userEmail = localStorage?.getItem('userEmail');
      const accountId = localStorage?.getItem('accountId');
      
      if (sessionId && userEmail && accountId) {
        setUser({
          email: userEmail,
          sessionId: sessionId,
          accountId: accountId
        });
      }
    } catch (error) {
      console.warn('Error accessing localStorage:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('sessionId', userData.sessionId);
    localStorage.setItem('userEmail', userData.email);
    localStorage.setItem('accountId', userData.accountId);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sessionId');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('accountId');
    document.cookie = 'JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  const isAuthenticated = () => {
    return !!user && !!user.sessionId;
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};