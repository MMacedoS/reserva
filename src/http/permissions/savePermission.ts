import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { PermissionRequest } from "../types/permissions/Permission";

export function useSavePermission() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: PermissionRequest & { id?: string }) => {
      const isEdit = !!data.id;
      const url = isEdit
        ? `${environment.apiUrl}/${environment.apiVersion}/permissions/${data.id}`
        : `${environment.apiUrl}/${environment.apiVersion}/permissions`;

      const method = isEdit ? "PUT" : "POST";

      const { id, ...payload } = data;

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Erro ao salvar permissão: ${errorBody || response.statusText}`
        );
      }

      const result = await response.json();
      return result.data || result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
      queryClient.invalidateQueries({ queryKey: ["permissions-paginated"] });
      showAutoDismissAlert({
        message: "Permissão salva com sucesso!",
        description: "Os dados foram salvos.",
        duration: 2000,
      });
    },
    onError: () => {
      showAutoDismissAlert({
        message: "Ops! Não foi possível salvar permissão",
        description: "Não foi possível salvar as informações da permissão.",
        duration: 3000,
      });
    },
  });
}
