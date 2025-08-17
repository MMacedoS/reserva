import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getPermissionsPaginated(page = 1, limit = 10) {
  const { fetchWithAuth } = useApi();

  const attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;

  return useQuery({
    queryKey: ["permissions-paginated", page],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/permissions?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar permissões");
      }

      const json = await response.json();
      return {
        data: json.data.permissions || json.data,
        pagination: json.data.pagination,
      };
    },
  });
}
