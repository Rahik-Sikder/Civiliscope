import { Link } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { useCongress } from "../../hooks/useCongress";

export default function HomePage() {
  const { data: congress, isLoading, error } = useCongress();

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
                Promoting <span className="neon-red font-semibold">Congressional Transparency</span> through 
                modern visualization and real-time data — revealing lobbying influence one seat at a time
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

        {/* Current Congress Section */}
        {congress && (
          <div className="glass-dark border-y border-patriot-neon-blue/20">
            <div className="container mx-auto px-6 py-16">
              <div className="text-center space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl lg:text-5xl font-bold">
                    <span className="holographic">{congress.congress.name}</span>
                  </h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-patriot-neon-blue to-patriot-neon-red mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 ">
                  <div className="glass-patriot rounded-xl p-6 text-center space-y-3 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold neon-blue">{congress.congress.number}</div>
                    <div className="text-gray-300 font-semibold">Congress Number</div>
                  </div>
                  
                  <div className="glass-patriot rounded-xl p-6 text-center space-y-3 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold holographic">{congress.congress.startYear} - {congress.congress.endYear}</div>
                    <div className="text-gray-300 font-semibold">Term Period</div>
                  </div>
                  
                  <div className="glass-patriot rounded-xl p-6 text-center space-y-3 hover:scale-105 transition-transform duration-300">
                    <div className="text-3xl font-bold neon-red">{congress.congress.sessions.length}</div>
                    <div className="text-gray-300 font-semibold">Sessions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="glass-dark border-y border-patriot-neon-red/20">
            <div className="container mx-auto px-6 py-8">
              <div className="text-center">
                <p className="text-patriot-neon-red">Unable to load current congress information</p>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="glass-dark border-y border-patriot-neon-blue/20">
            <div className="container mx-auto px-6 py-16">
              <div className="text-center">
                <div className="text-patriot-neon-blue animate-pulse">Loading congress information...</div>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="container mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-patriot rounded-xl p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue flex items-center justify-center">
                <span className="text-2xl font-bold text-white">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-white">Congressional Transparency</h3>
              <p className="text-gray-400">
                Uncover the inner workings of Congress with detailed legislator profiles and voting records
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-patriot rounded-xl p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-patriot-neon-blue to-patriot-neon-red flex items-center justify-center">
                <span className="text-2xl font-bold text-white">📡</span>
              </div>
              <h3 className="text-xl font-bold text-white">Live Congressional Data</h3>
              <p className="text-gray-400">
                Access up-to-date information on current members, sessions, and legislative activities
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-patriot rounded-xl p-8 text-center space-y-4 hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue flex items-center justify-center">
                <span className="text-2xl font-bold text-white">💰</span>
              </div>
              <h3 className="text-xl font-bold text-white">Lobbying Intelligence</h3>
              <p className="text-gray-400">
                Reveal lobbying connections and influence networks shaping congressional decisions
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
                <div className="text-4xl font-bold text-white">🏛️</div>
                <div className="text-gray-400 tracking-wide">Democracy</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
