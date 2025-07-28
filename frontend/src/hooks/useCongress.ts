import { useQuery } from '@tanstack/react-query';
import { congressService } from '../services/congressService';

export const useCongress = () => {
  return useQuery({
    queryKey: ['congress', 'current'],
    queryFn: congressService.getCurrentCongress,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};