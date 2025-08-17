import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { UserPermissions } from "../types/permissions/Permission";

export function getPermissionsByUser(
  userId: string,
  options?: { enabled?: boolean }
) {
  const { fetchWithAuth } = useApi();

  const isEnabled = options?.enabled !== false && !!userId;

  return useQuery({
    queryKey: ["permissions-by-user", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error("User ID é obrigatório");
      }

      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/permissions-by-user/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar permissões do usuário");
      }

      const json = await response.json();
      return json.data as UserPermissions;
    },
    enabled: options?.enabled !== undefined ? options.enabled : isEnabled,
  });
}
