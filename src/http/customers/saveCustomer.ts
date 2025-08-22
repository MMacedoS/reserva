import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { CustomerRequest } from "../types/Customer/Customer";

type ApiResponse = { status: number; data: CustomerRequest };

export function saveCustomer() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, CustomerRequest>({
    mutationFn: async (data: CustomerRequest) => {
      const isUpdate = !!data.id;
      const method = isUpdate ? "PUT" : "POST";

      const { id, ...payload } = data;
      const url = isUpdate
        ? `${environment.apiUrl}/${environment.apiVersion}/customers/${id}`
        : `${environment.apiUrl}/${environment.apiVersion}/customers`;

      if (!payload.name) {
        throw new Error("Nome é obrigatório");
      }

      if (!payload.phone) {
        throw new Error("Telefone é obrigatório");
      }

      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Erro ao salvar cliente");
      }
      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      showAutoDismissAlert({
        message: "Cliente cadastrado!",
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error) => {
      showAutoDismissAlert({
        message: error.message,
      });
    },
  });
}
