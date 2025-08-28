import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function useGetReservationConsumption(
  reservationUuid?: string,
  page?: number,
  limit?: number,
  enabled: boolean = true
) {
  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["reservations", reservationUuid, "consumption", { page, limit }],
    enabled: !!reservationUuid && enabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (page) queryParams.append("page", String(page));
      if (limit) queryParams.append("limit", String(limit));
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationUuid}/consumptions?${queryParams}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Erro ao buscar consumos");
      const json = await response.json();
      return json?.data || json?.data || [];
    },
  });
}
