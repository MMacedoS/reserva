import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type GetCashboxParams = {
  page?: number;
  limit?: number;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

export function getCashbox({
  page = 1,
  limit = 10,
  searchQuery = "",
  startDate = "",
  endDate = "",
  status = "",
}: GetCashboxParams) {
  const { fetchWithAuth } = useApi();

  let attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;
  if (searchQuery) {
    attr += `&search=${encodeURIComponent(searchQuery)}`;
  }
  if (startDate) {
    attr += `&start_date=${encodeURIComponent(startDate)}`;
  }
  if (endDate) {
    attr += `&end_date=${encodeURIComponent(endDate)}`;
  }
  if (status) {
    attr += `&status=${encodeURIComponent(status)}`;
  }

  return useQuery({
    queryKey: ["cashbox", page, searchQuery, startDate, endDate, status],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/cashbox?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar caixas financeiros");
      }

      const json = await response.json();
      return {
        data: json.data.caixas,
        pagination: json.data.pagination,
      };
    },
  });
}
