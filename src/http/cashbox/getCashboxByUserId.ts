import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import type { Cashbox } from "../types/cashbox/Cashbox";

type ApiResponse = { status: number; data: Cashbox };

export function getCashboxByUserId() {
  const { fetchWithAuth } = useApi();
  const { updateCashbox, cashbox } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error>({
    mutationKey: ["cashboxId"],
    mutationFn: async () => {
      const cashboxId = cashbox?.id;

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
        const errorBody = await response.json();
        throw new Error(
          `Erro ao salvar: ${errorBody.data.message || response.statusText}`
        );
      }

      const result = await response.json();
      return {
        status: response.status,
        data: result.data.cashbox,
      };
    },
    onSuccess: ({ data }) => {
      updateCashbox(data);

      queryClient.invalidateQueries({ queryKey: ["cashboxId"] });
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });

      queryClient.setQueryData(["cashboxId"], { data });
      queryClient.setQueryData(["cashbox"], data);

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
