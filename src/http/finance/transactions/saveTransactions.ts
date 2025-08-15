import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Transaction } from "@/http/types/finance/transaction/Transaction";

export function saveTransactions() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Transaction & { id?: string }) => {
      console.log("Saving transaction data:", data);
      const isEdit = !!data.id;
      const url = isEdit
        ? `${environment.apiUrl}/${environment.apiVersion}/cashbox/${data.cashbox_id}/transactions/${data.id}`
        : `${environment.apiUrl}/${environment.apiVersion}/cashbox/${data.cashbox_id}/transactions`;

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
          `Erro ao salvar transação: ${errorBody || response.statusText}`
        );
      }

      const result = await response.json();
      return result.data || result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cashbox"] });
      queryClient.invalidateQueries({ queryKey: ["cashbox", "getById"] });
      queryClient.invalidateQueries({
        queryKey: ["cashbox-transactions", variables.cashbox_id],
      });

      showAutoDismissAlert({
        message: "Transação salva com sucesso!",
        description: `${
          variables.type === "entrada" ? "Entrada" : "Saída"
        } de R$ ${parseFloat(variables.amount.toString()).toFixed(
          2
        )} registrada.`,
        duration: 2000,
      });
    },
    onError: (error) => {
      console.error("Erro ao salvar transação:", error);
      showAutoDismissAlert({
        message: "Ops! Não foi possível salvar transação",
        description: "Não foi possível salvar as informações da transação.",
        duration: 3000,
      });
    },
  });
}
