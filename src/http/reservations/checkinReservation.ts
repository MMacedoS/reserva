import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Realiza o check-in de uma reserva específica.
 * Segue o padrão de endpoints com ação (ex.: cashbox/{id}/close).
 */
export function useCheckinReservation() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number; data: any }, Error, number | string>({
    mutationKey: ["reservations", "checkin"],
    mutationFn: async (reservationId: number | string) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationId}/checkin`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Erro ao realizar check-in");
      }

      return response.json();
    },
    onSuccess: () => {
      // Recarrega listas relacionadas
      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });

      showAutoDismissAlert({
        message: "Check-in realizado com sucesso!",
        duration: 2000,
      });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message, duration: 3000 });
    },
  });
}
