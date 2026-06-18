import type { ClientDetail } from "@/lib/db";
import { AddContactForm } from "@/components/client-detail/AddContactForm";

type ClientContactsSectionProps = {
  client: ClientDetail;
  disabled?: boolean;
  onContactAdded: () => void;
};

export function ClientContactsSection({
  client,
  disabled,
  onContactAdded,
}: ClientContactsSectionProps) {
  return (
    <div className="card">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">
          Contacts{" "}
          <span className="ml-1 text-sm font-normal text-slate-400">
            · {client.contacts.length}
          </span>
        </h2>
      </div>
      <ul className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
        {client.contacts.length === 0 && (
          <li className="px-5 py-6 text-sm text-slate-400">No contacts yet.</li>
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
      <AddContactForm
        clientId={client.id}
        disabled={disabled}
        onAdded={onContactAdded}
      />
    </div>
  );
}
