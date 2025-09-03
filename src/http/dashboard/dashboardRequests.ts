import { useApi } from "@/hooks/useApi";
import { environment } from "@/environments/environment";
import { useQuery } from "@tanstack/react-query";

export function useDashboardCheckinToday(enabled = true) {
  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["dashboard-checkin-today"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/checkin-today`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erro ao buscar reservas de check-in hoje");
      return response.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardApartments(enabled = true) {
  const { fetchWithAuth } = useApi();
  return useQuery({
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
}

export function useDashboardCheckoutToday(enabled = true) {
  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["dashboard-checkout-today"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/checkout-today`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok)
        throw new Error("Erro ao buscar reservas de checkout hoje/atrasadas");
      return response.json();
    },
    enabled,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}

export function useDashboardGuests(enabled = true) {
  const { fetchWithAuth } = useApi();
  return useQuery({
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
  return useQuery({
    queryKey: ["dashboard-daily-revenue", start, end],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/dashboard/daily-revenue?start=${start}&end=${end}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) throw new Error("Erro ao buscar faturamento diário");
      return response.json();
    },
    enabled: enabled && !!start && !!end,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
