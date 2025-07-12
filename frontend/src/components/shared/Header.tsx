import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-blue-900 text-white p-4 shadow-md">
      <nav className="container mx-auto flex justify-between">
        <Link to="/" className="font-bold text-xl">Civiscope</Link>
        <div className="space-x-4">
          <Link to="/senate" className="hover:underline">Senate</Link>
          {/* Add House, Trackers later */}
        </div>
      </nav>
    </header>
  );
}
