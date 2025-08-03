export interface Bill {
  congress: number;
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  type: string;
  updateDate: string;
  updateDateIncludingText: string;
  url: string;
  latestAction?: BillLatestAction;
  introducedDate?: string;
  introducedDateFormatted?: string;
  policyArea?: BillPolicyArea;
  sponsors?: BillSponsor[];
  cosponsors?: BillCosponsor[];
  committees?: BillCommittee[];
  actions?: BillAction[];
  laws?: BillLaw[];
  notes?: BillNote[];
  recordedVotes?: BillRecordedVote[];
  relatedBills?: BillRelatedBill[];
  subjects?: BillSubject[];
  summaries?: BillSummary[];
  textVersions?: BillTextVersion[];
  titles?: BillTitle[];
}

export interface BillLatestAction {
  date: string;
  text: string;
  type?: string;
  actionCode?: string;
  sourceSystem?: BillActionSourceSystem;
  committee?: BillActionCommittee;
}

export interface BillAction {
  actionDate: string;
  text: string;
  type?: string;
  actionCode?: string;
  sourceSystem?: BillActionSourceSystem;
  committee?: BillActionCommittee;
  actionTime?: string;
  links?: BillActionLink[];
  recordedVotes?: BillActionRecordedVote[];
  calendarNumber?: string;
}

export interface BillActionSourceSystem {
  code: string;
  name: string;
}

export interface BillActionCommittee {
  name: string;
  systemCode: string;
  url: string;
}

export interface BillActionLink {
  name: string;
  url: string;
}

export interface BillActionRecordedVote {
  chamber: string;
  congress: number;
  date: string;
  rollNumber: number;
  sessionNumber: number;
  url: string;
}

export interface BillPolicyArea {
  name: string;
}

export interface BillSponsor {
  bioguideId: string;
  firstName: string;
  fullName: string;
  lastName: string;
  middleName?: string;
  party: string;
  state: string;
  url: string;
  district?: number;
  isByRequest?: string;
}

export interface BillCosponsor {
  bioguideId: string;
  firstName: string;
  fullName: string;
  lastName: string;
  middleName?: string;
  party: string;
  state: string;
  url: string;
  district?: number;
  sponsorshipDate: string;
  sponsorshipWithdrawnDate?: string;
  isOriginalCosponsor: boolean;
}

export interface BillCommittee {
  name: string;
  systemCode: string;
  url: string;
  chamber: string;
  activities?: BillCommitteeActivity[];
  subcommittees?: BillSubcommittee[];
}

export interface BillCommitteeActivity {
  date: string;
  name: string;
}

export interface BillSubcommittee {
  name: string;
  systemCode: string;
  url: string;
  activities?: BillCommitteeActivity[];
}

export interface BillLaw {
  number: string;
  type: string;
}

export interface BillNote {
  text: string;
}

export interface BillRecordedVote {
  chamber: string;
  congress: number;
  date: string;
  rollNumber: number;
  sessionNumber: number;
  url: string;
}

export interface BillRelatedBill {
  congress: number;
  latestAction?: BillLatestAction;
  number: string;
  relationshipDetails?: BillRelationshipDetail[];
  title: string;
  type: string;
  url: string;
}

export interface BillRelationshipDetail {
  identifiedBy: string;
  type: string;
}

export interface BillSubject {
  name: string;
}

export interface BillSummary {
  actionDate: string;
  actionDesc: string;
  text: string;
  updateDate: string;
  versionCode: string;
}

export interface BillTextVersion {
  date: string;
  type: string;
  formats?: BillTextFormat[];
}

export interface BillTextFormat {
  type: string;
  url: string;
}

export interface BillTitle {
  title: string;
  titleType: string;
  titleTypeCode: string;
  chamberCode?: string;
  chamberName?: string;
  billTextVersionCode?: string;
  billTextVersionName?: string;
}

// API Response interfaces
export interface BillsRequest {
  congress: string;
  contentType: string;
  format: string;
}

export interface BillsPagination {
  count: number;
  next?: string;
  prev?: string;
}

export interface BillsResponse {
  bills: Bill[];
  pagination: BillsPagination;
  request: BillsRequest;
}

export interface BillActionsRequest {
  billNumber: string;
  billType: string;
  congress: string;
  contentType: string;
  format: string;
}

export interface BillActionsPagination {
  count: number;
  next?: string;
  prev?: string;
}

export interface BillActionsResponse {
  actions: BillAction[];
  pagination: BillActionsPagination;
  request: BillActionsRequest;
}

// Simplified interfaces for display
export interface SimpleBill {
  congress: number;
  number: string;
  type: string;
  title: string;
  originChamber: string;
  introducedDate?: string;
  latestActionDate?: string;
  latestActionText?: string;
  sponsor?: string;
  policyArea?: string;
}

export interface SimpleBillAction {
  date: string;
  text: string;
  actionCode?: string;
  committee?: string;
}