import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(UserContext);
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/main" />;
  }

  return children;
};

export default ProtectedRoute;
