import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Apartment } from "../types/apartments/Apartment";

type ApiResponse = { status: number; data: Apartment };

export function deleteApartment() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, Apartment>({
    mutationFn: async (data: Apartment) => {
      const { uuid } = data;
      const url = `${environment.apiUrl}/${environment.apiVersion}/apartments/${uuid}`;

      const response = await fetchWithAuth(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.data.message || "Erro ao deletar.");
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["apartments"],
      });
      showAutoDismissAlert({
        message: "Dados deletados com sucesso!",
        description: "Os dados foram removidos.",
        duration: 2000,
      });
    },
    onError: (error) => {
      showAutoDismissAlert({
        message: "Erro ao deletar dados",
        description: error.name || "Erro desconhecido",
        duration: 4000,
      });
    },
  });
}
