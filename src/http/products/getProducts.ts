import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/hooks/useApi";
import type { Product } from "@/http/types/products/Product";
import { environment } from "@/environments/environment";

export interface GetProductsParams {
  page: number;
  limit: number;
  searchQuery?: string;
  category_id?: string;
  status?: string;
  low_stock?: boolean;
}

interface ProductsResponse {
  data: {
    products: Product[];
    pagination: {
      current_page: number;
      total_pages: number;
      total: number;
      per_page: number;
    };
  };
}

export const getProducts = ({
  page,
  limit,
  searchQuery,
  category_id,
  status,
  low_stock,
}: GetProductsParams) => {
  const { fetchWithAuth } = useApi();

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (searchQuery) queryParams.append("search", searchQuery);
  if (category_id) queryParams.append("category_id", category_id);
  if (status) queryParams.append("status", status);
  if (low_stock) queryParams.append("low_stock", "true");

  const queryString = queryParams.toString();

  return useQuery({
    queryKey: ["products", queryString],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/products?${queryString}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar produtos");
      }
      return response.json() as Promise<ProductsResponse>;
    },
    staleTime: 30000, // 30 segundos
  });
};
