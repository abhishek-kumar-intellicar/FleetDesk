import type { ApiActivity } from "@/types/api";
import { relativeTime } from "@/lib/format";
import { Loader } from "@/components/ui";
import { AddActivityForm } from "@/components/client-detail/AddActivityForm";

type ClientActivitySectionProps = {
  clientId: string;
  activities: ApiActivity[];
  loading: boolean;
  disabled?: boolean;
  onActivityAdded: () => void;
};

export function ClientActivitySection({
  clientId,
  activities,
  loading,
  disabled,
  onActivityAdded,
}: ClientActivitySectionProps) {
  return (
    <div className="card">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">Activity</h2>
      </div>
      <AddActivityForm
        clientId={clientId}
        disabled={disabled}
        onAdded={onActivityAdded}
      />
      <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
        {loading && activities.length === 0 && (
          <li>
            <Loader label="Loading activities…" />
          </li>
        )}
        {!loading && activities.length === 0 && (
          <li className="px-5 py-6 text-sm text-slate-400">
            No activity logged.
          </li>
        )}
        {activities.map((a) => (
          <li key={a.id} className="px-5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {a.type}
              </span>
              <span className="text-xs text-slate-400">
                {relativeTime(new Date(a.createdAt))}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-700">{a.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
