export interface CongressSession {
  chamber: string;
  endDate?: string;
  number: number;
  startDate: string;
  type: string;
}

export interface Congress {
  endYear: string;
  name: string;
  number: number;
  sessions: CongressSession[];
  startYear: string;
  updateDate: string;
  url: string;
}

export interface CurrentCongressResponse {
  congress: Congress;
}