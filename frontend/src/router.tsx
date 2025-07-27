import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/Home/HomePage.tsx';
import SenatePage from './pages/Senate/SenatePage.tsx';
import HousePage from './pages/House/HousePage.tsx';
import LegislatorPage from './pages/Legislator/LegislatorPage.tsx';
import { DebugPage } from './debug/DebugPage.tsx';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/senate" element={<SenatePage />} />
        <Route path="/house" element={<HousePage />} />
        <Route path="/legislator/:bioguideId" element={<LegislatorPage />} />
        <Route path="/debug" element={<DebugPage />} />
        {/* Future routes here */}
      </Routes>
    </BrowserRouter>
  );
}
