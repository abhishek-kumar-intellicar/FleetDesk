import type { ClientStatus, ClientTier } from "./types";

export type LeadSource =
  | "inbound"
  | "outbound"
  | "referral"
  | "partner"
  | "event"
  | "other";

/** Client record returned by the backend API. */
export interface ApiClient {
  id: number;
  name: string;
  legalName?: string;
  industry: string;
  status: ClientStatus;
  tier: ClientTier;
  city?: string;
  state?: string;
  pincode?: string;
  fleetSize: number;
  mrr: number;
  website?: string;
  gstin?: string;
  leadSource?: LeadSource;
  onboardedAt?: number;
  renewalAt?: number;
  assignedToId?: string;
  notes?: string;
  deviceCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface ClientListData {
  data: ApiClient[];
  total: number;
}

/** Standard API envelope: `{ err, data, msg }`. */
export interface ApiResponse<T> {
  err: unknown | null;
  data: T;
  msg: string;
}

export type ClientListResponse = ApiResponse<ClientListData>;

export interface ClientListParams {
  q?: string;
  status?: string;
}
