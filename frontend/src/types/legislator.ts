export interface Legislator {
  id: number;
  bioguide_id: string;
  name: string;
  last_name?: string;
  state: string;
  party: string;
  photo_url?: string;
  term_start?: string;
  term_end?: string;
}