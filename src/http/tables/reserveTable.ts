import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { TableReservation } from "@/http/types/tables/Table";

export function useReserveTable() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: Omit<
        TableReservation,
        "id" | "status" | "created_at" | "updated_at"
      >
    ) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/tables/${data.table_id}/reserve`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao reservar mesa");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
