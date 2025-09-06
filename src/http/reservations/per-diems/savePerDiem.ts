import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type ReservationPerDiem = {
  dt_daily: string;
  amount: number;
  notes?: string;
};

export function useSaveReservationPerDiem(reservationUuid?: string) {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number; data: any }, Error, ReservationPerDiem>({
    mutationKey: ["reservations", reservationUuid, "per-diems", "save"],
    mutationFn: async (payload) => {
      if (!reservationUuid) {
        throw new Error("ID da reserva é obrigatório");
      }
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationUuid}/per-diems`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Erro ao salvar diária");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["per-diems", reservationUuid],
      });
      showAutoDismissAlert({ message: "Diária adicionada!" });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
