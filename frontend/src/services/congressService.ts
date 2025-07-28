import { api } from './api';
import type { CurrentCongressResponse } from '../types/congress';

export const congressService = {
  getCurrentCongress: (): Promise<CurrentCongressResponse> =>
    api.get<CurrentCongressResponse>('api/congress/current'),
};