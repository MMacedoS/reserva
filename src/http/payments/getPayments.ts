import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type GetPaymentsParams = {
  page?: number;
  limit?: number;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  method?: string;
  status?: string;
  sale_id?: string;
};

export function getPayments({
  page = 1,
  limit = 10,
  searchQuery = "",
  startDate = "",
  endDate = "",
  method = "",
  status = "",
  sale_id = "",
}: GetPaymentsParams) {
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
  if (method) {
    attr += `&method=${encodeURIComponent(method)}`;
  }
  if (status) {
    attr += `&status=${encodeURIComponent(status)}`;
  }
  if (sale_id) {
    attr += `&sale_id=${encodeURIComponent(sale_id)}`;
  }

  return useQuery({
    queryKey: [
      "payments",
      page,
      searchQuery,
      startDate,
      endDate,
      method,
      status,
      sale_id,
    ],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/payments?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar pagamentos");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
