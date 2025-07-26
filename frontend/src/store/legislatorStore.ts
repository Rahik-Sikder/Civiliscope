import { create } from 'zustand';
import type { Legislator } from '../types/legislator';

interface LegislatorStore {
  selectedLegislator: Legislator | null;
  hoveredLegislator: Legislator | null;
  selectedSeat: number | null;
  hoverSource: 'chamber' | 'list' | null;
  setSelectedLegislator: (legislator: Legislator | null) => void;
  setHoveredLegislator: (legislator: Legislator | null, source?: 'chamber' | 'list') => void;
  setSelectedSeat: (seatId: number | null) => void;
  setSelectedLegislatorAndSeat: (legislator: Legislator | null, seatId: number | null) => void;
  clearSelectedLegislator: () => void;
  clearHoveredLegislator: () => void;
}

export const useLegislatorStore = create<LegislatorStore>((set) => ({
  selectedLegislator: null,
  hoveredLegislator: null,
  selectedSeat: null,
  hoverSource: null,
  setSelectedLegislator: (legislator) => set({ selectedLegislator: legislator }),
  setHoveredLegislator: (legislator, source = 'chamber') => set({ 
    hoveredLegislator: legislator, 
    hoverSource: legislator ? source : null 
  }),
  setSelectedSeat: (seatId) => set({ selectedSeat: seatId }),
  setSelectedLegislatorAndSeat: (legislator, seatId) => set({ 
    selectedLegislator: legislator, 
    selectedSeat: seatId 
  }),
  clearSelectedLegislator: () => set({ selectedLegislator: null, selectedSeat: null }),
  clearHoveredLegislator: () => set({ hoveredLegislator: null, hoverSource: null }),
}));