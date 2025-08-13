import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getCashbox(page = 1, limit = 2) {
  const { fetchWithAuth } = useApi();

  const attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;

  return useQuery({
    queryKey: ["cashbox", page],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/cashbox?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários");
      }

      const json = await response.json();
      return {
        data: json.data.caixas,
        pagination: json.data.pagination,
      };
    },
  });
}
