import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export type ReservationsCountReportParams = {
  startDate: string;
  endDate: string;
  enabled?: boolean;
};

export type ReservationsCountReport = {
  total: number;
  by_day?: Array<{ date: string; count: number }>;
};

export function useReservationsCountReport({
  startDate,
  endDate,
  enabled = true,
}: ReservationsCountReportParams) {
  const { fetchWithAuth } = useApi();
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("start_date", startDate);
  if (endDate) queryParams.append("end_date", endDate);

  return useQuery<ReservationsCountReport>({
    queryKey: ["reservations-reports-count", startDate, endDate],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${
          environment.apiVersion
        }/reservations/reports/count?${queryParams.toString()}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de contagem de reservas");
      }
      const json = await response.json();
      return json.data as ReservationsCountReport;
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
