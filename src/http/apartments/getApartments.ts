import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getApartments(page = 1, limit = 10) {
  const attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;

  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["apartments", page],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/apartments?${attr}`
      );
      const json = await response.json();
      return {
        data: json.data.apartamentos,
        pagination: json.data.pagination,
      };
    },
  });
}
