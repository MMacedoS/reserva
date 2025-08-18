import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function checkProductAvailability(productId: string, quantity: number) {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: ["product-availability", productId, quantity],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/products/${productId}/availability?quantity=${quantity}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao verificar disponibilidade do produto");
      }

      return response.json();
    },
    enabled: !!productId && quantity > 0,
    staleTime: 1000 * 30,
  });
}
