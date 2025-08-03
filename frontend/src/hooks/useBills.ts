import { useQuery } from '@tanstack/react-query';
import { billsService } from '../services/billsService';

export const useBillsForCurrentCongress = () => {
  return useQuery({
    queryKey: ['bills', 'current-congress'],
    queryFn: billsService.getBillsForCurrentCongress,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useBillActions = (
  congress: number,
  billType: string,
  billNumber: string
) => {
  return useQuery({
    queryKey: ['bill-actions', congress, billType, billNumber],
    queryFn: () => billsService.getBillActions(congress, billType, billNumber),
    enabled: !!(congress && billType && billNumber),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};