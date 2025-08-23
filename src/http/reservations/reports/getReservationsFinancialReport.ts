import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export type ReservationsFinancialReportParams = {
  startDate: string;
  endDate: string;
  enabled?: boolean;
};

export type ReservationsFinancialReport = {
  total_revenue: number;
  total_canceled: number;
  total_confirmed: number;
  average_ticket?: number;
  payment_methods?: Record<string, number>;
  daily?: Array<{ date: string; value: number }>;
};

export function useReservationsFinancialReport({
  startDate,
  endDate,
  enabled = true,
}: ReservationsFinancialReportParams) {
  const { fetchWithAuth } = useApi();
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("start_date", startDate);
  if (endDate) queryParams.append("end_date", endDate);

  return useQuery<ReservationsFinancialReport>({
    queryKey: ["reservations-reports-financial", startDate, endDate],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${
          environment.apiVersion
        }/reservations/reports/financial?${queryParams.toString()}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar relatório financeiro de reservas");
      }
      const json = await response.json();
      return json.data as ReservationsFinancialReport;
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
