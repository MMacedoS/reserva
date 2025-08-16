import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Transaction } from "@/http/types/finance/transaction/Transaction";
import { getCashboxByUserId } from "@/http/cashbox/getCashboxByUserId";

type ApiResponse = { status: number; data: Transaction };

export function deleteTransaction() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();
  const { mutate: refetchCashbox } = getCashboxByUserId();

  return useMutation<ApiResponse, Error, Transaction>({
    mutationFn: async ({ cashbox_id, id }) => {
      const url = `${environment.apiUrl}/${environment.apiVersion}/cashbox/${cashbox_id}/transactions/${id}`;

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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["cashbox-transactions", variables.cashbox_id],
      });

      refetchCashbox();

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
