import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const authContext = useAuth();
  
  if (!authContext) {
    return <Navigate to="/login" replace />;
  }
  
  const { isAuthenticated, loading } = authContext;

  if (loading) {
    return <div>Loading...</div>;
  }

  try {
    const authenticated = isAuthenticated ? isAuthenticated() : false;
    console.log('Authenticated:', authenticated);
    return authenticated ? children : <Navigate to="/login" replace />;
  } catch (error) {
    console.warn('Error in ProtectedRoute:', error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;