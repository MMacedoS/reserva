import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import type {
  ReservationRequest,
  Reservation,
} from "@/http/types/reservations/Reservation";

type ApiResponse = { status: number; data: Reservation };

export function useSaveReservation() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse, Error, ReservationRequest>({
    mutationFn: async (payload: ReservationRequest) => {
      const isUpdate = !!payload.id;
      const { id, ...body } = payload;
      const url = isUpdate
        ? `${environment.apiUrl}/${environment.apiVersion}/reservations/${id}`
        : `${environment.apiUrl}/${environment.apiVersion}/reservations`;

      const response = await fetchWithAuth(url, {
        method: isUpdate ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        showAutoDismissAlert({
          message: "Falha ao salvar",
          description: errorBody.data?.message || "Erro ao salvar reserva",
          duration: 5000,
        });
        throw new Error(errorBody.message || "Erro ao salvar reserva");
      }

      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-checkout-today"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-checkin-today"] });

      showAutoDismissAlert({
        message: "Reserva salva com sucesso!",
        description: "A lista de reservas foi atualizada.",
        duration: 3000,
      });
    },
  });
}
