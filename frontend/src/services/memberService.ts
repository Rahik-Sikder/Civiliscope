import { api } from './api';
import type { MemberApiResponse } from '../types/memberApi';

export const memberService = {
  /**
   * Fetch detailed member information by bioguide ID
   */
  async getMemberDetails(bioguideId: string): Promise<MemberApiResponse> {
    return api.get<MemberApiResponse>(`api/members/${bioguideId}`);
  }
};