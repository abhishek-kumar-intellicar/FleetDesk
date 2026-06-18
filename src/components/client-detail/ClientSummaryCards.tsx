import type { ClientDetail } from "@/lib/db";
import { formatINR } from "@/lib/format";
import { StatusBadge, TierBadge } from "@/components/ui";

type ClientSummaryCardsProps = {
  client: ClientDetail;
};

export function ClientSummaryCards({ client }: ClientSummaryCardsProps) {
  return (
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
          {formatINR(client.mrr, true)}
        </div>
      </div>
      <div className="card p-4">
        <div className="text-xs text-slate-500">Fleet</div>
        <div className="mt-1 text-lg font-semibold text-slate-900">
          {client.fleetSize.toLocaleString("en-IN")}
        </div>
      </div>
    </div>
  );
}
