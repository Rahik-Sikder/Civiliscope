import { useQuery } from '@tanstack/react-query';
import { memberService } from '../services/memberService';
import type { MemberApiResponse } from '../types/memberApi';

export function useMemberDetails(bioguideId: string | undefined) {
  return useQuery<MemberApiResponse>({
    queryKey: ['member', bioguideId],
    queryFn: () => memberService.getMemberDetails(bioguideId!),
    enabled: !!bioguideId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}