import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

type DeletePerDiemPayload = {
  id: string;
  reservationId?: string;
};

export function useDeletePerDiem() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number }, Error, DeletePerDiemPayload>({
    mutationFn: async ({ id, reservationId }) => {
      if (!reservationId) {
        throw new Error("ID da reserva é obrigatório");
      }
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationId}/per-diems/${id}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Erro ao excluir diaria");
      }

      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      showAutoDismissAlert({ message: "diaria excluída!" });
      queryClient.invalidateQueries({ queryKey: ["per-diems"] });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
