import type { ActivityType, ClientStatus, ClientTier } from "@/types";

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

/** Contact record returned by the backend API. */
export interface ClientContactType {
  id: number;
  clientId: number;
  name: string;
  role: string;
  email: string;
  phone: string;
  isPrimary: boolean;
  createdAt: number;
  updatedAt: number;
}

/** Activity record embedded in client get response. */
export interface ApiActivity {
  id: number;
  clientId: number;
  type: ActivityType;
  summary: string;
  createdAt: number;
  updatedAt: number;
}

/** Client detail returned by `/client/get` (includes nested contacts & activities). */
export interface ApiClientDetail extends ApiClient {
  contacts: ClientContactType[];
  activities: ApiActivity[];
}

export interface ClientGetData {
  data: ApiClientDetail;
}

export type ClientGetResponse = ApiResponse<ClientGetData>;

export interface ClientGetParams {
  id: number;
}

export interface ClientUpdateStatusParams {
  id: number;
  status: ClientStatus;
}

export interface ActivityCreateParams {
  clientid: number;
  type: ActivityType;
  summary: string;
}

export interface ActivityListParams {
  clientid: number;
}

export interface ActivityListData {
  data: ApiActivity[];
}

export type ActivityListResponse = ApiResponse<ActivityListData>;

export type ActivityCreateResponse = ApiResponse<ApiActivity>;
