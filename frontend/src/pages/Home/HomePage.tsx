import React from 'react';
import MainLayout from '../../components/layout/MainLayout';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="text-center mt-20">
        <h1 className="text-4xl font-bold mb-4">Welcome to Civiscope</h1>
        <p className="text-lg">Explore the US Congress, one seat at a time.</p>
      </div>
    </MainLayout>
  );
}
