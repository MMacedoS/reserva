import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export type ReservationsStatusReportParams = {
  startDate: string;
  endDate: string;
  enabled?: boolean;
};

export type ReservationsStatusReport = Array<{
  status: string;
  count: number;
}>;

export function useReservationsStatusReport({
  startDate,
  endDate,
  enabled = true,
}: ReservationsStatusReportParams) {
  const { fetchWithAuth } = useApi();
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("start_date", startDate);
  if (endDate) queryParams.append("end_date", endDate);

  return useQuery<ReservationsStatusReport>({
    queryKey: ["reservations-reports-status", startDate, endDate],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${
          environment.apiVersion
        }/reservations/reports/status?${queryParams.toString()}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de status de reservas");
      }
      const json = await response.json();
      return json.data as ReservationsStatusReport;
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
