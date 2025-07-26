import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="glass-patriot border-b border-patriot-neon-red/20 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo/Brand */}
                    <div className="flex items-center space-x-4">
                        <Link
                            to="/"
                            className="group relative overflow-hidden"
                        >
                            <span className="holographic text-4xl font-bold tracking-wider hover:scale-105 transition-transform duration-300">
                                CIVILISCOPE
                            </span>
                            <div className="absolute -bottom-2 left-0 w-0 h-0.5 bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue group-hover:w-full transition-all duration-500"></div>
                        </Link>
                        <div className="hidden lg:block w-px h-8 bg-gradient-to-b from-patriot-neon-red to-patriot-neon-blue"></div>
                        <span className="hidden lg:block text-sm text-gray-400 font-light tracking-wide">
                            Congress Visualization Platform
                        </span>
                    </div>

                    {/* Navigation */}
                    <div className="flex items-center space-x-1">
                        <Link
                            to="/senate"
                            className="group relative px-6 py-3 text-white font-medium tracking-wide overflow-hidden rounded-lg transition-all duration-300 hover:text-patriot-neon-red"
                        >
                            <span className="relative z-10">SENATE</span>
                            <div className="absolute inset-0 bg-patriot-gray/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-patriot-neon-red group-hover:w-full transition-all duration-300"></div>
                        </Link>
                        
                        <Link
                            to="/house"
                            className="group relative px-6 py-3 text-white font-medium tracking-wide overflow-hidden rounded-lg transition-all duration-300 hover:text-patriot-neon-blue"
                        >
                            <span className="relative z-10">HOUSE</span>
                            <div className="absolute inset-0 bg-patriot-gray/50 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-patriot-neon-blue group-hover:w-full transition-all duration-300"></div>
                        </Link>

                        <div className="w-px h-6 bg-gradient-to-b from-patriot-neon-red to-patriot-neon-blue mx-4"></div>
                        
                        {/* Future: Add search or user menu */}
                        <div className="w-10 h-10 rounded-full glass-dark border border-white/10 flex items-center justify-center cursor-pointer hover:border-patriot-neon-blue/50 transition-colors duration-300">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue animate-pulse"></div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}
