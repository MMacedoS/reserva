import { useMutation } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export type AvailabilityRequest = {
  apartment_id: string;
  check_in: string;
  check_out: string;
};

export type AvailabilityResponse = {
  available: boolean;
  conflicts?: Array<{
    reservation_id: string;
    check_in: string;
    check_out: string;
  }>;
};

export function useCheckReservationAvailability() {
  const { fetchWithAuth } = useApi();

  return useMutation<AvailabilityResponse, Error, AvailabilityRequest>({
    mutationFn: async (payload: AvailabilityRequest) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/available`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.message || "Erro ao verificar disponibilidade"
        );
      }

      const json = await response.json();
      return json.data as AvailabilityResponse;
    },
  });
}
