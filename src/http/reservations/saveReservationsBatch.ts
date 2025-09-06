import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export interface ReservationsBatchRequest {
  customer_id: string;
  apartment_ids: string[];
  check_in: string;
  check_out: string;
  guests?: number;
  total_amount?: number;
  status?: string;
  type?: string;
  notes?: string;
}

export function useSaveReservationsBatch() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number }, Error, ReservationsBatchRequest>({
    mutationFn: async (payload: ReservationsBatchRequest) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations-group`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
          errorBody?.message || "Erro ao salvar reservas em lote"
        );
      }

      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      showAutoDismissAlert({ message: "Reservas criadas com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-checkout-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-checkin-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-guests"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-daily-revenue"] });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
