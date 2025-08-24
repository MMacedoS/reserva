import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Realiza o check-out de uma reserva específica.
 */
export function useCheckoutReservation() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number; data: any }, Error, number | string>({
    mutationKey: ["reservations", "checkout"],
    mutationFn: async (reservationId: number | string) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationId}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Erro ao realizar check-out");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });

      showAutoDismissAlert({
        message: "Check-out realizado com sucesso!",
        duration: 2000,
      });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message, duration: 3000 });
    },
  });
}
