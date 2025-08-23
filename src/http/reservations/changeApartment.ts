import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

export type ChangeApartmentPayload = {
  reservation_id: string;
  new_apartment_id: string;
};

export function useChangeReservationApartment() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<{ status: number }, Error, ChangeApartmentPayload>({
    mutationFn: async ({ reservation_id, new_apartment_id }) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservation_id}/change-apartment`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ new_apartment_id }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.message || "Erro ao trocar apartamento");
      }

      const json = await response.json();
      return json;
    },
    onSuccess: () => {
      showAutoDismissAlert({ message: "Apartamento atualizado na reserva" });
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
    },
    onError: (error) => {
      showAutoDismissAlert({ message: error.message });
    },
  });
}
