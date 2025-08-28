import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export function useRemoveConsumption() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      reservation_id,
      item_id,
    }: {
      reservation_id: string;
      item_id: string;
    }) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservation_id}/consumptions/${item_id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao remover item do consumo");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["reservations", variables.reservation_id, "consumption"],
      });
      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
      showAutoDismissAlert({ message: "Consumo removido!" });
    },
  });
}
