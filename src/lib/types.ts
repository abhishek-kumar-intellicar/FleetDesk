export type ClientStatus = "lead" | "active" | "churned";
export type ClientTier = "standard" | "premium" | "enterprise";
export type DealStage =
  | "prospect"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "lost";
export type DeviceType = "gps" | "obd" | "fuel" | "dashcam" | "temperature";
export type DeviceStatus = "active" | "inactive" | "faulty";
export type ActivityType = "call" | "email" | "meeting" | "note";

export interface Client {
  id: string;
  name: string;
  industry: string;
  status: ClientStatus;
  tier: ClientTier;
  city: string | null;
  state: string | null;
  fleetSize: number;
  mrr: number;
  website: string | null;
  notes: string | null;
  createdAt: string;
}

export interface Contact {
  id: string;
  clientId: string;
  name: string;
  role: string | null;
  email: string | null;
  phone: string | null;
  isPrimary: boolean;
  createdAt: string;
}

export interface Deal {
  id: string;
  clientId: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedClose: string | null;
  createdAt: string;
}

export interface Device {
  id: string;
  clientId: string;
  serial: string;
  type: DeviceType;
  status: DeviceStatus;
  vehicleReg: string | null;
  lastPing: string | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  clientId: string;
  type: ActivityType;
  summary: string;
  createdAt: string;
}

export interface Database {
  clients: Client[];
  contacts: Contact[];
  deals: Deal[];
  devices: Device[];
  activities: Activity[];
}

export type WithClient<T> = T & { client: Client };
