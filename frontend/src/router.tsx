import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage.tsx';
import SenatePage from './pages/Senate/SenatePage.tsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/senate" element={<SenatePage />} />
        {/* Future routes here */}
      </Routes>
    </BrowserRouter>
  );
}
