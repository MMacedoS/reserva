import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

type GetSalesParams = {
  page?: number;
  limit?: number;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  customer?: string;
  table_id?: string;
  employee_id?: string;
};

export function getSales({
  page = 1,
  limit = 10,
  searchQuery = "",
  startDate = "",
  endDate = "",
  status = "",
  customer = "",
  table_id = "",
  employee_id = "",
}: GetSalesParams) {
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
  if (customer) {
    attr += `&customer=${encodeURIComponent(customer)}`;
  }
  if (table_id) {
    attr += `&table_id=${encodeURIComponent(table_id)}`;
  }
  if (employee_id) {
    attr += `&employee_id=${encodeURIComponent(employee_id)}`;
  }

  return useQuery({
    queryKey: [
      "sales",
      page,
      searchQuery,
      startDate,
      endDate,
      status,
      customer,
      table_id,
      employee_id,
    ],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/sales?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar vendas");
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
