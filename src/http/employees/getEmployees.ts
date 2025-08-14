import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getEmployees(page = 1, limit = 10) {
  const { fetchWithAuth } = useApi();

  const attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;

  return useQuery({
    queryKey: ["employees", page],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/employees?${attr}`,
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
        data: json.data.funcionarios,
        pagination: json.data.pagination,
      };
    },
  });
}
