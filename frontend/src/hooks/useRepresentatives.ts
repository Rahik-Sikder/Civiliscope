import { useQuery } from '@tanstack/react-query';
import { representativesService } from '../services/representativesService';

export const useRepresentatives = () => {
  return useQuery({
    queryKey: ['representatives'],
    queryFn: representativesService.getAllRepresentatives,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useRepresentative = (representativeId: number) => {
  return useQuery({
    queryKey: ['representative', representativeId],
    queryFn: () => representativesService.getRepresentative(representativeId),
    enabled: !!representativeId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};