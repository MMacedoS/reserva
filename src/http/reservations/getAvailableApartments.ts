import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export type AvailableApartmentsParams = {
  check_in?: string;
  check_out?: string;
};

export function useAvailableApartments({
  check_in,
  check_out,
}: AvailableApartmentsParams) {
  const { fetchWithAuth } = useApi();

  return useQuery<any[]>({
    queryKey: ["reservations", "available", check_in, check_out],
    enabled: !!check_in && !!check_out,
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/reservations/available`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ check_in, check_out }),
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(
          body?.message || "Erro ao buscar apartamentos disponíveis"
        );
      }

      const json = await response.json();
      return (
        json?.data?.apartments ||
        json?.data?.available_apartments ||
        json?.data?.items ||
        json?.data ||
        []
      );
    },
  });
}
