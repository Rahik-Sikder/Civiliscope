import React, { type ReactNode } from 'react';
import Header from '../shared/Header.tsx';
import Footer from '../shared/Footer.tsx';

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4">{children}</main>
      <Footer />
    </div>
  );
}
