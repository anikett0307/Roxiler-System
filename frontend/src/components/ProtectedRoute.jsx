import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // 1. Not logged in -> Redirect to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role not authorized -> Redirect to their respective default home
  if (allowedRoles && !allowedRoles.includes(user.user.role)) {
    const role = user.user.role;
    if (role === 'SYSTEM_ADMIN') return <Navigate to="/admin" replace />;
    if (role === 'STORE_OWNER') return <Navigate to="/owner" replace />;
    return <Navigate to="/stores" replace />;
  }

  return children;
};

export default ProtectedRoute;