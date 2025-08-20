import { useState } from "react";
import { useSaveSale } from "@/http/sales/saveSale";
import { useUpdateSale } from "@/http/sales/updateSale";
import { useCloseSale } from "@/http/sales/closeSale";
import { useCancelSale } from "@/http/sales/cancelSale";
import { useAddSaleItem } from "@/http/sales/addSaleItem";
import { useRemoveSaleItem } from "@/http/sales/removeSaleItem";
import type {
  Sale,
  SaleRequest,
  SaleUpdateRequest,
} from "@/http/types/sales/Sale";

export function useSaleOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSaleMutation = useSaveSale();
  const updateSaleMutation = useUpdateSale();
  const closeSaleMutation = useCloseSale();
  const cancelSaleMutation = useCancelSale();
  const addItemMutation = useAddSaleItem();
  const removeItemMutation = useRemoveSaleItem();

  const createSale = async (data: SaleRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await saveSaleMutation.mutateAsync(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSale = async (id: string, data: SaleUpdateRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await updateSaleMutation.mutateAsync({ id, data });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao atualizar venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeSale = async (sale: Sale) => {
    try {
      setLoading(true);
      setError(null);
      const result = await closeSaleMutation.mutateAsync(sale);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fechar venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelSale = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await cancelSaleMutation.mutateAsync(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao cancelar venda";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    saleId: string,
    productId: string,
    quantity: number,
    unitPrice: number
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await addItemMutation.mutateAsync({
        sale_id: saleId,
        product_id: productId,
        quantity,
        unit_price: unitPrice,
      });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao adicionar item";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (saleId: string, itemId: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await removeItemMutation.mutateAsync({
        sale_id: saleId,
        item_id: itemId,
      });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao remover item";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createSale,
    updateSale,
    closeSale,
    cancelSale,
    addItem,
    removeItem,
    loading,
    error,
    isCreating: saveSaleMutation.isPending,
    isUpdating: updateSaleMutation.isPending,
    isClosing: closeSaleMutation.isPending,
    isCancelling: cancelSaleMutation.isPending,
    isAddingItem: addItemMutation.isPending,
    isRemovingItem: removeItemMutation.isPending,
  };
}
