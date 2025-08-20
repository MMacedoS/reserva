import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { SaleItem } from "@/http/types/sales/Sale";

interface GetSaleItemsResponse {
  data: {
    itens: SaleItem[];
    pagination: {
      current_page: number;
      total_pages: number;
      total: number;
      per_page: number;
    };
  };
}

export function useGetSaleItems(saleId: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: ["sale-items", saleId],
    queryFn: async (): Promise<GetSaleItemsResponse> => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/sales/${saleId}/sale-items`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar itens da venda");
      }

      return response.json();
    },
    enabled: !!saleId,
  });
}
