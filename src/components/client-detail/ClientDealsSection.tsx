import { addDeal } from "@/lib/db";
import type { ClientDetail } from "@/lib/db";
import { STAGES, STAGE_LABELS } from "@/constants/deals";
import { formatDate, formatINR } from "@/lib/format";
import { StageBadge } from "@/components/ui";
import type { DealStage } from "@/types";

type ClientDealsSectionProps = {
  client: ClientDetail;
};

export function ClientDealsSection({ client }: ClientDealsSectionProps) {
  const openDeals = client.deals.filter(
    (d) => d.stage !== "won" && d.stage !== "lost",
  );
  const pipelineValue = openDeals.reduce((s, d) => s + d.value, 0);
  const wonValue = client.deals
    .filter((d) => d.stage === "won")
    .reduce((s, d) => s + d.value, 0);

  return (
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
          <p className="px-5 py-6 text-sm text-slate-400">No deals yet.</p>
        )}
        {client.deals.map((d) => (
          <div
            key={d.id}
            className="flex items-center justify-between px-5 py-3"
          >
            <div>
              <div className="text-sm font-medium text-slate-800">{d.title}</div>
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
          const stage = (form.elements.namedItem("stage") as HTMLSelectElement)
            .value as DealStage;
          addDeal({
            clientId: client.id,
            title,
            value: Number.isFinite(value) ? value : 0,
            stage,
            probability: 20,
          });
          form.reset();
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
  );
}
