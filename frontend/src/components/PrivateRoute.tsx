import React from 'react';
import { Navigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactElement;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
    // Not authenticated, redirect to signin
    return <Navigate to="/signin" replace />;
  }

  // Authenticated, render children
  return children;
};

export default PrivateRoute;
