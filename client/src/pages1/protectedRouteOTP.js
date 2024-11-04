import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRouteOTP = ({ children }) => {
  const otpToken = sessionStorage.getItem('otpToken');

  if (!otpToken) {
    return <Navigate to="/signup" />;
  }

  return children;
};

export default ProtectedRouteOTP;
