import type { Database } from "@/types";

function isoFromNow(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

// Builds the initial demo dataset. Timestamps are computed relative to "now"
// so the dashboard and "last ping" values always look fresh on first run.
export function buildSeed(): Database {
  const db: Database = { clients: [], contacts: [], deals: [], devices: [], activities: [] };

  const seed = [
    {
      id: "c_bluedart",
      name: "BlueDart Logistics",
      industry: "Courier & Logistics",
      status: "active",
      tier: "enterprise",
      city: "Mumbai",
      state: "Maharashtra",
      fleetSize: 1240,
      mrr: 868000,
      website: "https://bluedart.example.com",
      notes:
        "Largest fleet on the platform. Renewal due Q3. Interested in fuel analytics upsell.",
      contacts: [
        { name: "Rajesh Menon", role: "Head of Fleet Ops", email: "rajesh.menon@bluedart.example.com", phone: "+91 98200 11223", isPrimary: true },
        { name: "Sneha Kulkarni", role: "Procurement Lead", email: "sneha.k@bluedart.example.com", phone: "+91 98200 44556", isPrimary: false },
      ],
      deals: [
        { title: "Fuel Analytics add-on (1,200 vehicles)", value: 4200000, stage: "negotiation", probability: 70, expectedClose: isoFromNow(28) },
      ],
      devices: [
        { serial: "ICX-GPS-100231", type: "gps", status: "active", vehicleReg: "MH01AB1234", lastPing: isoFromNow(-0.01) },
        { serial: "ICX-FUEL-100232", type: "fuel", status: "active", vehicleReg: "MH01AB1234", lastPing: isoFromNow(-0.02) },
        { serial: "ICX-GPS-100240", type: "gps", status: "faulty", vehicleReg: "MH02XY7788", lastPing: isoFromNow(-4) },
      ],
      activities: [
        { type: "meeting", summary: "QBR with fleet ops team. Discussed uptime SLA and fuel theft incidents." },
        { type: "email", summary: "Sent renewal proposal with fuel analytics bundle." },
      ],
    },
    {
      id: "c_meru",
      name: "Meru Cabs",
      industry: "Ride Hailing",
      status: "active",
      tier: "premium",
      city: "Bengaluru",
      state: "Karnataka",
      fleetSize: 680,
      mrr: 408000,
      website: "https://meru.example.com",
      notes: "Wants driver-behaviour scoring integrated into their dispatch app via API.",
      contacts: [
        { name: "Anita Rao", role: "VP Operations", email: "anita.rao@meru.example.com", phone: "+91 99000 22110", isPrimary: true },
      ],
      deals: [
        { title: "Driver Behaviour API integration", value: 1800000, stage: "proposal", probability: 55, expectedClose: isoFromNow(45) },
      ],
      devices: [
        { serial: "ICX-GPS-200110", type: "gps", status: "active", vehicleReg: "KA05CD4567", lastPing: isoFromNow(-0.03) },
        { serial: "ICX-DASH-200115", type: "dashcam", status: "active", vehicleReg: "KA05CD4567", lastPing: isoFromNow(-0.05) },
      ],
      activities: [
        { type: "call", summary: "Discovery call on API requirements and rate limits." },
      ],
    },
    {
      id: "c_delhivery",
      name: "Delhivery Surface",
      industry: "Supply Chain",
      status: "active",
      tier: "enterprise",
      city: "Gurugram",
      state: "Haryana",
      fleetSize: 2100,
      mrr: 1470000,
      website: "https://delhivery.example.com",
      notes: "Multi-region rollout. Strict on data residency. Key strategic account.",
      contacts: [
        { name: "Vikram Singh", role: "Director, Linehaul", email: "vikram.singh@delhivery.example.com", phone: "+91 98110 33445", isPrimary: true },
        { name: "Pooja Sharma", role: "IT Integration Manager", email: "pooja.s@delhivery.example.com", phone: null, isPrimary: false },
      ],
      deals: [
        { title: "Temperature monitoring for cold-chain (300 units)", value: 3600000, stage: "qualified", probability: 40, expectedClose: isoFromNow(70) },
      ],
      devices: [
        { serial: "ICX-GPS-300001", type: "gps", status: "active", vehicleReg: "HR26GH9090", lastPing: isoFromNow(-0.01) },
        { serial: "ICX-TEMP-300002", type: "temperature", status: "active", vehicleReg: "HR26GH9090", lastPing: isoFromNow(-0.04) },
        { serial: "ICX-OBD-300010", type: "obd", status: "inactive", vehicleReg: "HR55KL1212", lastPing: isoFromNow(-12) },
      ],
      activities: [
        { type: "meeting", summary: "Solutioning workshop for cold-chain pilot." },
      ],
    },
    {
      id: "c_shree",
      name: "Shree Cement Transport",
      industry: "Manufacturing",
      status: "lead",
      tier: "standard",
      city: "Jaipur",
      state: "Rajasthan",
      fleetSize: 320,
      mrr: 0,
      website: null,
      notes: "Inbound from website. Evaluating us vs incumbent. Price sensitive.",
      contacts: [
        { name: "Mohan Lal", role: "Logistics Manager", email: "mohan.lal@shreecement.example.com", phone: "+91 94140 55667", isPrimary: true },
      ],
      deals: [
        { title: "Base GPS tracking (320 trucks)", value: 1920000, stage: "prospect", probability: 20, expectedClose: isoFromNow(90) },
      ],
      devices: [],
      activities: [
        { type: "call", summary: "Intro call. Demo scheduled for next week." },
      ],
    },
    {
      id: "c_ola",
      name: "Ola Electric Fleet",
      industry: "EV Mobility",
      status: "active",
      tier: "premium",
      city: "Bengaluru",
      state: "Karnataka",
      fleetSize: 540,
      mrr: 432000,
      website: "https://ola.example.com",
      notes: "EV-specific telemetry: battery SoC, charging cycles. Innovation partner.",
      contacts: [
        { name: "Kiran Desai", role: "Head of Charging Infra", email: "kiran.desai@ola.example.com", phone: "+91 97400 66778", isPrimary: true },
      ],
      deals: [
        { title: "EV battery telemetry expansion", value: 2400000, stage: "won", probability: 100, expectedClose: isoFromNow(-10) },
      ],
      devices: [
        { serial: "ICX-OBD-400201", type: "obd", status: "active", vehicleReg: "KA01EV0011", lastPing: isoFromNow(-0.02) },
      ],
      activities: [
        { type: "note", summary: "Closed-won. Onboarding kickoff scheduled." },
      ],
    },
    {
      id: "c_rivigo",
      name: "Rivigo Freight",
      industry: "Trucking",
      status: "churned",
      tier: "standard",
      city: "Gurugram",
      state: "Haryana",
      fleetSize: 0,
      mrr: 0,
      website: null,
      notes: "Churned last quarter due to budget cuts. Re-engage in 6 months.",
      contacts: [
        { name: "Sameer Gupta", role: "Ex-Fleet Head", email: "sameer.g@rivigo.example.com", phone: null, isPrimary: true },
      ],
      deals: [
        { title: "Win-back: full fleet re-onboarding", value: 2800000, stage: "lost", probability: 0, expectedClose: isoFromNow(-30) },
      ],
      devices: [],
      activities: [
        { type: "email", summary: "Sent win-back offer. No response yet." },
      ],
    },
  ] as const;

  let n = 0;
  const uid = (p: string) => `${p}_${(++n).toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const created = new Date().toISOString();

  for (const c of seed) {
    const { contacts, deals, devices, activities, ...client } = c;
    db.clients.push({ ...client, createdAt: created } as Database["clients"][number]);
    contacts.forEach((ct) =>
      db.contacts.push({ id: uid("ct"), clientId: c.id, createdAt: created, ...ct } as Database["contacts"][number]),
    );
    deals.forEach((d) =>
      db.deals.push({ id: uid("d"), clientId: c.id, createdAt: created, ...d } as Database["deals"][number]),
    );
    devices.forEach((dev) =>
      db.devices.push({ id: uid("dev"), clientId: c.id, createdAt: created, ...dev } as Database["devices"][number]),
    );
    activities.forEach((a, i) =>
      db.activities.push({
        id: uid("a"),
        clientId: c.id,
        createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
        ...a,
      } as Database["activities"][number]),
    );
  }

  return db;
}
