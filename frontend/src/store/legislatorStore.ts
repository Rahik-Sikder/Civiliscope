import { create } from 'zustand';
import type { Legislator } from '../types/legislator';

interface LegislatorStore {
  selectedLegislator: Legislator | null;
  hoveredLegislator: Legislator | null;
  setSelectedLegislator: (legislator: Legislator | null) => void;
  setHoveredLegislator: (legislator: Legislator | null) => void;
  clearSelectedLegislator: () => void;
  clearHoveredLegislator: () => void;
}

export const useLegislatorStore = create<LegislatorStore>((set) => ({
  selectedLegislator: null,
  hoveredLegislator: null,
  setSelectedLegislator: (legislator) => set({ selectedLegislator: legislator }),
  setHoveredLegislator: (legislator) => set({ hoveredLegislator: legislator }),
  clearSelectedLegislator: () => set({ selectedLegislator: null }),
  clearHoveredLegislator: () => set({ hoveredLegislator: null }),
}));