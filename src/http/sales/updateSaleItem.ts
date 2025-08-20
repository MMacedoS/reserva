import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type UpdateSaleItemParams = {
  sale_id: string;
  item_id: string;
  quantity: number;
  unit_price?: number;
};

export function useUpdateSaleItem() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSaleItemParams) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/sales/${data.sale_id}/sale-items/${data.item_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantity: data.quantity,
            unit_price: data.unit_price,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao atualizar item da venda");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["sale-items", variables.sale_id],
      });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}
