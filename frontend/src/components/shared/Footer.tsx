import React from 'react';

export default function Footer() {
    return (
        <footer className="glass-dark border-t border-patriot-neon-blue/20 mt-20">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col items-center space-y-6">
                    {/* Decorative line */}
                    <div className="w-32 h-px bg-gradient-to-r from-transparent via-patriot-neon-red to-patriot-neon-blue"></div>
                    
                    {/* Main content */}
                    <div className="text-center space-y-2">
                        <p className="text-gray-400 text-sm tracking-wide">
                            © 2025 <span className="neon-red font-medium">CIVILISCOPE</span>
                        </p>
                        <p className="text-gray-500 text-xs">
                            Built with <span className="neon-blue">⚡</span> by 
                            <span className="text-white font-medium ml-1">Rahik Sikder</span>
                        </p>
                    </div>
                    
                    {/* Tech stack indicator */}
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-patriot-neon-red animate-pulse"></div>
                            <span>React</span>
                        </div>
                        <div className="w-px h-3 bg-gray-600"></div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-patriot-neon-blue animate-pulse"></div>
                            <span>Python</span>
                        </div>
                        <div className="w-px h-3 bg-gray-600"></div>
                        <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-patriot-neon-red to-patriot-neon-blue animate-pulse"></div>
                            <span>PostgreSQL</span>
                        </div>
                    </div>

                    {/* Cyber grid decoration */}
                    <div className="w-full h-px bg-gradient-to-r from-transparent via-patriot-neon-blue/30 to-transparent"></div>
                    
                    {/* Data source attribution */}
                    <p className="text-xs text-gray-600 tracking-wide">
                        Data sourced from <span className="text-patriot-neon-blue">congress-legislators</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
