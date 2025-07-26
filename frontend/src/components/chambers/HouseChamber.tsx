import { useState, useMemo, useEffect } from "react";
import "./Chamber.css";
import { houseSeats } from "./houseSeats";
import { useRepresentatives } from "../../hooks/useRepresentatives";
import { useLegislatorStore } from "../../store/legislatorStore";
import type { Representative } from "../../types/representative";

export default function HouseChamber() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const { data: representatives, isLoading, error } = useRepresentatives();
  const {
    setSelectedLegislator,
    setHoveredLegislator,
    clearHoveredLegislator,
  } = useLegislatorStore();
  
  // Cleanup hover state when component unmounts
  useEffect(() => {
    return () => {
      clearHoveredLegislator();
    };
  }, [clearHoveredLegislator]);

  // Configurable seat layout variables (similar to Senate chamber)
  const SEAT_WIDTH = "3.8%";
  const SEAT_HEIGHT = "3.8%"; // Made square for circular appearance
  const SEAT_FONT_SIZE = "text-[9px]";
  const LAYOUT_SCALE = 1.25; // Scale factor to fit seats within chamber bounds

  const chamber_style = {
    width: `${75 * LAYOUT_SCALE}%`, // Maintain 1:1 aspect ratio within rectangular chamber
    height: `${100 * LAYOUT_SCALE}%`, // Full height of rectangular chamber
    left: "50%",
    top: "65%",
  };


  // Seating algorithm: Assign representatives to seats based on party
  const seatedRepresentatives = useMemo(() => {
    if (!representatives || representatives.length === 0) return new Map();

    const seating = new Map<number, Representative>();

    // Sort representatives by party - handle various party formats
    const democrats = representatives.filter(
      (r) =>
        r.party === "Democrat" || r.party === "Democratic" || r.party === "D"
    );
    const republicans = representatives.filter(
      (r) => r.party === "Republican" || r.party === "R"
    );
    const others = representatives.filter(
      (r) =>
        !["Democrat", "Democratic", "D", "Republican", "R"].includes(r.party)
    );

    // Get available seats by preference
    const democratSeats = houseSeats.filter(
      (s) => s.partyPreference === "Democrat"
    );
    const republicanSeats = houseSeats.filter(
      (s) => s.partyPreference === "Republican"
    );

    // Seat Democrats on the left
    democrats.forEach((rep, index) => {
      if (index < democratSeats.length) {
        seating.set(democratSeats[index].id, rep);
      }
    });

    // Seat Republicans on the right
    republicans.forEach((rep, index) => {
      if (index < republicanSeats.length) {
        seating.set(republicanSeats[index].id, rep);
      }
    });

    // Seat others in remaining seats
    const allUsedSeatIds = new Set(seating.keys());
    const remainingSeats = houseSeats.filter((s) => !allUsedSeatIds.has(s.id));

    others.forEach((rep, index) => {
      if (index < remainingSeats.length) {
        seating.set(remainingSeats[index].id, rep);
      }
    });

    return seating;
  }, [representatives]);

  // Helper function to get representative by seat ID
  const getRepresentativeBySeat = (
    seatId: number
  ): Representative | undefined => {
    return seatedRepresentatives.get(seatId);
  };


  // Handle seat click - set selected legislator
  const handleSeatClick = (seatId: number) => {
    const representative = getRepresentativeBySeat(seatId);
    if (representative) {
      setSelectedSeat(seatId);
      setSelectedLegislator(representative);
    } else {
      setSelectedSeat(seatId);
      setSelectedLegislator(null);
    }
  };

  // Handle seat hover - set hovered legislator
  const handleSeatHover = (seatId: number) => {
    const representative = getRepresentativeBySeat(seatId);
    if (representative) {
      setHoveredLegislator(representative);
    } else {
      setHoveredLegislator(null);
    }
  };

  // Handle seat leave - clear hover states
  const handleSeatLeave = () => {
    clearHoveredLegislator();
  };

  // Helper function to get party color with glassy effect
  const getPartyColor = (party: string) => {
    if (["Republican", "R"].includes(party)) {
      return "bg-patriot-neon-red/20 border-patriot-neon-red";
    } else if (["Democrat", "Democratic", "D"].includes(party)) {
      return "bg-patriot-neon-blue/20 border-patriot-neon-blue";
    } else {
      return "bg-gray-500/20 border-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white">Loading representatives...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-red-400">
          Error loading representatives: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Chamber Floor */}
      <div className="relative w-full aspect-[4/3] bg-gradient-to-b from-patriot-darker to-patriot-dark rounded-xl border border-patriot-neon-blue/20 overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0 cyber-grid opacity-30"></div>

        {/* Speaker's podium area */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-40 h-12 bg-gradient-to-r from-patriot-neon-red/30 to-patriot-neon-blue/30 rounded-lg border border-white/20">
          <div className="flex items-center justify-center h-full text-white text-xs font-bold">
            SPEAKER
          </div>
        </div>

        {/* House chamber well (center area) */}
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-patriot-dark/50 rounded-lg border border-white/10"></div>

        {/* Representative seats */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          style={chamber_style}
        >
          {houseSeats.map(({ id, left, top, rotation, partyPreference }) => {
            const representative = getRepresentativeBySeat(id);
            const hasData = !!representative;
            const partyColors = hasData
              ? getPartyColor(representative.party)
              : partyPreference === "Democrat"
              ? "bg-patriot-neon-blue/10 border-patriot-neon-blue/30"
              : partyPreference === "Republican"
              ? "bg-patriot-neon-red/10 border-patriot-neon-red/30"
              : "bg-patriot-gray border-patriot-light-gray";

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
                  className={`w-full h-full rounded-full border-2 flex items-center justify-center ${SEAT_FONT_SIZE} font-bold transition-all duration-300 ${
                    selectedSeat === id
                      ? `${partyColors} shadow-[0_0_20px_rgba(255,255,255,0.6)] text-white animate-pulse`
                      : hasData
                      ? `${partyColors} opacity-80 hover:opacity-100 text-white`
                      : `${partyColors} text-gray-400 hover:text-white`
                  }`}
                >
                  <span
                    className="transform leading-none"
                    style={{ transform: `rotate(${-rotation}deg)` }}
                  >
                    {hasData
                      ? representative.state.substring(0, 2).toUpperCase()
                      : id}
                  </span>
                </div>
              </button>
            );
          })}
        </div>


        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-4 h-4 border border-patriot-neon-red/50 rotate-45 animate-pulse-slow"></div>
        <div className="absolute bottom-10 right-10 w-4 h-4 border border-patriot-neon-blue/50 rotate-45 animate-pulse-slow"></div>

        {/* Ambient lighting effects */}
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-patriot-neon-red/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-32 h-32 bg-patriot-neon-blue/10 rounded-full blur-3xl animate-pulse-slow"></div>
      </div>

      {/* Chamber info overlay */}
      <div className="absolute top-4 right-4 glass-dark rounded-lg p-3 border border-white/10">
        <div className="text-xs text-gray-400 space-y-1">
          <div>Seats: {representatives?.length || 0}/435</div>
          <div className="text-patriot-neon-red">
            ●{" "}
            {representatives?.filter((r) =>
              ["Republican", "R"].includes(r.party)
            ).length || 0}{" "}
            Republicans
          </div>
          <div className="text-patriot-neon-blue">
            ●{" "}
            {representatives?.filter((r) =>
              ["Democrat", "Democratic", "D"].includes(r.party)
            ).length || 0}{" "}
            Democrats
          </div>
          {representatives &&
            representatives?.filter(
              (r) =>
                !["Republican", "R", "Democrat", "Democratic", "D"].includes(
                  r.party
                )
            ).length > 0 && (
              <div className="text-gray-400">
                ●{" "}
                {
                  representatives?.filter(
                    (r) =>
                      ![
                        "Republican",
                        "R",
                        "Democrat",
                        "Democratic",
                        "D",
                      ].includes(r.party)
                  ).length
                }{" "}
                Others
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
