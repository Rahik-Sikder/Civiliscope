import { useEffect, useRef, useState } from "react";
import type { Legislator } from "../../types/legislator";
import SearchBar from "../shared/SearchBar";

interface LegislatorListProps {
  legislators: Legislator[];
  selectedLegislator: Legislator | null;
  hoveredLegislator: Legislator | null;
  onLegislatorClick: (legislator: Legislator) => void;
  onLegislatorHover: (legislator: Legislator) => void;
  onLegislatorLeave: () => void;
  chamber: "senate" | "house";
}

export default function LegislatorList({
  legislators,
  selectedLegislator,
  hoveredLegislator,
  onLegislatorClick,
  onLegislatorHover,
  onLegislatorLeave,
  chamber,
}: LegislatorListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-scroll to selected legislator
  useEffect(() => {
    if (selectedLegislator && selectedItemRef.current && listRef.current) {
      const container = listRef.current;
      const element = selectedItemRef.current;
      
      // Calculate position slightly above center
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop;
      const elementHeight = element.clientHeight;
      
      // Position element at 40% from top instead of 50% (center)
      const targetScrollTop = elementTop - (containerHeight * .5) + (elementHeight / 2);
      
      container.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth"
      });
    }
  }, [selectedLegislator]);

  // Helper function to get party color
  const getPartyColor = (party: string) => {
    if (["Republican", "R"].includes(party)) {
      return "border-patriot-neon-red bg-patriot-neon-red/10";
    } else if (["Democrat", "Democratic", "D"].includes(party)) {
      return "border-patriot-neon-blue bg-patriot-neon-blue/10";
    } else {
      return "border-gray-500 bg-gray-500/10";
    }
  };

  // Helper function to get party text color
  const getPartyTextColor = (party: string) => {
    if (["Republican", "R"].includes(party)) {
      return "text-patriot-neon-red";
    } else if (["Democrat", "Democratic", "D"].includes(party)) {
      return "text-patriot-neon-blue";
    } else {
      return "text-gray-400";
    }
  };

  // Filter legislators based on search query
  const filteredLegislators = legislators.filter((legislator) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      legislator.name.toLowerCase().includes(query) ||
      legislator.state.toLowerCase().includes(query) ||
      legislator.party.toLowerCase().includes(query)
    );
  });

  // Sort filtered legislators by party, then by state
  const sortedLegislators = [...filteredLegislators].sort((a, b) => {
    // First sort by party
    const partyOrder = { Republican: 0, R: 0, Democrat: 1, Democratic: 1, D: 1 };
    const aPartyOrder = partyOrder[a.party as keyof typeof partyOrder] ?? 2;
    const bPartyOrder = partyOrder[b.party as keyof typeof partyOrder] ?? 2;
    
    if (aPartyOrder !== bPartyOrder) {
      return aPartyOrder - bPartyOrder;
    }
    
    // Then by state
    return a.state.localeCompare(b.state);
  });

  return (
    <div className="glass-dark rounded-2xl border border-patriot-neon-blue/20 h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-lg font-bold text-white mb-3">
          {chamber === "senate" ? "Senators" : "Representatives"}
        </h3>
        <SearchBar
          placeholder={`Search ${chamber === "senate" ? "senators" : "representatives"}...`}
          value={searchQuery}
          onChange={setSearchQuery}
          size="sm"
          variant="glass"
          className="w-full"
        />
        {searchQuery && (
          <p className="text-xs text-gray-400 mt-2">
            {sortedLegislators.length} of {legislators.length} {chamber === "senate" ? "senators" : "representatives"}
          </p>
        )}
      </div>

      {/* Scrollable List */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-track-patriot-dark scrollbar-thumb-patriot-neon-blue/50"
      >
        {sortedLegislators.map((legislator) => {
          const isSelected = selectedLegislator?.bioguide_id === legislator.bioguide_id;
          const isHovered = hoveredLegislator?.bioguide_id === legislator.bioguide_id;
          const partyColors = getPartyColor(legislator.party);
          const partyTextColor = getPartyTextColor(legislator.party);

          return (
            <div
              key={legislator.bioguide_id}
              ref={isSelected ? selectedItemRef : null}
              className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                hover:scale-105 hover:shadow-lg
                ${
                  isSelected
                    ? `${partyColors} shadow-[0_0_20px_rgba(255,255,255,0.4)] animate-pulse`
                    : isHovered
                    ? `${partyColors} opacity-90`
                    : `border-white/10 bg-patriot-dark/50 hover:${partyColors.split(" ")[1]} hover:border-white/30`
                }
              `}
              onClick={() => onLegislatorClick(legislator)}
              onMouseEnter={() => onLegislatorHover(legislator)}
              onMouseLeave={onLegislatorLeave}
            >
              <div className="flex items-center space-x-3">
                {/* Profile Image or Placeholder */}
                <div className="w-10 h-10 rounded-full bg-patriot-gray border border-white/20 flex items-center justify-center overflow-hidden">
                  {legislator.photo_url ? (
                    <img
                      src={legislator.photo_url}
                      alt={legislator.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-sm font-bold">
                      {legislator.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                {/* Legislator Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm truncate">
                    {legislator.name}
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-gray-400">{legislator.state}</span>
                    <span className="text-gray-500">•</span>
                    <span className={partyTextColor}>
                      {legislator.party === "Republican" || legislator.party === "R"
                        ? "R"
                        : legislator.party === "Democrat" ||
                          legislator.party === "Democratic" ||
                          legislator.party === "D"
                        ? "D"
                        : legislator.party}
                    </span>
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-white/10">
        <div className="flex justify-between text-xs text-gray-400">
          <span className="text-patriot-neon-red">
            {sortedLegislators.filter((l) => ["Republican", "R"].includes(l.party)).length} R
          </span>
          <span className="text-patriot-neon-blue">
            {sortedLegislators.filter((l) => ["Democrat", "Democratic", "D"].includes(l.party)).length} D
          </span>
          {sortedLegislators.filter(
            (l) => !["Republican", "R", "Democrat", "Democratic", "D"].includes(l.party)
          ).length > 0 && (
            <span className="text-gray-400">
              {sortedLegislators.filter(
                (l) => !["Republican", "R", "Democrat", "Democratic", "D"].includes(l.party)
              ).length} Other
            </span>
          )}
        </div>
      </div>
    </div>
  );
}