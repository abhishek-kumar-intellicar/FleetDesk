import type { ClientDetail } from "@/lib/db";
import type { ApiClientDetail } from "@/types/api";
import { formatDate, formatINR } from "@/lib/format";

type ClientCompanyDetailsProps = {
  client: ClientDetail;
  apiClient: ApiClientDetail | undefined;
};

export function ClientCompanyDetails({
  client,
  apiClient,
}: ClientCompanyDetailsProps) {
  return (
    <div className="card p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-900">
        Company details
      </h2>
      <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
        {apiClient?.legalName && (
          <div>
            <dt className="text-xs text-slate-500">Legal name</dt>
            <dd className="font-medium text-slate-800">{apiClient.legalName}</dd>
          </div>
        )}
        {apiClient?.gstin && (
          <div>
            <dt className="text-xs text-slate-500">GSTIN</dt>
            <dd className="font-mono text-slate-800">{apiClient.gstin}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-slate-500">MRR</dt>
          <dd className="font-medium text-slate-800">
            {formatINR(Number(apiClient?.mrr ?? 0), true)}
          </dd>
        </div>
        {apiClient?.pincode && (
          <div>
            <dt className="text-xs text-slate-500">Pincode</dt>
            <dd className="text-slate-800">{apiClient.pincode}</dd>
          </div>
        )}
        {client.website && (
          <div>
            <dt className="text-xs text-slate-500">Website</dt>
            <dd>
              <a
                href={client.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-600 hover:underline"
              >
                {client.website}
              </a>
            </dd>
          </div>
        )}
        {apiClient?.onboardedAt && (
          <div>
            <dt className="text-xs text-slate-500">Onboarded</dt>
            <dd className="text-slate-800">
              {formatDate(new Date(apiClient.onboardedAt))}
            </dd>
          </div>
        )}
        {apiClient?.renewalAt && (
          <div>
            <dt className="text-xs text-slate-500">Renewal</dt>
            <dd className="text-slate-800">
              {formatDate(new Date(apiClient.renewalAt))}
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
