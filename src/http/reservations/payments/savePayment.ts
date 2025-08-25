import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ReservationPayment = {
  amount: number;
  method: string;
  reference?: string;
  notes?: string;
};

export function useSaveReservationPayment(reservationUuid: string) {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number; data: any }, Error, ReservationPayment>({
    mutationKey: ["reservations", reservationUuid, "payments", "save"],
    mutationFn: async (payload) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationUuid}/payments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Erro ao salvar pagamento");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["reservations", reservationUuid, "payments"],
      });
      showAutoDismissAlert({ message: "Pagamento registrado!" });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
