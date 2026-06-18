import { Link, useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listDevices, setDeviceStatus } from "@/lib/db";
import { relativeTime } from "@/lib/format";
import { DEVICE_LABELS } from "@/constants/devices";
import { queryKeys } from "@/lib/query-keys";
import { customers } from "@/lib/routes";
import { PageHeader, DeviceTypeBadge } from "@/components/ui";
import type { DeviceStatus } from "@/types";

export default function DevicesPage() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status") ?? undefined;
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: queryKeys.devices(status),
    queryFn: () => listDevices(status),
  });

  const devices = data?.devices ?? [];
  const counts = data?.counts ?? {
    total: 0,
    active: 0,
    inactive: 0,
    faulty: 0,
  };

  const filters = [
    { key: "", label: "All", count: counts.total },
    { key: "active", label: "Active", count: counts.active },
    { key: "inactive", label: "Inactive", count: counts.inactive },
    { key: "faulty", label: "Faulty", count: counts.faulty },
  ];

  const handleStatusUpdate = (
    id: string,
    clientId: string,
    newStatus: DeviceStatus,
  ) => {
    setDeviceStatus(id, newStatus);
    void queryClient.invalidateQueries({ queryKey: ["devices"] });
    void queryClient.invalidateQueries({ queryKey: queryKeys.client(clientId) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  };

  return (
    <div>
      <PageHeader
        title="Devices"
        subtitle={`${counts.total} telematics devices across all clients`}
      />

      <div className="p-8">
        <div className="mb-4 flex gap-1.5">
          {filters.map((f) => {
            const active = (status ?? "") === f.key;
            const href = f.key
              ? `${customers.devices}?status=${f.key}`
              : customers.devices;
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
                <span
                  className={`ml-1.5 ${active ? "text-brand-100" : "text-slate-400"}`}
                >
                  {f.count}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Serial</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Vehicle</th>
                <th className="px-5 py-3 font-medium">Last ping</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No devices found.
                  </td>
                </tr>
              )}
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3 font-mono text-xs text-slate-700">
                    {d.serial}
                  </td>
                  <td className="px-5 py-3">
                    <DeviceTypeBadge type={d.type} />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      to={customers.client(d.clientId)}
                      className="text-slate-700 hover:text-brand-600"
                    >
                      {d.client.name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-slate-600">
                    {d.vehicleReg ?? "—"}
                  </td>
                  <td className="px-5 py-3 text-xs text-slate-400">
                    {relativeTime(d.lastPing)}
                  </td>
                  <td className="px-5 py-3">
                    <form
                      className="flex items-center gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const form = e.currentTarget;
                        const newStatus = (
                          form.elements.namedItem("status") as HTMLSelectElement
                        ).value as DeviceStatus;
                        handleStatusUpdate(d.id, d.clientId, newStatus);
                      }}
                    >
                      <input type="hidden" name="id" value={d.id} />
                      <input
                        type="hidden"
                        name="clientId"
                        value={d.clientId}
                      />
                      <select
                        name="status"
                        defaultValue={d.status}
                        className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600 outline-none focus:border-brand-400"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="faulty">Faulty</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                      >
                        Save
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          {Object.keys(DEVICE_LABELS).length} device types supported ·{" "}
          {counts.faulty} faulty device
          {counts.faulty === 1 ? "" : "s"} need attention.
        </p>
      </div>
    </div>
  );
}
