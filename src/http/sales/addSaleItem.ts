import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type AddSaleItemParams = {
  sale_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
};

export function useAddSaleItem() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddSaleItemParams) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/sales/${data.sale_id}/sale-items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: data.product_id,
            quantity: data.quantity,
            unit_price: data.unit_price,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar item à venda");
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
