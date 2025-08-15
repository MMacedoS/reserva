import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import type { Cashbox } from "../types/cashbox/Cashbox";

type ApiResponse = { status: number; data: Cashbox };

export function getCashboxByUserId() {
  const { fetchWithAuth } = useApi();
  const { updateCashbox } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, Cashbox>({
    mutationKey: ["cashbox", "getById"],
    mutationFn: async () => {
      const cashboxId = localStorage.getItem("cashboxId");

      if (!cashboxId) {
        throw new Error("Caixa não encontrado");
      }

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/cashbox/${cashboxId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro ao salvar: ${errorBody || response.statusText}`);
      }

      const result = await response.json();
      return result;
    },
    onSuccess: ({ data }) => {
      updateCashbox(data);

      // Invalida as queries relacionadas ao cashbox para força refetch quando necessário
      queryClient.invalidateQueries({ queryKey: ["cashbox", "getById"] });
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });

      showAutoDismissAlert({
        message: "Dados salvos com sucesso!",
        description: "Os dados foram atualizados.",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      showAutoDismissAlert({
        message: "Erro ao salvar dados",
        description: error.message || "Erro desconhecido",
        duration: 4000,
      });
    },
  });
}
