import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Apartment } from "../types/apartments/Apartment";

type ApiResponse = { status: number; data: Apartment };

export function saveApartment() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse, 
    Error,        
    Apartment
  >({
    mutationFn: async (data: Apartment) => {      
      const isUpdate = !!data.id;
      const method = isUpdate ? "PUT" : "POST";

      const { id, ...payload } = data;
      const url = isUpdate
        ? `${environment.apiUrl}/${environment.apiVersion}/apartments/${id}`
        : `${environment.apiUrl}/${environment.apiVersion}/apartments`;

      const response = await fetchWithAuth(
        url,
        {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro : ${errorBody || response.statusText}`);
      }

      const result = await response.json();
      return result;
    },
    onSuccess: ({data}) => {
      queryClient.invalidateQueries({
        queryKey: ["apartments"],
      });
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
