import { useNavigate } from "react-router-dom";
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
import { mapClientDetail } from "@/components/client-detail/mapClientDetail";
import { errorToast, successToast } from "@/lib/toast";
import { customers } from "@/lib/routes";
import { usePostApi } from "@/hooks/usePostApi";

export function useClientDetail(clientId: string) {
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
        fetchClient({ id: +clientId });
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
    fetchClient({ id: +clientId });
    getActivityList({ clientid: +clientId });
  }, [clientId]);

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

  return {
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
  };
}
