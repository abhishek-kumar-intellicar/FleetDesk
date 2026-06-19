import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { ClientDetail } from "@/lib/db";
import type {
  ApiResponse,
  ActivityListParams,
  ActivityListResponse,
  ClientGetParams,
  ClientGetResponse,
  ClientUpdateStatusParams,
} from "@/types/api";
import type { ClientStatus } from "@/types";
import { PageHeader, Loader } from "@/components/ui";
import { customers } from "@/lib/routes";
import { mapClientDetail } from "@/components/client-detail/mapClientDetail";
import { errorToast, successToast } from "@/lib/toast";
import { usePostApi } from "@/hooks/usePostApi";
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
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusValue, setStatusValue] = useState<ClientStatus | null>(null);

  const {
    action: fetchClient,
    loading: clientLoading,
    data: clientData,
  } = usePostApi<ClientGetParams, ClientGetResponse>({
    path: "/client/get",
  });

  const apiClient = clientData?.data?.data;
  const client = useMemo<ClientDetail | null>(
    () => (apiClient ? mapClientDetail(apiClient) : null),
    [apiClient],
  );

  useEffect(() => {
    if (client) {
      setStatusValue(client.status);
    }
  }, [client?.id, client?.status]);

  const { action: deleteClient, loading: deleteLoading } = usePostApi<
    { id: number },
    ApiResponse<unknown>
  >({
    path: "client/delete",
    onSuccess: () => {
      setShowDeleteConfirm(false);
      successToast("Client deleted successfully");
      navigate(customers.clients);
    },
    onError: (error) => {
      errorToast(error.message);
    },
  });

  const { action: updateClientStatus, loading: updateClientStatusLoading } =
    usePostApi<ClientUpdateStatusParams, ApiResponse<unknown>>({
      path: "client/updatestatus",
      onSuccess: () => {
        successToast("Client status updated successfully");
        fetchClient({ id: +id });
      },
      onError: (error) => {
        errorToast(error.message);
      },
    });

  const {
    action: getActivityList,
    loading: activityListLoading,
    data: activityListResult,
  } = usePostApi<ActivityListParams, ActivityListResponse>({
    path: "/activity/list",
    onError: (error) => {
      errorToast(error.message || "Failed to load activities");
    },
  });

  const activities = useMemo(
    () =>
      [...(activityListResult?.data?.data ?? [])].sort(
        (a, b) => b.createdAt - a.createdAt,
      ),
    [activityListResult],
  );

  useEffect(() => {
    fetchClient({ id: +id });
    getActivityList({ clientid: +id });
  }, [id]);

  const isPageBusy =
    clientLoading || updateClientStatusLoading || activityListLoading;

  function handleStatusUpdate() {
    if (!client || !statusValue || statusValue === client.status) return;
    updateClientStatus({ id: +client.id, status: statusValue });
  }

  function handleDeleteConfirm() {
    if (!client) return;
    deleteClient({ id: +client.id });
  }

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
