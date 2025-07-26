import type { Legislator } from './legislator';

export interface Senator extends Legislator {
  seat_number: number;
}

export interface SenatorDetails extends Senator {
  term_start: string;
  term_end: string;
}