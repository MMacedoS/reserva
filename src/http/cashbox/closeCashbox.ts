import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function closeCashbox() {
  const { updateCashbox, cashbox } = useAuth();
  const queryClient = useQueryClient();
  const { fetchWithAuth } = useApi();

  return useMutation({
    mutationKey: ["closeCashbox"],
    mutationFn: async (finalAmount?: number) => {
      if (!cashbox) {
        throw new Error("Nenhum caixa encontrado para fechar");
      }

      const body = finalAmount ? { final_amount: finalAmount } : undefined;

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/cashbox/${cashbox.id}/close`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: body ? JSON.stringify(body) : undefined,
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `Erro ao fechar caixa: ${errorBody.data || response.statusText}`
        );
      }

      const result = await response.json();
      return result.data;
    },
    onSuccess: (data) => {
      updateCashbox(null);

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
    onError: (error) => {
      showAutoDismissAlert({
        message: "Erro ao fechar caixa",
        description: error.message.toString(),
        duration: 3000,
      });
    },
  });
}
