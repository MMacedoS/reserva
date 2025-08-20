import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type GetTablesParams = {
  page?: number;
  limit?: number;
  searchQuery?: string;
  status?: string;
  location?: string;
  is_active?: boolean;
};

export function getTables({
  page = 1,
  limit = 10,
  searchQuery = "",
  status = "",
  location = "",
  is_active,
}: GetTablesParams) {
  const { fetchWithAuth } = useApi();

  let attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;
  if (searchQuery) {
    attr += `&search=${encodeURIComponent(searchQuery)}`;
  }
  if (status) {
    attr += `&status=${encodeURIComponent(status)}`;
  }
  if (location) {
    attr += `&location=${encodeURIComponent(location)}`;
  }
  if (is_active !== undefined) {
    attr += `&is_active=${is_active}`;
  }

  return useQuery({
    queryKey: ["tables", page, searchQuery, status, location, is_active],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/tables?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar mesas");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 2,
  });
}
