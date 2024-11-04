import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages1/home';
import DetailFilm from './pages1/detailFilm';
import SearchPage from './pages1/searchPage';
import CMS from './pages1/cms';
import Signin from './pages1/signin';
import Signup from './pages1/signup';
import ProtectedRoute from './pages1/protectedRoute';
import VerifyOTP from './pages1/content/verifyOTP';
import NotFound from './pages1/content/notFound';
import Test from './pages1/content/EditableTable';
import ProtectedRouteVerifyOTP from './pages1/protectedRouteOTP';
import ForgotPassword from './pages1/content/forgotPassword';
import ResetPassword from './pages1/content/resetPassword';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id_user');
    sessionStorage.removeItem('role');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('picture');
    sessionStorage.setItem('isAuthenticated', 'false');
    setIsAuthenticated(false);
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
