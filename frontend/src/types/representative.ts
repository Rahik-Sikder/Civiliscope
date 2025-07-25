export interface Representative {
  id: number;
  name: string;
  state: string;
  district: number;
  party: string;
  photo_url?: string;
  term_start?: string;
  term_end?: string;
}