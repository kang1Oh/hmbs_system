import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem('user'));

  // No user found → redirect to login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Check if user role is allowed for this route
  if (allowedRoles && !allowedRoles.includes(user.role_id)) {
    switch (user.role_id) {
      case '1': return <Navigate to="/requests-admin" replace />;
      case '2': return <Navigate to="/requests-instructor" replace />;
      case '3': return <Navigate to="/requests-programhead" replace />;
      case '4': return <Navigate to="/equipment" replace />;
      default: return <Navigate to="/" replace />;
    }
  }

  // Role is allowed → show content
  return children;
}

export default ProtectedRoute;
