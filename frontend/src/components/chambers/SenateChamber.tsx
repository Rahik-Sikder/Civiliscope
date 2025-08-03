import { useEffect } from "react";
import "./Chamber.css";
import { senatorDesks } from "./senatorDesks";
import { useSenators } from "../../hooks/useSenators";
import { useLegislatorStore } from "../../store/legislatorStore";
import LoadingDots from "../shared/LoadingDots";
import type { Senator } from "../../types/senator";

interface SenateChamberProps {
  onSeatClick?: (seatId: number) => void;
  onSeatHover?: (seatId: number) => void;
  onSeatLeave?: () => void;
}

export default function SenateChamber({
  onSeatClick,
  onSeatHover,
  onSeatLeave,
}: SenateChamberProps) {
  const { data: senators, isLoading, error } = useSenators();
  const { selectedSeat, clearHoveredLegislator } = useLegislatorStore();
  
  // Cleanup hover state when component unmounts
  useEffect(() => {
    return () => {
      clearHoveredLegislator();
    };
  }, [clearHoveredLegislator]);
  
  // Helper function to get senator by seat ID
  const getSenatorBySeat = (seatId: number): Senator | undefined => {
    return senators?.find(senator => senator.seat_number === seatId);
  };

  // Handle seat click - use external handler if provided
  const handleSeatClick = (seatId: number) => {
    if (onSeatClick) {
      onSeatClick(seatId);
    }
  };

  // Handle seat hover - use external handler if provided
  const handleSeatHover = (seatId: number) => {
    if (onSeatHover) {
      onSeatHover(seatId);
    }
  };

  // Handle seat leave - use external handler if provided
  const handleSeatLeave = () => {
    if (onSeatLeave) {
      onSeatLeave();
    }
  };

  // Helper function to get party color with glassy effect
  const getPartyColor = (party: string) => {
    switch (party) {
      case 'Republican':
        return 'bg-patriot-neon-red/20 border-patriot-neon-red 1535:border-patriot-neon-red/80';
      case 'Democrat':
        return 'bg-patriot-neon-blue/20 border-patriot-neon-blue 1535:border-patriot-neon-blue/80';
      default:
        return 'bg-gray-500/20 border-white-500';
    }
  };
  
  // Configurable seat layout variables
  const SEAT_WIDTH = "6%";
  const SEAT_HEIGHT = "4.5%";
  const SEAT_FONT_SIZE = "xl:text-[11px] text-[9px]"; // Responsive font size
  const LAYOUT_SCALE = 0.90; // Scale factor to fit seats within chamber bounds


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <LoadingDots variant="purple" size="medium" speed="normal" />
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
                }}
                onClick={() => handleSeatClick(id)}
                onMouseEnter={() => handleSeatHover(id)}
                onMouseLeave={handleSeatLeave}
              >
                <div 
                  className={`w-full h-full rounded-md border-2 1535:border-6 flex items-center justify-center ${SEAT_FONT_SIZE} font-bold transition-all duration-300 ${
                    selectedSeat === id 
                      ? `${partyColors} shadow-[0_0_20px_rgba(255,255,255,0.6)] text-white animate-pulse` 
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


        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-4 h-4 border border-patriot-neon-blue/50 rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 border border-patriot-neon-red/50 rotate-45 animate-pulse-slow"></div>
        
        {/* Ambient lighting effects */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-patriot-neon-red/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-patriot-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Chamber info overlay - responsive positioning */}
      {senators && 
      <div className="absolute 
                      xl:top-4 xl:right-4 xl:bottom-auto
                      bottom-4 right-4
                      glass-dark rounded-lg border border-white/10
                      xl:p-3 p-2
                      xl:w-auto w-24">
        <div className="text-gray-400 
                        xl:text-xs text-[10px]
                        xl:space-y-1 space-y-0.5">
          <div className="xl:block hidden">Seats: {senators?.length || 0}/100</div>
          <div className="xl:hidden block">100/100</div>
          
          <div className="text-patriot-neon-red whitespace-nowrap">
            <span className="xl:inline hidden">● {senators?.filter(s => s.party === 'Republican').length || 0} Republicans</span>
            <span className="xl:hidden inline">● {senators?.filter(s => s.party === 'Republican').length || 0} R</span>
          </div>
          
          <div className="text-patriot-neon-blue whitespace-nowrap">
            <span className="xl:inline hidden">● {senators?.filter(s => s.party === 'Democrat').length || 0} Democrats</span>
            <span className="xl:hidden inline">● {senators?.filter(s => s.party === 'Democrat').length || 0} D</span>
          </div>
          
          {senators?.filter(s => s.party !== 'Republican' && s.party !== 'Democrat').length > 0 && (
            <div className="text-gray-400 whitespace-nowrap">
              <span className="xl:inline hidden">● {senators?.filter(s => s.party !== 'Republican' && s.party !== 'Democrat').length} Others</span>
              <span className="xl:hidden inline">● {senators?.filter(s => s.party !== 'Republican' && s.party !== 'Democrat').length} O</span>
            </div>
          )}
        </div>
      </div>}
    </div>
  );
}
