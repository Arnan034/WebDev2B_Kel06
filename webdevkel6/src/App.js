import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages1/home';
import DetailFilm from './pages1/detailFilm';
import SearchPage from './pages1/searchPage';
import CMS from './pages1/cms';  // Import komponen CMS

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<DetailFilm />} />
        <Route path="/search" element={<SearchPage />} />
        {/* Gunakan path wildcard untuk CMS */}
        <Route path="/cms/*" element={<CMS />} />
      </Routes>
    </Router>
  );
}

export default App;
