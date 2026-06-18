import { buildSeed } from "./seed";
import type {
  Activity,
  Client,
  Contact,
  Database,
  Deal,
  Device,
  WithClient,
} from "@/types";

const STORAGE_KEY = "fleetdesk-db";

function uuid(): string {
  return crypto.randomUUID();
}

function loadDb(): Database {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    return JSON.parse(raw) as Database;
  }
  const seeded = buildSeed();
  persist(seeded);
  return seeded;
}

function persist(db: Database): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function mutate<T>(fn: (db: Database) => T): T {
  const db = loadDb();
  const result = fn(db);
  persist(db);
  return result;
}

function attachClient<T extends { clientId: string }>(
  rows: T[],
  clients: Client[],
): WithClient<T>[] {
  const byId = new Map(clients.map((c) => [c.id, c]));
  return rows
    .filter((r) => byId.has(r.clientId))
    .map((r) => ({ ...r, client: byId.get(r.clientId)! }));
}

export interface ClientDetail extends Client {
  contacts: Contact[];
  deals: Deal[];
  devices: Device[];
  activities: Activity[];
}

export function getClient(id: string): ClientDetail | null {
  const db = loadDb();
  const client = db.clients.find((c) => c.id === id);
  if (!client) return null;
  return {
    ...client,
    contacts: db.contacts
      .filter((c) => c.clientId === id)
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary)),
    deals: db.deals
      .filter((d) => d.clientId === id)
      .sort((a, b) => b.value - a.value),
    devices: db.devices
      .filter((d) => d.clientId === id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    activities: db.activities
      .filter((a) => a.clientId === id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export function getDashboard() {
  const db = loadDb();
  const recentActivities = attachClient(
    [...db.activities]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 6),
    db.clients,
  );
  return {
    clients: db.clients,
    deals: attachClient(db.deals, db.clients),
    devices: db.devices,
    recentActivities,
  };
}

export function listDeals(): WithClient<Deal>[] {
  const db = loadDb();
  return attachClient(
    [...db.deals].sort((a, b) => b.value - a.value),
    db.clients,
  );
}

export function listDevices(status?: string): {
  devices: WithClient<Device>[];
  counts: { total: number; active: number; inactive: number; faulty: number };
} {
  const db = loadDb();
  const filtered = db.devices.filter((d) =>
    status ? d.status === status : true,
  );
  const devices = attachClient(filtered, db.clients).sort((a, b) =>
    (b.lastPing ?? "").localeCompare(a.lastPing ?? ""),
  );
  return {
    devices,
    counts: {
      total: db.devices.length,
      active: db.devices.filter((d) => d.status === "active").length,
      inactive: db.devices.filter((d) => d.status === "inactive").length,
      faulty: db.devices.filter((d) => d.status === "faulty").length,
    },
  };
}

export function deleteClient(id: string): void {
  mutate((db) => {
    db.clients = db.clients.filter((c) => c.id !== id);
    db.contacts = db.contacts.filter((c) => c.clientId !== id);
    db.deals = db.deals.filter((c) => c.clientId !== id);
    db.devices = db.devices.filter((c) => c.clientId !== id);
    db.activities = db.activities.filter((c) => c.clientId !== id);
  });
}

export function setClientStatus(
  id: string,
  status: Client["status"],
): void {
  mutate((db) => {
    const c = db.clients.find((x) => x.id === id);
    if (c) c.status = status;
  });
}

export function addContact(
  c: Omit<Contact, "id" | "createdAt" | "isPrimary">,
): void {
  mutate((db) => {
    db.contacts.push({
      ...c,
      id: uuid(),
      isPrimary: false,
      createdAt: new Date().toISOString(),
    });
  });
}

export function addActivity(
  a: Omit<Activity, "id" | "createdAt">,
): void {
  mutate((db) => {
    db.activities.push({
      ...a,
      id: uuid(),
      createdAt: new Date().toISOString(),
    });
  });
}

export function addDeal(
  d: Omit<Deal, "id" | "createdAt" | "expectedClose">,
): void {
  mutate((db) => {
    db.deals.push({
      ...d,
      id: uuid(),
      expectedClose: null,
      createdAt: new Date().toISOString(),
    });
  });
}

export function setDealStage(id: string, stage: Deal["stage"]): void {
  mutate((db) => {
    const d = db.deals.find((x) => x.id === id);
    if (!d) return;
    d.stage = stage;
    if (stage === "won") d.probability = 100;
    if (stage === "lost") d.probability = 0;
  });
}

export function addDevice(
  d: Omit<Device, "id" | "createdAt" | "lastPing">,
): void {
  mutate((db) => {
    db.devices.push({
      ...d,
      id: uuid(),
      lastPing: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  });
}

export function setDeviceStatus(
  id: string,
  status: Device["status"],
): void {
  mutate((db) => {
    const d = db.devices.find((x) => x.id === id);
    if (d) d.status = status;
  });
}
