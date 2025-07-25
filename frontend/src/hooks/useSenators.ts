import { useQuery } from '@tanstack/react-query';
import { senatorsService } from '../services/senatorsService';

export const useSenators = () => {
  return useQuery({
    queryKey: ['senators'],
    queryFn: senatorsService.getAllSenators,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSenator = (senatorId: number) => {
  return useQuery({
    queryKey: ['senator', senatorId],
    queryFn: () => senatorsService.getSenator(senatorId),
    enabled: !!senatorId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};