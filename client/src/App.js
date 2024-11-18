import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Main
import Home from './pages/main/home';
import DetailFilm from './pages/main/detailFilm';
import SearchPage from './pages/main/searchPage';
import CMS from './pages/main/cms';

  // Not Found
import NotFound from './pages/main/notFound';

// Auth
import Signin from './pages/auth/signin';
import Signup from './pages/auth/signup';
import VerifyOTP from './pages/auth/verifyOTP';
import ForgotPassword from './pages/auth/forgotPassword';
import ResetPassword from './pages/auth/resetPassword';

// Protected
import ProtectedRoute from './pages/protected/protectedRoute';
import ProtectedRouteVerifyOTP from './pages/protected/protectedRouteOTP';

// Test
import Test from './pages/test/EditableTable';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('token');
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('id_user');
      sessionStorage.removeItem('role');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('picture');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
        <Route path="/detail/:id" element={<DetailFilm isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
        <Route path="/search" element={<SearchPage isAuthenticated={isAuthenticated} handleLogout={handleLogout} />} />
        <Route 
          path="/cms/*" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CMS />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/verifyOTP"
          element={
            <ProtectedRouteVerifyOTP>
              <VerifyOTP />
            </ProtectedRouteVerifyOTP>
          }
        />
        <Route path="/test" element={<Test />} />
        <Route path="/forgotPass" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} handleLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
