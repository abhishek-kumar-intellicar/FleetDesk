import { Link, useParams } from "react-router-dom";
import { PageHeader, Loader } from "@/components/ui";
import { customers } from "@/lib/routes";
import { useClientDetail } from "@/hooks/useClientDetail";
import { ClientSummaryCards } from "@/components/client-detail/ClientSummaryCards";
import { ClientNotesSection } from "@/components/client-detail/ClientNotesSection";
import { ClientCompanyDetails } from "@/components/client-detail/ClientCompanyDetails";
import { ClientDealsSection } from "@/components/client-detail/ClientDealsSection";
import { ClientDevicesSection } from "@/components/client-detail/ClientDevicesSection";
import { ClientContactsSection } from "@/components/client-detail/ClientContactsSection";
import { ClientActivitySection } from "@/components/client-detail/ClientActivitySection";
import { ClientDangerZone } from "@/components/client-detail/ClientDangerZone";
import { DeleteClientDialog } from "@/components/client-detail/DeleteClientDialog";
import { ClientStatusActions } from "@/components/client-detail/ClientStatusActions";
import { ClientDetailLoadingOverlay } from "@/components/client-detail/ClientDetailLoadingOverlay";

export default function ClientDetailPage() {
  const { id = "1" } = useParams();
  const {
    client,
    apiClient,
    activities,
    clientLoading,
    activityListLoading,
    updateClientStatusLoading,
    deleteLoading,
    isPageBusy,
    statusValue,
    setStatusValue,
    showDeleteConfirm,
    setShowDeleteConfirm,
    fetchClient,
    getActivityList,
    handleStatusUpdate,
    handleDeleteConfirm,
  } = useClientDetail(id);

  if (clientLoading && !client) {
    return <Loader label="Loading client…" />;
  }

  if (!client) {
    return (
      <div className="p-8 text-center text-sm text-slate-500">
        Client not found.
        <Link
          to={customers.clients}
          className="mt-2 block text-brand-600 hover:underline"
        >
          ← Back to all clients
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={client.name}
        subtitle={`${client.industry}${client.city ? ` · ${client.city}, ${client.state ?? ""}` : ""}`}
        action={
          <ClientStatusActions
            client={client}
            statusValue={statusValue}
            disabled={isPageBusy}
            updating={updateClientStatusLoading}
            onStatusChange={setStatusValue}
            onUpdate={handleStatusUpdate}
          />
        }
      />

      <div className="relative">
        <ClientDetailLoadingOverlay
          visible={isPageBusy}
          updatingStatus={updateClientStatusLoading}
        />

        <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <ClientSummaryCards client={client} />
            {client.notes && <ClientNotesSection notes={client.notes} />}
            <ClientCompanyDetails client={client} apiClient={apiClient} />
            <ClientDealsSection client={client} />
            <ClientDevicesSection client={client} />
          </div>

          <div className="space-y-6">
            <ClientContactsSection
              client={client}
              disabled={isPageBusy}
              onContactAdded={() => fetchClient({ id: +id })}
            />
            <ClientActivitySection
              clientId={client.id}
              activities={activities}
              loading={activityListLoading}
              disabled={isPageBusy}
              onActivityAdded={() => getActivityList({ clientid: +id })}
            />
            <ClientDangerZone
              onDeleteClick={() => setShowDeleteConfirm(true)}
            />
            <Link
              to={customers.clients}
              className="block text-center text-sm text-slate-500 hover:underline"
            >
              ← Back to all clients
            </Link>
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteClientDialog
          clientName={client.name}
          loading={deleteLoading}
          onCancel={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
