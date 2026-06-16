/** Customer module route paths */
export const customers = {
  dashboard: "/customers",
  clients: "/customers/clients",
  clientsNew: "/customers/clients/new",
  client: (id: string) => `/customers/clients/${id}`,
  pipeline: "/customers/pipeline",
  devices: "/customers/devices",
} as const;
