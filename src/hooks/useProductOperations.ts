import { useState } from "react";
import { useSaveProduct } from "@/http/products/saveProduct";
import { useUpdateProduct } from "@/http/products/updateProduct";
import { useDeleteProduct } from "@/http/products/deleteProduct";
import { useUpdateProductStock } from "@/http/products/updateProductStock";
import type {
  ProductRequest,
  ProductStockUpdate,
} from "@/http/types/products/Product";

export function useProductOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveProductMutation = useSaveProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const updateStockMutation = useUpdateProductStock();

  const createProduct = async (data: ProductRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await saveProductMutation.mutateAsync(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar produto";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, data: ProductRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateProductMutation.mutateAsync({ id, data });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar produto";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await deleteProductMutation.mutateAsync(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao deletar produto";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, data: ProductStockUpdate) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateStockMutation.mutateAsync({ id, data });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar estoque";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    loading,
    error,
    isCreating: saveProductMutation.isPending,
    isUpdating: updateProductMutation.isPending,
    isDeleting: deleteProductMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
  };
}
