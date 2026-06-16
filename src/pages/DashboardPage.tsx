import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "@/lib/db";
import { formatINR, relativeTime } from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { customers } from "@/lib/routes";
import { PageHeader, StatusBadge, StageBadge } from "@/components/ui";

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs text-slate-400">{sub}</div>}
    </div>
  );
}

export default function DashboardPage() {
  const { data } = useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: getDashboard,
  });

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  const { clients, deals, devices, recentActivities } = data;
  const activeClients = clients.filter((c) => c.status === "active");
  const totalMrr = activeClients.reduce((s, c) => s + c.mrr, 0);
  const totalFleet = clients.reduce((s, c) => s + c.fleetSize, 0);
  const openDeals = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const weightedPipeline = openDeals.reduce(
    (s, d) => s + (d.value * d.probability) / 100,
    0,
  );
  const activeDevices = devices.filter((d) => d.status === "active").length;
  const faultyDevices = devices.filter((d) => d.status === "faulty").length;
  const topDeals = [...openDeals].sort((a, b) => b.value - a.value).slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your telematics client portfolio"
        action={
          <Link to={customers.clientsNew} className="btn-primary">
            + New Client
          </Link>
        }
      />

      <div className="space-y-6 p-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Active MRR"
            value={formatINR(totalMrr, true)}
            sub={`${activeClients.length} active clients`}
            accent="bg-emerald-500"
          />
          <StatCard
            label="Weighted Pipeline"
            value={formatINR(weightedPipeline, true)}
            sub={`${openDeals.length} open deals`}
            accent="bg-brand-500"
          />
          <StatCard
            label="Vehicles Tracked"
            value={totalFleet.toLocaleString("en-IN")}
            sub={`${devices.length} devices deployed`}
            accent="bg-violet-500"
          />
          <StatCard
            label="Device Health"
            value={`${activeDevices} online`}
            sub={
              faultyDevices > 0
                ? `${faultyDevices} faulty — needs attention`
                : "all healthy"
            }
            accent={faultyDevices > 0 ? "bg-rose-500" : "bg-emerald-500"}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Top Open Deals</h2>
              <Link
                to={customers.pipeline}
                className="text-sm font-medium text-brand-600 hover:underline"
              >
                View pipeline →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {topDeals.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-slate-400">
                  No open deals.
                </div>
              )}
              {topDeals.map((d) => (
                <Link
                  key={d.id}
                  to={customers.client(d.clientId)}
                  className="flex items-center justify-between px-5 py-3 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-800">
                      {d.title}
                    </div>
                    <div className="truncate text-xs text-slate-500">
                      {d.client.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pl-3">
                    <StageBadge stage={d.stage} />
                    <span className="w-24 text-right text-sm font-semibold text-slate-700">
                      {formatINR(d.value, true)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Recent Activity</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {recentActivities.length === 0 && (
                <li className="px-5 py-8 text-center text-sm text-slate-400">
                  No activity yet.
                </li>
              )}
              {recentActivities.map((a) => (
                <li key={a.id} className="px-5 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
                      {a.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      {relativeTime(a.createdAt)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">{a.summary}</p>
                  <Link
                    to={customers.client(a.clientId)}
                    className="text-xs text-slate-500 hover:underline"
                  >
                    {a.client.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Clients by Status</h2>
          </div>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-b-xl bg-slate-100 sm:grid-cols-3">
            {(["active", "lead", "churned"] as const).map((status) => {
              const list = clients.filter((c) => c.status === status);
              return (
                <div key={status} className="bg-white p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <StatusBadge status={status} />
                    <span className="text-sm font-semibold text-slate-700">
                      {list.length}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {list.slice(0, 4).map((c) => (
                      <li key={c.id}>
                        <Link
                          to={customers.client(c.id)}
                          className="block truncate text-sm text-slate-600 hover:text-brand-600"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                    {list.length === 0 && (
                      <li className="text-sm text-slate-400">None</li>
                    )}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
