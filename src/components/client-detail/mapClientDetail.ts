import type { ClientDetail } from "@/lib/db";
import type { ApiClientDetail } from "@/types/api";

export function mapClientDetail(api: ApiClientDetail): ClientDetail {
  return {
    id: String(api.id),
    name: api.name,
    industry: api.industry,
    status: api.status,
    tier: api.tier,
    city: api.city ?? null,
    state: api.state ?? null,
    fleetSize: Number(api.fleetSize ?? 0),
    mrr: Number(api.mrr ?? 0),
    website: api.website ?? null,
    notes: api.notes ?? null,
    createdAt: new Date(api.createdAt).toISOString(),
    contacts: [...api.contacts]
      .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
      .map((c) => ({
        id: String(c.id),
        clientId: String(c.clientId),
        name: c.name,
        role: c.role ?? null,
        email: c.email ?? null,
        phone: c.phone ?? null,
        isPrimary: c.isPrimary,
        createdAt: new Date(c.createdAt).toISOString(),
      })),
    deals: [],
    devices: [],
    activities: api.activities.map((a) => ({
      id: String(a.id),
      clientId: String(a.clientId),
      type: a.type,
      summary: a.summary,
      createdAt: new Date(a.createdAt).toISOString(),
    })),
  };
}
