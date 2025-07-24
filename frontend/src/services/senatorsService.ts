import { api } from './api';
import type { Senator, SenatorDetails } from '../types/senator';

export const senatorsService = {
  getAllSenators: async (): Promise<Senator[]> => {
    return api.get<Senator[]>('/api/senators/');
  },

  getSenator: async (senatorId: number): Promise<SenatorDetails> => {
    return api.get<SenatorDetails>(`/api/senators/${senatorId}`);
  },
};