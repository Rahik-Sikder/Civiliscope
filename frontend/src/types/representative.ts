import type { Legislator } from './legislator';

export interface Representative extends Legislator {
  name: string;
  district: number;
}