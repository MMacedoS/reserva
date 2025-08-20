import { useState } from "react";
import { useSaveTable } from "@/http/tables/saveTable";
import { useOpenTable } from "@/http/tables/openTable";
import { useCloseTable } from "@/http/tables/closeTable";
import { useReserveTable } from "@/http/tables/reserveTable";
import type {
  TableRequest,
  TableOccupancy,
  TableReservation,
} from "@/http/types/tables/Table";

export function useTableOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveTableMutation = useSaveTable();
  const openTableMutation = useOpenTable();
  const closeTableMutation = useCloseTable();
  const reserveTableMutation = useReserveTable();

  const createTable = async (data: TableRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await saveTableMutation.mutateAsync(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao criar mesa";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const openTable = async (id: string, data: TableOccupancy) => {
    try {
      setLoading(true);
      setError(null);
      const result = await openTableMutation.mutateAsync({ id, data });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao abrir mesa";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const closeTable = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await closeTableMutation.mutateAsync(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao fechar mesa";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reserveTable = async (
    data: Omit<TableReservation, "id" | "status" | "created_at" | "updated_at">
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await reserveTableMutation.mutateAsync(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao reservar mesa";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createTable,
    openTable,
    closeTable,
    reserveTable,
    loading,
    error,
    isCreating: saveTableMutation.isPending,
    isOpening: openTableMutation.isPending,
    isClosing: closeTableMutation.isPending,
    isReserving: reserveTableMutation.isPending,
  };
}
