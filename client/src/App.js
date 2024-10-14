import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages1/home';
import DetailFilm from './pages1/detailFilm';
import SearchPage from './pages1/searchPage';
import CMS from './pages1/cms';
import Signin from './pages1/signin';
import Signup from './pages1/signup';
import ProtectedRoute from './pages1/protectedRoute';
import NotFound from './pages1/content/notFound';

import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('id_user');
      setIsAuthenticated(false);
  };
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>} />
        <Route path="/detail/:id" element={<DetailFilm isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>} />
        <Route path="/search" element={<SearchPage isAuthenticated={isAuthenticated} handleLogout={handleLogout}/>} />
        
        <Route 
          path="/cms/*" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CMS />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/signin" element={<Signin setIsAuthenticated={setIsAuthenticated} handleLogin={handleLogin}/>} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/*" element={<NotFound />} />
        
      </Routes>
    </Router>
  );
}

export default App;
