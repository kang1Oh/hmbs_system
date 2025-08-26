import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.role_id) {
    // Redirect logged-in user to their dashboard
    switch (user.role_id) {
      case '1': return <Navigate to="/requests-admin" replace />;
      case '2': return <Navigate to="/requests-instructor" replace />;
      case '3': return <Navigate to="/requests-programhead" replace />;
      case '4': return <Navigate to="/equipment" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  // No user → allow access to login page
  return children;
}

export default PublicRoute;
