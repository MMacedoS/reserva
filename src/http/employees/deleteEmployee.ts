import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function useDeleteEmployee() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/employees/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Erro ao excluir funcionário: ${errorBody || response.statusText}`
        );
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      showAutoDismissAlert({
        message: "Funcionário excluído com sucesso!",
        description: "O funcionário foi removido.",
        duration: 2000,
      });
    },
    onError: (error) => {
      showAutoDismissAlert({
        message: "Erro ao excluir funcionário",
        description: error.message,
        duration: 3000,
      });
    },
  });
}
