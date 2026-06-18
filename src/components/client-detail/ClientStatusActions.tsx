import type { ClientDetail } from "@/lib/db";
import type { ClientStatus } from "@/types";

type ClientStatusActionsProps = {
  client: ClientDetail;
  statusValue: ClientStatus | null;
  disabled: boolean;
  updating: boolean;
  onStatusChange: (status: ClientStatus) => void;
  onUpdate: () => void;
};

export function ClientStatusActions({
  client,
  statusValue,
  disabled,
  updating,
  onStatusChange,
  onUpdate,
}: ClientStatusActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <select
        value={statusValue ?? client.status}
        onChange={(e) => onStatusChange(e.target.value as ClientStatus)}
        disabled={disabled}
        className="input !w-auto py-1.5 disabled:opacity-50"
      >
        <option value="lead">Lead</option>
        <option value="active">Active</option>
        <option value="churned">Churned</option>
      </select>
      <button
        type="button"
        className="btn-ghost py-1.5 disabled:pointer-events-none disabled:opacity-40"
        disabled={statusValue === client.status || disabled}
        onClick={onUpdate}
      >
        {updating ? "Updating…" : "Update"}
      </button>
    </div>
  );
}
