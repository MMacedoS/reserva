import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Reservation } from "@/http/types/reservations/Reservation";

export function useGetReservationById(id?: string) {
  const { fetchWithAuth } = useApi();

  return useQuery<Reservation | null>({
    queryKey: ["reservation", id],
    queryFn: async () => {
      if (!id) return null;

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${id}`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar reserva");
      }

      const json = await response.json();
      return json.data as Reservation;
    },
    enabled: !!id,
  });
}
