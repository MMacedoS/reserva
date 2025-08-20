import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { SaleRequest } from "@/http/types/sales/Sale";

export function useSaveSale() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SaleRequest) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/sales`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao criar venda");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
