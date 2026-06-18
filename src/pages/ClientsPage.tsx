import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { formatINR } from "@/lib/format";
import { customers } from "@/lib/routes";
import { PageHeader, StatusBadge, TierBadge } from "@/components/ui";
import { usePostApi } from "@/hooks/usePostApi";
import type { ClientListParams, ClientListResponse } from "@/types/api";

export default function ClientsPage() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? undefined;
  const status = searchParams.get("status") ?? undefined;

  const {
    action: fetchClients,
    loading: isLoading,
    data: listResult,
  } = usePostApi<ClientListParams, ClientListResponse>({
    path: "client/list",
  });

  useEffect(() => {
    fetchClients({
      q: q?.trim() || undefined,
      status: status || undefined,
    });
  }, [q, status, fetchClients]);

  const clients = listResult?.data.data ?? [];
  const total = listResult?.data.total ?? 0;

  const filters = [
    { key: "", label: "All" },
    { key: "active", label: "Active" },
    { key: "lead", label: "Leads" },
    { key: "churned", label: "Churned" },
  ];

  return (
    <div>
      <PageHeader
        title="Clients"
        subtitle={`${total} ${total === 1 ? "account" : "accounts"}`}
        action={
          <Link to={customers.clientsNew} className="btn-primary">
            + New Client
          </Link>
        }
      />

      <div className="p-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-1.5">
            {filters.map((f) => {
              const active = (status ?? "") === f.key;
              const params = new URLSearchParams();
              if (f.key) params.set("status", f.key);
              if (q?.trim()) params.set("q", q.trim());
              const query = params.toString();
              const href = query
                ? `${customers.clients}?${query}`
                : customers.clients;

              return (
                <Link
                  key={f.key}
                  to={href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                    active
                      ? "bg-brand-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>

          <form
            className="w-full max-w-xs sm:w-auto"
            action={customers.clients}
            method="get"
          >
            {status && <input type="hidden" name="status" value={status} />}
            <input
              className="input"
              type="search"
              name="q"
              placeholder="Search name, industry, city…"
              defaultValue={q ?? ""}
            />
          </form>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Tier</th>
                <th className="px-5 py-3 text-right font-medium">Fleet</th>
                <th className="px-5 py-3 text-right font-medium">Devices</th>
                <th className="px-5 py-3 text-right font-medium">MRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    Loading clients…
                  </td>
                </tr>
              )}
              {!isLoading && clients.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No clients match your filters.
                  </td>
                </tr>
              )}
              {clients.map((c) => (
                <tr key={c.id} className="group hover:bg-slate-50">
                  <td className="px-5 py-3">
                    <Link
                      to={customers.client(String(c.id))}
                      className="block"
                    >
                      <div className="font-medium text-slate-800 group-hover:text-brand-600">
                        {c.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {c.industry}
                        {c.city ? ` · ${c.city}` : ""}
                      </div>
                    </Link>
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3">
                    <TierBadge tier={c.tier} />
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                    {c.fleetSize.toLocaleString("en-IN")}
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-slate-700">
                    {c.deviceCount != null
                      ? c.deviceCount.toLocaleString("en-IN")
                      : "—"}
                  </td>
                  <td className="px-5 py-3 text-right font-medium tabular-nums text-slate-800">
                    {formatINR(Number(c.mrr ?? 0), true)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
