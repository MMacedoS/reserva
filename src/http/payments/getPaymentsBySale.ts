import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getPaymentsBySale(saleId: string) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: ["payments-by-sale", saleId],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/sales/${saleId}/payments`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar pagamentos da venda");
      }

      return response.json();
    },
    enabled: !!saleId,
    staleTime: 1000 * 60 * 2,
  });
}
