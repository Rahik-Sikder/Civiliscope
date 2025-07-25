import { api } from './api';
import type { Representative } from '../types/representative';

export const representativesService = {
  getAllRepresentatives: async (): Promise<Representative[]> => {
    return api.get<Representative[]>('/api/representatives/');
  },

  getRepresentative: async (representativeId: number): Promise<Representative> => {
    return api.get<Representative>(`/api/representatives/${representativeId}`);
  },
};