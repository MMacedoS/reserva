import { useApi } from "@/hooks/useApi";
import { environment } from "@/environments/environment";
import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "../types/reservations/Reservation";

export function useDashboardCheckinToday(enabled = true) {
  const { fetchWithAuth } = useApi();
  const query = useQuery({
    queryKey: ["dashboard-checkin-today"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/checkin-today`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erro ao buscar reservas de check-in hoje");
      const result = await response.json();
      return (result.data as Reservation) || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return query;
}

export function useDashboardApartments(enabled = true) {
  const { fetchWithAuth } = useApi();
  const query = useQuery({
    queryKey: ["dashboard-apartments"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/apartments`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erro ao buscar dados dos apartamentos");
      return response.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return query;
}

export function useDashboardCheckoutToday(enabled = true) {
  const { fetchWithAuth } = useApi();
  const query = useQuery({
    queryKey: ["dashboard-checkout-today"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/checkout-today`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erro ao buscar reservas de checkout hoje/atrasadas");

      const result = await response.json();
      return (result.data as Reservation) || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return query;
}

export function useDashboardGuests(enabled = true) {
  const { fetchWithAuth } = useApi();
  const query = useQuery({
    queryKey: ["dashboard-guests"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/guests`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erro ao buscar quantidade de hóspedes");
      return response.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return query;
}

export function useDashboardDailyRevenue({
  start,
  end,
  enabled = true,
}: {
  start: string;
  end: string;
  enabled?: boolean;
}) {
  const { fetchWithAuth } = useApi();
  const query = useQuery({
    queryKey: ["dashboard-daily-revenue", start, end],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/daily-revenue?start=${start}&end=${end}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Erro ao buscar faturamento diário");
      const result = await response.json();
      return result.data ?? { revenue: null };
    },
    enabled: enabled && !!start && !!end,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
  return query;
}
