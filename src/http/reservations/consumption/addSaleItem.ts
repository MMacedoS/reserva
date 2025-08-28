import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type AddConsumptionsParams = {
  reservation_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  dt_consumption: string;
};

export function useAddConsumptions() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddConsumptionsParams) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${data.reservation_id}/consumptions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            product_id: data.product_id,
            quantity: data.quantity,
            amount: data.unit_price,
            dt_consumption: data.dt_consumption,
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao adicionar consumo");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reservations", variables.reservation_id, "consumption"],
      });
      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
    },
  });
}
