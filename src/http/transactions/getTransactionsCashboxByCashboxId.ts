import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getTransactionsCashboxByCashboxId(
  cashBoxId: string,
  page = 1,
  limit = 10,
  enabled = true
) {
  const { fetchWithAuth } = useApi();

  const attr = `page=${page < 1 ? 1 : page}&limit=${limit}`;

  return useQuery({
    queryKey: ["cashbox", cashBoxId, page],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/cashbox/${cashBoxId}/transactions?${attr}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar transações");
      }

      const json = await response.json();
      return {
        data: json.data.transacoes,
        pagination: json.data.pagination,
      };
    },
    enabled: enabled && !!cashBoxId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
