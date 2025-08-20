import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function useCancelPayment() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/payments/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cancelar pagamento");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
