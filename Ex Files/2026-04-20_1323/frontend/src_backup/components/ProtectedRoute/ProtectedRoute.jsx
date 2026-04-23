import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();

  // If we have a cached user from localStorage, render immediately
  // without showing a loader — Firebase will confirm in the background
  if (loading && user) {
    return children;
  }

  if (loading) {
    // Minimal transparent loader — no jarring dark flash
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 28,
          height: 28,
          border: '3px solid rgba(0,0,0,0.08)',
          borderTopColor: '#e63946',
          borderRadius: '50%',
          animation: 'protectedSpin 0.7s linear infinite',
        }} />
        <style>{`@keyframes protectedSpin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
