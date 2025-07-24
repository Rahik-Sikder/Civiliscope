import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="bg-secondary text-secondary-content shadow-md">
            <nav className="navbar container mx-auto">
                <div className="flex-1">
                    <Link
                        to="/"
                        className="btn btn-secondary normal-case text-3xl px-8 py-4"
                    >
                        Civiliscope
                    </Link>
                </div>
                <div className="flex-none space-x-2">
                    <Link
                        to="/senate"
                        className="btn btn-secondary text-lg px-6 py-3"
                    >
                        Senate
                    </Link>
                    {/* Add House, Trackers later */}
                </div>
                <div className="flex-none space-x-2">
                    <Link
                        to="/house"
                        className="btn btn-secondary text-lg px-6 py-3"
                    >
                        House
                    </Link>
                    {/* Add House, Trackers later */}
                </div>
            </nav>
        </header>
    );
}
