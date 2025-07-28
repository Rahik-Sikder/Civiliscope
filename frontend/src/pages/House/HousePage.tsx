import { useMemo, useEffect } from "react";
import MainLayout from "../../components/layout/MainLayout";
import HouseChamber from "../../components/chambers/HouseChamber";
import LegislatorPreview from "../../components/dashboard/LegislatorPreview";
import LegislatorList from "../../components/dashboard/LegislatorList";
import RecentMotions from "../../components/dashboard/RecentMotions";
import RecentHeadlines from "../../components/dashboard/RecentHeadlines";
import TodaysFact from "../../components/dashboard/TodaysFact";
import TodaysPower from "../../components/dashboard/TodaysPower";
import LegislatorHoverTooltip from "../../components/chambers/LegislatorHoverTooltip";
import { useMousePosition } from "../../hooks/useMousePosition";
import { useRepresentatives } from "../../hooks/useRepresentatives";
import { useLegislatorStore } from "../../store/legislatorStore";
import type { Legislator } from "../../types/legislator";
import type { Representative } from "../../types/representative";
import { houseSeats } from "../../components/chambers/houseSeats";

export default function HousePage() {
  const mousePosition = useMousePosition();
  const { data: representatives } = useRepresentatives();
  const { 
    selectedLegislator, 
    hoveredLegislator, 
    setHoveredLegislator, 
    setSelectedLegislatorAndSeat,
    clearHoveredLegislator,
    clearSelectedLegislator 
  } = useLegislatorStore();

  // Clear selected legislator when page loads
  useEffect(() => {
    clearSelectedLegislator();
  }, [clearSelectedLegislator]);

  // Create seating map (matches HouseChamber logic)
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

  // Helper function to find representative by seat number
  const getRepresentativeBySeat = (seatId: number): Representative | undefined => {
    return seatedRepresentatives.get(seatId);
  };

  // Helper function to find seat number by representative
  const getSeatByRepresentative = (legislator: Legislator): number | null => {
    for (const [seatId, rep] of seatedRepresentatives.entries()) {
      if (rep.bioguide_id === legislator.bioguide_id) {
        return seatId;
      }
    }
    return null;
  };

  // Handler for when legislator is clicked from list
  const handleLegislatorClick = (legislator: Legislator) => {
    const seatId = getSeatByRepresentative(legislator);
    setSelectedLegislatorAndSeat(legislator, seatId);
  };

  // Handler for when legislator is hovered from list
  const handleLegislatorHover = (legislator: Legislator) => {
    setHoveredLegislator(legislator, 'list');
  };

  // Handler for when leaving hover from list
  const handleLegislatorLeave = () => {
    clearHoveredLegislator();
  };

  // Handler for when seat is clicked from chamber
  const handleSeatClick = (seatId: number) => {
    const representative = getRepresentativeBySeat(seatId) as Legislator;
    setSelectedLegislatorAndSeat(representative, seatId);
  };

  // Handler for when seat is hovered from chamber
  const handleSeatHover = (seatId: number) => {
    const representative = getRepresentativeBySeat(seatId) as Legislator;
    setHoveredLegislator(representative, 'chamber');
  };

  // Handler for when leaving hover from chamber
  const handleSeatLeave = () => {
    clearHoveredLegislator();
  };
  
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

        {/* Dashboard Grid */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-6 min-h-screen">
            {/* Main Chamber - Takes up most space */}
            <div className="col-span-12 lg:col-span-8 xl:col-span-9">
              <div className="glass-dark rounded-2xl p-6 h-full border border-patriot-neon-blue/20">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">House Chamber Layout</h2>
                  <p className="text-gray-400">Click on seats to explore representative information</p>
                </div>
                
                <div className="w-full">
                  <HouseChamber 
                    onSeatClick={handleSeatClick}
                    onSeatHover={handleSeatHover}
                    onSeatLeave={handleSeatLeave}
                  />
                </div>
                
                {/* Legend */}
                <div className="mt-6 flex justify-center">
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

            {/* Right Sidebar - Information Panels */}
            <div className="col-span-12 lg:col-span-4 xl:col-span-3">
              {/* Container with responsive height that scales with screen size */}
              <div className="w-full h-215 lg:h-175 xl:h-250 1535:h-315 flex flex-col space-y-6">
                {/* Legislator Preview */}
                <div className="h-70 flex-shrink-0">
                  <LegislatorPreview />
                </div>

                {/* Representative List - Takes remaining space */}
                <div className="flex-1 min-h-0">
                  {representatives && (
                    <LegislatorList
                      legislators={representatives}
                      selectedLegislator={selectedLegislator}
                      hoveredLegislator={hoveredLegislator}
                      onLegislatorClick={handleLegislatorClick}
                      onLegislatorHover={handleLegislatorHover}
                      onLegislatorLeave={handleLegislatorLeave}
                      chamber="house"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Section - Recent Activity */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96">
                <RecentMotions />
              </div>
              <div className="h-96">
                <RecentHeadlines />
              </div>
            </div>

            {/* Today's Fact and Power - Moved below */}
            <div className="col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-72">
                <TodaysFact chamber="house" />
              </div>
              <div className="h-80">
                <TodaysPower chamber="house" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global Hover Tooltip */}
      <LegislatorHoverTooltip position={mousePosition} />
    </MainLayout>
  );
}