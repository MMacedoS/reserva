import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { ProductCategory } from "@/http/types/products/Product";

interface CategoriesResponse {
  data: ProductCategory[];
  pagination?: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

export function useGetProductCategories() {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: ["product-categories"],
    queryFn: async (): Promise<CategoriesResponse> => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/products/categories`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao buscar categorias");
      }

      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
