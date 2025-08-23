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
        throw new Error(errorBody.message || "Erro ao salvar reserva");
      }

      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      showAutoDismissAlert({ message: "Reserva salva com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
