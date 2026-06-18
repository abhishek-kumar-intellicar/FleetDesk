import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listDeals, setDealStage } from "@/lib/db";
import { formatINR, formatDate } from "@/lib/format";
import { STAGES, STAGE_LABELS } from "@/constants/deals";
import { queryKeys } from "@/lib/query-keys";
import { customers } from "@/lib/routes";
import { PageHeader } from "@/components/ui";
import type { DealStage } from "@/types";

const COLUMN_ACCENT: Record<string, string> = {
  prospect: "border-t-slate-400",
  qualified: "border-t-sky-400",
  proposal: "border-t-indigo-400",
  negotiation: "border-t-amber-400",
  won: "border-t-emerald-500",
  lost: "border-t-rose-400",
};

export default function PipelinePage() {
  const queryClient = useQueryClient();
  const { data: deals = [] } = useQuery({
    queryKey: queryKeys.deals,
    queryFn: listDeals,
  });

  const open = deals.filter((d) => d.stage !== "won" && d.stage !== "lost");
  const openValue = open.reduce((s, d) => s + d.value, 0);
  const weighted = open.reduce(
    (s, d) => s + (d.value * d.probability) / 100,
    0,
  );

  const handleStageUpdate = (id: string, stage: DealStage) => {
    setDealStage(id, stage);
    void queryClient.invalidateQueries({ queryKey: queryKeys.deals });
    void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard });
  };

  return (
    <div>
      <PageHeader
        title="Sales Pipeline"
        subtitle={`${formatINR(openValue, true)} open · ${formatINR(weighted, true)} weighted`}
      />

      <div className="overflow-x-auto p-8">
        <div className="flex min-w-max gap-4">
          {STAGES.map((stage) => {
            const column = deals.filter((d) => d.stage === stage);
            const total = column.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage} className="w-72 shrink-0">
                <div
                  className={`mb-3 rounded-lg border-t-4 bg-white px-3 py-2 shadow-sm ${COLUMN_ACCENT[stage]}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-800">
                      {STAGE_LABELS[stage]}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {column.length}
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-400">
                    {formatINR(total, true)}
                  </div>
                </div>

                <div className="space-y-3">
                  {column.map((d) => (
                    <div key={d.id} className="card p-3">
                      <Link
                        to={customers.client(d.clientId)}
                        className="block text-sm font-medium text-slate-800 hover:text-brand-600"
                      >
                        {d.title}
                      </Link>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {d.client.name}
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">
                          {formatINR(d.value, true)}
                        </span>
                        <span className="text-xs text-slate-400">
                          {d.probability}%
                        </span>
                      </div>
                      {d.expectedClose && (
                        <div className="mt-1 text-xs text-slate-400">
                          Close {formatDate(d.expectedClose)}
                        </div>
                      )}
                      <form
                        className="mt-2"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const stageValue = (
                            form.elements.namedItem("stage") as HTMLSelectElement
                          ).value as DealStage;
                          handleStageUpdate(d.id, stageValue);
                        }}
                      >
                        <input type="hidden" name="id" value={d.id} />
                        <select
                          name="stage"
                          defaultValue={d.stage}
                          className="w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 outline-none focus:border-brand-400"
                        >
                          {STAGES.map((s) => (
                            <option key={s} value={s}>
                              Move to: {STAGE_LABELS[s]}
                            </option>
                          ))}
                        </select>
                        <button
                          type="submit"
                          className="mt-1 w-full rounded-md bg-brand-50 py-1 text-xs font-medium text-brand-700 hover:bg-brand-100"
                        >
                          Update stage
                        </button>
                      </form>
                    </div>
                  ))}
                  {column.length === 0 && (
                    <div className="rounded-lg border border-dashed border-slate-200 py-6 text-center text-xs text-slate-400">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
