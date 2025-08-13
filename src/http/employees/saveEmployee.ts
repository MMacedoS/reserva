import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { EmployeeRequest } from "../types/employees/Employee";

export function useSaveEmployee() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: EmployeeRequest & { id?: string }) => {
      const isEdit = !!data.id;
      const url = isEdit
        ? `${environment.apiUrl}/${environment.apiVersion}/employees/${data.id}`
        : `${environment.apiUrl}/${environment.apiVersion}/employees`;

      const method = isEdit ? "PUT" : "POST";

      const response = await fetchWithAuth(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Erro ao salvar funcionário: ${errorBody || response.statusText}`
        );
      }

      const result = await response.json();
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showAutoDismissAlert({
        message: "Funcionário salvo com sucesso!",
        description: "Os dados foram salvos.",
        duration: 2000,
      });
    },
    onError: (error) => {
      showAutoDismissAlert({
        message: "Erro ao salvar funcionário",
        description: error.message,
        duration: 3000,
      });
    },
  });
}
