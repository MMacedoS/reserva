import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export function useDeleteReservation() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number }, Error, string>({
    mutationFn: async (id: string) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${id}`,
        { method: "DELETE", credentials: "include" }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Erro ao excluir reserva");
      }

      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      showAutoDismissAlert({ message: "Reserva excluída!" });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
