import { useMutation } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Cashbox } from "../types/cashbox/Cashbox";
import { useAuth } from "@/hooks/useAuth";
import { getCashboxByUserId } from "./getCashboxByUserId";

type ApiResponse = { status: number; data: Cashbox };

export function saveCashbox() {
  const { updateCashbox } = useAuth();
  const { fetchWithAuth } = useApi();
  const { mutate: refetchCashbox } = getCashboxByUserId();

  return useMutation<ApiResponse, Error, Cashbox>({
    mutationFn: async (data: Cashbox) => {
      const isUpdate = !!data.id;
      const method = isUpdate ? "PUT" : "POST";

      const { id, ...payload } = data;
      const url = isUpdate
        ? `${environment.apiUrl}/${environment.apiVersion}/cashbox/${id}`
        : `${environment.apiUrl}/${environment.apiVersion}/cashbox`;

      const response = await fetchWithAuth(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `Erro : ${errorBody.data.message || response.statusText}`
        );
      }

      const result = await response.json();
      return result;
    },
    onSuccess: ({ data }) => {
      updateCashbox(data);
      refetchCashbox();
      showAutoDismissAlert({
        message: "Dados salvos com sucesso!",
        description: "Os dados foram armazenados.",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      showAutoDismissAlert({
        message: "Erro ao salvar dados",
        description: error.message || "Erro desconhecido",
        duration: 4000,
      });
    },
  });
}
