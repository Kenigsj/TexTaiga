// components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../App';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(UserContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Если пользователь пытается зайти не на свою страницу,
    // перенаправляем на правильную страницу в зависимости от роли
    return <Navigate to="/main" />;
  }

  return children;
};

export default ProtectedRoute;