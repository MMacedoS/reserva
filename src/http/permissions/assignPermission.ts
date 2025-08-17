import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { useAuth } from "@/hooks/useAuth";
import type { AssignPermissionRequest } from "../types/permissions/Permission";

export function useAssignPermission() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();
  const { user, updatePermissions } = useAuth();

  return useMutation({
    mutationFn: async (data: { userId: string; permissions: string[] }) => {
      const payload: AssignPermissionRequest = {
        permissions: data.permissions,
      };

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/assign-permission/${data.userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Erro ao atribuir permissões: ${errorBody || response.statusText}`
        );
      }

      const result = await response.json();
      return result.data || result;
    },
    onSuccess: async (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["permissions-by-user", variables.userId],
      });

      if (user?.id === variables.userId) {
        try {
          const allPermissions = queryClient.getQueryData(["permissions"]);
          if (allPermissions) {
            const selectedPermissionNames = (allPermissions as any[])
              .filter((permission) =>
                variables.permissions.includes(permission.id)
              )
              .map((permission) => permission.name);
            updatePermissions(selectedPermissionNames);
          }
        } catch (error) {
          console.error("Erro ao atualizar permissões do contexto:", error);
        }
      }

      showAutoDismissAlert({
        message: "Permissões atribuídas com sucesso!",
        description: "As permissões foram atualizadas.",
        duration: 2000,
      });
    },
    onError: () => {
      showAutoDismissAlert({
        message: "Erro ao atribuir permissões",
        description: "Tente novamente mais tarde.",
        duration: 3000,
      });
    },
  });
}
