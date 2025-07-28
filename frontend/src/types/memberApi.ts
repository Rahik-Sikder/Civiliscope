export interface MemberDepiction {
  attribution: string;
  imageUrl: string;
}

export interface MemberLegislation {
  count: number;
  url: string;
}

export interface MemberLeadership {
  congress: number;
  type: string;
}

export interface MemberPartyHistory {
  partyAbbreviation: string;
  partyName: string;
  startYear: number;
  endYear?: number;
}

export interface MemberTerm {
  chamber: string;
  congress: number;
  endYear: number;
  memberType: string;
  startYear: number;
  stateCode: string;
  stateName: string;
  district?: number;
}

export interface Member {
  bioguideId: string;
  birthYear: string;
  cosponsoredLegislation: MemberLegislation;
  depiction?: MemberDepiction;
  directOrderName: string;
  firstName: string;
  honorificName: string;
  invertedOrderName: string;
  lastName: string;
  leadership: MemberLeadership[];
  partyHistory: MemberPartyHistory[];
  sponsoredLegislation: MemberLegislation;
  state: string;
  terms: MemberTerm[];
  updateDate: string;
}

export interface MemberApiRequest {
  bioguideId: string;
  contentType: string;
  format: string;
}

export interface MemberApiResponse {
  member: Member;
  request: MemberApiRequest;
}