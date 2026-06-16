import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getClient,
  setClientStatus,
  addDeal,
  addDevice,
  addContact,
  addActivity,
  deleteClient,
} from "@/lib/db";
import {
  formatINR,
  formatDate,
  relativeTime,
  STAGES,
  STAGE_LABELS,
} from "@/lib/format";
import { queryKeys } from "@/lib/query-keys";
import { customers } from "@/lib/routes";
import {
  PageHeader,
  StatusBadge,
  TierBadge,
  StageBadge,
  DeviceStatusDot,
  DeviceTypeBadge,
} from "@/components/ui";
import type {
  ActivityType,
  ClientStatus,
  DealStage,
  DeviceType,
} from "@/lib/types";

export default function ClientDetailPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: client, isLoading } = useQuery({
    queryKey: queryKeys.client(id),
    queryFn: () => getClient(id),
    enabled: Boolean(id),
  });

  const invalidateClient = () => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.client(id) });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
    void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    void queryClient.invalidateQueries({ queryKey: ["devices"] });
    void queryClient.invalidateQueries({ queryKey: ["clients"] });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
        <div className="text-5xl font-bold text-slate-300">404</div>
        <p className="text-slate-600">Client not found.</p>
        <Link to={customers.clients} className="btn-primary mt-2">
          Back to clients
        </Link>
      </div>
    );
  }

  const openDeals = client.deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost",
  );
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
  const wonValue = client.deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + d.value, 0);

  return (
    <div>
      <PageHeader
        title={client.name}
        subtitle={`${client.industry}${client.city ? ` · ${client.city}, ${client.state ?? ""}` : ""}`}
        action={
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const status = (
                form.elements.namedItem("status") as HTMLSelectElement
              ).value as ClientStatus;
              setClientStatus(client.id, status);
              invalidateClient();
            }}
          >
            <input type="hidden" name="id" value={client.id} />
            <select
              name="status"
              defaultValue={client.status}
              className="input !w-auto py-1.5"
            >
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="churned">Churned</option>
            </select>
            <button type="submit" className="btn-ghost py-1.5">
              Update
            </button>
          </form>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="card p-4">
              <div className="text-xs text-slate-500">Status</div>
              <div className="mt-1.5">
                <StatusBadge status={client.status} />
              </div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-slate-500">Tier</div>
              <div className="mt-1.5">
                <TierBadge tier={client.tier} />
              </div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-slate-500">MRR</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {client.mrr > 0 ? formatINR(client.mrr, true) : "—"}
              </div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-slate-500">Fleet</div>
              <div className="mt-1 text-lg font-semibold text-slate-900">
                {client.fleetSize.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {client.notes && (
            <div className="card p-5">
              <h2 className="mb-2 text-sm font-semibold text-slate-900">
                Notes
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                {client.notes}
              </p>
            </div>
          )}

          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Deals{" "}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  · {formatINR(pipelineValue, true)} open
                  {wonValue > 0 ? ` · ${formatINR(wonValue, true)} won` : ""}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {client.deals.length === 0 && (
                <p className="px-5 py-6 text-sm text-slate-400">
                  No deals yet.
                </p>
              )}
              {client.deals.map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between px-5 py-3"
                >
                  <div>
                    <div className="text-sm font-medium text-slate-800">
                      {d.title}
                    </div>
                    <div className="text-xs text-slate-500">
                      {d.probability}% · close {formatDate(d.expectedClose)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StageBadge stage={d.stage} />
                    <span className="w-24 text-right text-sm font-semibold text-slate-700">
                      {formatINR(d.value, true)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <form
              className="grid grid-cols-1 gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:grid-cols-12"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (
                  form.elements.namedItem("title") as HTMLInputElement
                ).value.trim();
                if (!title) return;
                const value = parseFloat(
                  (form.elements.namedItem("value") as HTMLInputElement).value,
                );
                const stage = (
                  form.elements.namedItem("stage") as HTMLSelectElement
                ).value as DealStage;
                addDeal({
                  clientId: client.id,
                  title,
                  value: Number.isFinite(value) ? value : 0,
                  stage,
                  probability: 20,
                });
                form.reset();
                invalidateClient();
              }}
            >
              <input type="hidden" name="clientId" value={client.id} />
              <input
                name="title"
                required
                placeholder="Deal title"
                className="input sm:col-span-5"
              />
              <input
                name="value"
                type="number"
                min="0"
                step="any"
                placeholder="Value ₹"
                className="input sm:col-span-3"
              />
              <select
                name="stage"
                className="input sm:col-span-2"
                defaultValue="prospect"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {STAGE_LABELS[s]}
                  </option>
                ))}
              </select>
              <button type="submit" className="btn-primary sm:col-span-2">
                Add
              </button>
            </form>
          </div>

          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">
                Devices{" "}
                <span className="ml-1 text-sm font-normal text-slate-400">
                  · {client.devices.length} deployed
                </span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <tbody className="divide-y divide-slate-100">
                  {client.devices.length === 0 && (
                    <tr>
                      <td className="px-5 py-6 text-sm text-slate-400">
                        No devices deployed.
                      </td>
                    </tr>
                  )}
                  {client.devices.map((dev) => (
                    <tr key={dev.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 font-mono text-xs text-slate-700">
                        {dev.serial}
                      </td>
                      <td className="px-5 py-3">
                        <DeviceTypeBadge type={dev.type} />
                      </td>
                      <td className="px-5 py-3 text-slate-600">
                        {dev.vehicleReg ?? "—"}
                      </td>
                      <td className="px-5 py-3">
                        <DeviceStatusDot status={dev.status} />
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-slate-400">
                        {relativeTime(dev.lastPing)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <form
              className="grid grid-cols-1 gap-2 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:grid-cols-12"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const serial = (
                  form.elements.namedItem("serial") as HTMLInputElement
                ).value.trim();
                if (!serial) return;
                const type = (
                  form.elements.namedItem("type") as HTMLSelectElement
                ).value as DeviceType;
                const vehicleReg =
                  (
                    form.elements.namedItem("vehicleReg") as HTMLInputElement
                  ).value.trim() || null;
                addDevice({
                  clientId: client.id,
                  serial,
                  type,
                  status: "active",
                  vehicleReg,
                });
                form.reset();
                invalidateClient();
              }}
            >
              <input type="hidden" name="clientId" value={client.id} />
              <input
                name="serial"
                required
                placeholder="Serial no."
                className="input font-mono sm:col-span-4"
              />
              <select
                name="type"
                className="input sm:col-span-3"
                defaultValue="gps"
              >
                <option value="gps">GPS Tracker</option>
                <option value="obd">OBD-II</option>
                <option value="fuel">Fuel Sensor</option>
                <option value="dashcam">Dashcam</option>
                <option value="temperature">Temp Sensor</option>
              </select>
              <input
                name="vehicleReg"
                placeholder="Vehicle reg."
                className="input sm:col-span-3"
              />
              <button type="submit" className="btn-primary sm:col-span-2">
                Add
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Contacts</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {client.contacts.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-400">
                  No contacts yet.
                </li>
              )}
              {client.contacts.map((ct) => (
                <li key={ct.id} className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-800">
                      {ct.name}
                    </span>
                    {ct.isPrimary && (
                      <span className="rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
                        Primary
                      </span>
                    )}
                  </div>
                  {ct.role && (
                    <div className="text-xs text-slate-500">{ct.role}</div>
                  )}
                  {ct.email && (
                    <a
                      href={`mailto:${ct.email}`}
                      className="block text-xs text-brand-600 hover:underline"
                    >
                      {ct.email}
                    </a>
                  )}
                  {ct.phone && (
                    <div className="text-xs text-slate-500">{ct.phone}</div>
                  )}
                </li>
              ))}
            </ul>
            <form
              className="space-y-2 border-t border-slate-100 bg-slate-50 px-5 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const name = (
                  form.elements.namedItem("name") as HTMLInputElement
                ).value.trim();
                if (!name) return;
                addContact({
                  clientId: client.id,
                  name,
                  role:
                    (
                      form.elements.namedItem("role") as HTMLInputElement
                    ).value.trim() || null,
                  email:
                    (
                      form.elements.namedItem("email") as HTMLInputElement
                    ).value.trim() || null,
                  phone:
                    (
                      form.elements.namedItem("phone") as HTMLInputElement
                    ).value.trim() || null,
                });
                form.reset();
                invalidateClient();
              }}
            >
              <input type="hidden" name="clientId" value={client.id} />
              <input
                name="name"
                required
                placeholder="Name"
                className="input"
              />
              <div className="grid grid-cols-2 gap-2">
                <input name="role" placeholder="Role" className="input" />
                <input name="phone" placeholder="Phone" className="input" />
              </div>
              <input
                name="email"
                type="email"
                placeholder="Email"
                className="input"
              />
              <button type="submit" className="btn-primary w-full">
                Add contact
              </button>
            </form>
          </div>

          <div className="card">
            <div className="border-b border-slate-100 px-5 py-4">
              <h2 className="font-semibold text-slate-900">Activity</h2>
            </div>
            <form
              className="space-y-2 border-b border-slate-100 px-5 py-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const summary = (
                  form.elements.namedItem("summary") as HTMLInputElement
                ).value.trim();
                if (!summary) return;
                const type = (
                  form.elements.namedItem("type") as HTMLSelectElement
                ).value as ActivityType;
                addActivity({
                  clientId: client.id,
                  summary,
                  type,
                });
                form.reset();
                invalidateClient();
              }}
            >
              <input type="hidden" name="clientId" value={client.id} />
              <div className="flex gap-2">
                <select
                  name="type"
                  className="input !w-auto"
                  defaultValue="note"
                >
                  <option value="note">Note</option>
                  <option value="call">Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                </select>
                <input
                  name="summary"
                  required
                  placeholder="Log an interaction…"
                  className="input"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Log activity
              </button>
            </form>
            <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
              {client.activities.length === 0 && (
                <li className="px-5 py-6 text-sm text-slate-400">
                  No activity logged.
                </li>
              )}
              {client.activities.map((a) => (
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
                </li>
              ))}
            </ul>
          </div>

          <form
            className="card p-5"
            onSubmit={(e) => {
              e.preventDefault();
              deleteClient(client.id);
              void queryClient.invalidateQueries({
                queryKey: queryKeys.dashboard,
              });
              void queryClient.invalidateQueries({ queryKey: ["clients"] });
              navigate(customers.clients);
            }}
          >
            <input type="hidden" name="id" value={client.id} />
            <h2 className="text-sm font-semibold text-slate-900">
              Danger zone
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Permanently delete this client and all related records.
            </p>
            <button
              type="submit"
              className="btn mt-3 w-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
            >
              Delete client
            </button>
          </form>

          <Link
            to={customers.clients}
            className="block text-center text-sm text-slate-500 hover:underline"
          >
            ← Back to all clients
          </Link>
        </div>
      </div>
    </div>
  );
}
