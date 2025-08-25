import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function useGetReservationPerDiems(
  reservationUuid?: string,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true
) {
  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["per-diems", reservationUuid, page, limit],
    enabled: !!reservationUuid && enabled,
    queryFn: async () => {
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationUuid}/per-diems?${queryParams}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Erro ao buscar diárias");
      const json = await response.json();
      return {
        data: json.data.per_diems || json.data.items || [],
        pagination: json.data.pagination,
      };
    },
  });
}
