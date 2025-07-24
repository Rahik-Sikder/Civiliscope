import { useQuery } from '@tanstack/react-query';
import { senatorsService } from '../services/senatorsService';
import type { Senator, SenatorDetails } from '../types/senator';

export const useSenators = () => {
  return useQuery({
    queryKey: ['senators'],
    queryFn: senatorsService.getAllSenators,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSenator = (senatorId: number) => {
  return useQuery({
    queryKey: ['senator', senatorId],
    queryFn: () => senatorsService.getSenator(senatorId),
    enabled: !!senatorId,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};