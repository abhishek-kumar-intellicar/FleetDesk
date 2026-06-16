export const queryKeys = {
  dashboard: ["dashboard"] as const,
  clients: (params?: { q?: string; status?: string }) =>
    ["clients", params] as const,
  client: (id: string) => ["client", id] as const,
  deals: ["deals"] as const,
  devices: (status?: string) => ["devices", status] as const,
};
