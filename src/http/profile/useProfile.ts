import { useMutation } from "@tanstack/react-query";
import type { profileRequest } from "../types/profile/profileRequest";
import type { userResponse } from "../types/profile/userResponse";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";

type ApiResponse = { status: number; data: userResponse };

export function UseProfile() {
  const { fetchWithAuth } = useApi();
  const { user, updateUser } = useAuth();

  return useMutation<
    ApiResponse, 
    Error,        
    profileRequest
  >({
    mutationFn: async (data: profileRequest) => {
      if (!data?.name) {
        throw new Error("Nome é obrigatório");
      }
      if (!data?.email) {
        throw new Error("Email é obrigatório");
      }

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/profile/${user?.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Erro ao salvar: ${errorBody || response.statusText}`);
      }

      const result = await response.json();
      return result;
    },
    onSuccess: ({data}) => {
      updateUser(data);
      showAutoDismissAlert({
        message: "Dados salvos com sucesso!",
        description: "Os dados foram atualizados.",
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
