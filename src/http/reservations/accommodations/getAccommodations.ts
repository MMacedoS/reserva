import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function useAccommodations() {
  const { fetchWithAuth } = useApi();

  return useQuery<any[]>({
    queryKey: ["accommodations"],
    enabled: true,
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/apartments/accommodation/`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.message || "Erro ao buscar acomodações");
      }

      const json = await response.json();
      return (
        json?.data?.accommodations || json?.data?.items || json?.data || []
      );
    },
  });
}
