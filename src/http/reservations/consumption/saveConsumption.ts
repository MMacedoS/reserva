import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ReservationConsumption = {
  product_id?: string;
  description?: string;
  quantity: number;
  unit_price: number;
};

export function useSaveReservationConsumption(reservationUuid: string) {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    { status: number; data: any },
    Error,
    ReservationConsumption
  >({
    mutationKey: ["reservations", reservationUuid, "consumption", "save"],
    mutationFn: async (payload) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationUuid}/consumption`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Erro ao salvar consumo");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations", reservationUuid, "consumption"],
      });
      showAutoDismissAlert({ message: "Consumo adicionado!" });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
