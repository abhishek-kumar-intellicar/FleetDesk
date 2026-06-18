import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiPost } from "../clients/axios";

interface UsePostApiOptions<TResponse = unknown> {
  path: string;
  onSuccess?: (data: TResponse) => void;
  onError?: (error: Error) => void;
}

interface UsePostApiReturn<TData = unknown, TResponse = unknown> {
  action: (data?: TData) => void;
  loading: boolean;
  data: TResponse | undefined;
  error: Error | null;
}

export function usePostApi<TData = unknown, TResponse = unknown>({
  path,
  onSuccess,
  onError,
}: UsePostApiOptions<TResponse>): UsePostApiReturn<TData, TResponse> {
  const mutation = useMutation<TResponse, Error, TData | undefined>({
    mutationFn: async (data?: TData) => apiPost<TResponse>(path, data),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      onError?.(error);
    },
  });

  const action = useCallback(
    (data?: TData) => mutation.mutate(data),
    [mutation.mutate],
  );

  return {
    action,
    loading: mutation.isPending,
    data: mutation.data as TResponse | undefined,
    error: mutation.error as Error | null,
  };
}
