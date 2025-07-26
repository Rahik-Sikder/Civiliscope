export interface Legislator {
  id: number;
  full_name: string;
  last_name?: string;
  state: string;
  party: string;
  photo_url?: string;
  term_start?: string;
  term_end?: string;
}