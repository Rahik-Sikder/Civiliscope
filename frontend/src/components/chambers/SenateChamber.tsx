import React, { useState } from "react";
import "./Chamber.css";
import { senatorDesks } from "./senatorDesks";
import { useSenators } from "../../hooks/useSenators";
import type { Senator } from "../../types/senator";

export default function SenateChamber() {
  const [hoveredSeat, setHoveredSeat] = useState<number | null>(null);
  const { data: senators, isLoading, error } = useSenators();
  
  // Helper function to get senator by seat ID
  const getSenatorBySeat = (seatId: number): Senator | undefined => {
    return senators?.find(senator => senator.seat_number === seatId);
  };

  // Helper function to get party color with glassy effect
  const getPartyColor = (party: string) => {
    switch (party) {
      case 'Republican':
        return 'bg-patriot-neon-red/20 border-patriot-neon-red';
      case 'Democrat':
        return 'bg-patriot-neon-blue/20 border-patriot-neon-blue';
      default:
        return 'bg-gray-500/20 border-white-500';
    }
  };
  
  // Configurable seat layout variables
  const SEAT_WIDTH = "6%";
  const SEAT_HEIGHT = "4.5%";
  const SEAT_FONT_SIZE = "text-[11px]";
  const LAYOUT_SCALE = 0.88; // Scale factor to fit seats within chamber bounds

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Loading senators...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-400">Error loading senators: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Chamber Floor */}
      <div className="relative w-full aspect-[16/13] bg-gradient-to-b from-patriot-darker to-patriot-dark rounded-xl border border-patriot-neon-blue/20 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>
        
        {/* Senate podium area */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-gradient-to-r from-patriot-neon-red/30 to-patriot-neon-blue/30 rounded-lg border border-white/20"></div>
        
        {/* Senator seats */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={{
            width: `${100 * LAYOUT_SCALE}%`,
            height: `${90 * LAYOUT_SCALE}%`,
            left: '48%',
            top: '48%',
          }}
        >
          {senatorDesks.map(({ id, left, top, rotation }) => {
            const senator = getSenatorBySeat(id);
            const hasData = !!senator;
            const partyColors = hasData ? getPartyColor(senator.party) : 'bg-patriot-gray border-patriot-light-gray';
            
            return (
              <button
                key={id}
                className="absolute group transition-all duration-300 hover:scale-110 hover:z-10"
                style={{
                  left,
                  top,
                  transform: `rotate(${rotation}deg)`,
                  width: SEAT_WIDTH,
                  height: SEAT_HEIGHT,
                  // zIndex: hoveredSeat === id ? 30 : 10,
                }}
                onMouseEnter={() => setHoveredSeat(id)}
                onMouseLeave={() => setHoveredSeat(null)}
              >
                <div 
                  className={`w-full h-full rounded-md border-2 flex items-center justify-center ${SEAT_FONT_SIZE} font-bold transition-all duration-300 ${
                    hoveredSeat === id 
                      ? `${partyColors} shadow-lg shadow-current/50 text-white animate-pulse` 
                      : hasData
                        ? `${partyColors} opacity-80 hover:opacity-100 text-white`
                        : 'bg-patriot-gray border-patriot-light-gray hover:border-patriot-neon-blue text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="transform leading-none" style={{ transform: `rotate(${-rotation}deg)` }}>
                    {hasData ? senator.state : id}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Interactive overlay */}
        {hoveredSeat && (
          <div className="absolute bottom-4 left-1/6 transform -translate-x-1/2 glass-patriot rounded-lg px-4 py-2 border border-patriot-neon-red/30 max-w-sm">
            {(() => {
              const senator = getSenatorBySeat(hoveredSeat);
              if (senator) {
                return (
                  <div className="text-white text-sm space-y-1">
                    <p className="font-bold">{senator.name}</p>
                    <p className="text-gray-300">
                      {senator.state} • {senator.party}
                    </p>
                  </div>
                );
              } else {
                return (
                  <p className="text-white text-sm font-medium">
                    Seat {hoveredSeat} <span className="text-gray-400">• No data available</span>
                  </p>
                );
              }
            })()}
          </div>
        )}

        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-4 h-4 border border-patriot-neon-blue/50 rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 border border-patriot-neon-red/50 rotate-45 animate-pulse-slow"></div>
        
        {/* Ambient lighting effects */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-patriot-neon-red/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-patriot-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Chamber info overlay */}
      {senators && 
      <div className="absolute top-4 right-4 glass-dark rounded-lg p-3 border border-white/10">
        <div className="text-xs text-gray-400 space-y-1">
          <div>Seats: {senators?.length || 0}/100</div>
          <div className="text-patriot-neon-red">
            ● {senators?.filter(s => s.party === 'Republican').length || 0} Republicans
          </div>
          <div className="text-patriot-neon-blue">
            ● {senators?.filter(s => s.party === 'Democrat').length || 0} Democrats
          </div>
          {senators?.filter(s => s.party !== 'Republican' && s.party !== 'Democrat').length > 0 && (
            <div className="text-gray-400">
              ● {senators?.filter(s => s.party !== 'Republican' && s.party !== 'Democrat').length} Others
            </div>
          )}
        </div>
      </div>}
    </div>
  );
}
