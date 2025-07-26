import type { Legislator } from './legislator';

export interface Representative extends Legislator {
  district: number;
}