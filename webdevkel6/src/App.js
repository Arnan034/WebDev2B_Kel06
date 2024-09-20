import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages1/home';
import DetailFilm from './pages1/detailFilm';
import SearchPage from './pages1/searchPage'; // Impor halaman pencarian

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/detail" element={<DetailFilm />} />
        <Route path="/search" element={<SearchPage />} /> {/* Rute untuk halaman pencarian */}
      </Routes>
    </Router>
  );
}

export default App;
