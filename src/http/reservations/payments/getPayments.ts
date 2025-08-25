import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function useGetReservationPayments(
  reservationUuid?: string,
  enabled: boolean = true
) {
  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["reservations", reservationUuid, "payments"],
    enabled: !!reservationUuid && enabled,
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/${reservationUuid}/payments`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Erro ao buscar pagamentos");
      const json = await response.json();
      return json?.data?.items || json?.data || [];
    },
  });
}
