import { useApi } from "@/hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import type { Customer } from "../types/Customer/Customer";
import { environment } from "@/environments/environment";

type GetCustomerParams = {
  page?: number;
  limit?: number;
  searchQuery?: string;
};

export function getCustomers({
  page = 1,
  limit = 10,
  searchQuery = "",
}: GetCustomerParams) {
  const { fetchWithAuth } = useApi();

  const queryParams = new URLSearchParams();
  queryParams.append("page", page.toString());
  queryParams.append("limit", limit.toString());
  if (searchQuery) queryParams.append("search", searchQuery);

  return useQuery<{
    data: Customer[];
    pagination: { current_page: number; last_page: number; total: number };
  }>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${
          environment.apiVersion
        }/customers?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Não foi possivel buscar os clientes");
      }

      const json = await response.json();
      return {
        data: json.data.customers,
        pagination: json.data.pagination,
      };
    },
  });
}
