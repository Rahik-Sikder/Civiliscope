import React from "react";
import MainLayout from "../../components/layout/MainLayout";
import HouseChamber from "../../components/chambers/HouseChamber";

export default function HousePage() {
  return (
    <MainLayout>
      <div className="min-h-screen">
        {/* Header Section */}
        <div className="glass-patriot border-b border-patriot-neon-red/20">
          <div className="container mx-auto px-6 py-12">
            <div className="text-center space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold tracking-wider">
                <span className="neon-red">U.S.</span>{" "}
                <span className="holographic">HOUSE</span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue mx-auto rounded-full"></div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Interactive visualization of the lower chamber of Congress
              </p>
              
              {/* Stats Bar */}
              <div className="flex justify-center items-center space-x-8 pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold neon-red">435</div>
                  <div className="text-sm text-gray-400">Representatives</div>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-patriot-neon-red to-patriot-neon-blue"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold neon-blue">50</div>
                  <div className="text-sm text-gray-400">States</div>
                </div>
                <div className="w-px h-8 bg-gradient-to-b from-patriot-neon-red to-patriot-neon-blue"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold holographic">2</div>
                  <div className="text-sm text-gray-400">Year Terms</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chamber Visualization */}
        <div className="container mx-auto px-6 py-12">
          <div className="glass-dark rounded-2xl p-8 border border-patriot-neon-blue/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">House Chamber Layout</h2>
              <p className="text-gray-400">Hover over seats to explore representative information</p>
            </div>
            
            <HouseChamber />
            
            {/* Legend */}
            <div className="mt-8 flex justify-center">
              <div className="glass-patriot rounded-lg p-4">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-2 bg-patriot-neon-red rounded"></div>
                    <span className="text-gray-300">Republican</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-2 bg-patriot-neon-blue rounded"></div>
                    <span className="text-gray-300">Democrat</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-2 bg-gray-500 rounded"></div>
                    <span className="text-gray-300">Independent</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="container mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-patriot rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="neon-red mr-2">¡</span>
                Quick Facts
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>" Representation based on state population from census</p>
                <p>" Representatives serve 2-year terms with all seats up for election</p>
                <p>" The Speaker of the House presides over sessions</p>
                <p>" Majority party controls the legislative agenda</p>
              </div>
            </div>

            <div className="glass-patriot rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <span className="neon-blue mr-2">=Ê</span>
                Key Powers
              </h3>
              <div className="space-y-3 text-gray-300">
                <p>" Initiate all revenue and spending bills</p>
                <p>" Impeach federal officials</p>
                <p>" Choose the President if no Electoral College majority</p>
                <p>" Proportional representation by population</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}