import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="min-h-screen cyber-grid">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="container mx-auto px-6 py-20">
            <div className="text-center space-y-8">
              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-6xl lg:text-8xl font-bold tracking-wider">
                  <span className="holographic neon-text-glow">CIVILISCOPE</span>
                </h1>
                <div className="w-32 h-1 bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue mx-auto rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Explore the <span className="neon-red font-semibold">U.S. Congress</span> through 
                modern visualization — one seat at a time
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
                <Link
                  to="/senate"
                  className="group relative px-8 py-4 bg-gradient-to-r from-patriot-neon-red to-patriot-neon-red-glow rounded-lg font-semibold text-white tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-patriot-neon-red/25"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>EXPLORE SENATE</span>
                    <span className="text-xl">→</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-patriot-neon-red-glow to-patriot-neon-red opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  to="/house"
                  className="group relative px-8 py-4 glass-dark border-2 border-patriot-neon-blue rounded-lg font-semibold text-white tracking-wide overflow-hidden transition-all duration-300 hover:scale-105 hover:border-patriot-neon-blue-glow hover:shadow-lg hover:shadow-patriot-neon-blue/25"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>EXPLORE HOUSE</span>
                    <span className="text-xl">→</span>
                  </span>
                  <div className="absolute inset-0 bg-patriot-neon-blue/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>
              </div>
            </div>
          </div>

          {/* Floating geometric elements */}
          <div className="absolute top-20 left-10 w-32 h-32 border border-patriot-neon-red/30 rounded-full animate-pulse-slow"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 border border-patriot-neon-blue/30 rotate-45 animate-pulse-slow"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-r from-patriot-neon-red/20 to-patriot-neon-blue/20 rounded-full blur-xl animate-pulse-slow"></div>
        </div>

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-patriot rounded-xl p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue flex items-center justify-center">
                <span className="text-2xl font-bold text-white">🏛️</span>
              </div>
              <h3 className="text-xl font-bold text-white">Interactive Visualization</h3>
              <p className="text-gray-400">
                Hover over seats to explore detailed legislator information in real-time
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-patriot rounded-xl p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-patriot-neon-blue to-patriot-neon-red flex items-center justify-center">
                <span className="text-2xl font-bold text-white">📊</span>
              </div>
              <h3 className="text-xl font-bold text-white">Real-Time Data</h3>
              <p className="text-gray-400">
                Powered by official congress-legislators data for accuracy and reliability
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-patriot rounded-xl p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue flex items-center justify-center">
                <span className="text-2xl font-bold text-white">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-white">Modern Interface</h3>
              <p className="text-gray-400">
                Sleek, responsive design built for the modern web experience
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="glass-dark border-t border-b border-patriot-neon-red/20">
          <div className="container mx-auto px-6 py-16">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold neon-red">100</div>
                <div className="text-gray-400 tracking-wide">Senate Seats</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold neon-blue">435</div>
                <div className="text-gray-400 tracking-wide">House Seats</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold holographic">50</div>
                <div className="text-gray-400 tracking-wide">States</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-white">∞</div>
                <div className="text-gray-400 tracking-wide">Possibilities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
