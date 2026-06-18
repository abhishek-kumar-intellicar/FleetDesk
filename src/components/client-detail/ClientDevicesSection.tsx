import { addDevice } from "@/lib/db";
import type { ClientDetail } from "@/lib/db";
import { relativeTime } from "@/lib/format";
import { DeviceStatusDot, DeviceTypeBadge } from "@/components/ui";
import type { DeviceType } from "@/types";

type ClientDevicesSectionProps = {
  client: ClientDetail;
};

export function ClientDevicesSection({ client }: ClientDevicesSectionProps) {
  return (
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
          const type = (form.elements.namedItem("type") as HTMLSelectElement)
            .value as DeviceType;
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
  );
}
