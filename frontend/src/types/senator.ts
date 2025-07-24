export interface Senator {
  id: number;
  name: string;
  state: string;
  party: string;
  photo_url?: string;
  term_start?: string;
  term_end?: string;
}

export interface SenatorDetails extends Senator {
  term_start: string;
  term_end: string;
}