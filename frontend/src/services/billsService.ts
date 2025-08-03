import { api } from './api';
import type { BillsResponse, BillActionsResponse } from '../types/bill';

export const billsService = {
  getBillsForCurrentCongress: async (): Promise<BillsResponse> => {
    return api.get<BillsResponse>('/api/congress/bills');
  },

  getBillActions: async (
    congress: number,
    billType: string,
    billNumber: string
  ): Promise<BillActionsResponse> => {
    return api.get<BillActionsResponse>(
      `/api/congress/bills/${congress}/${billType}/${billNumber}/actions`
    );
  },
};