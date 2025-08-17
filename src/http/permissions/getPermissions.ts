import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Permission } from "../types/permissions/Permission";

export function getPermissions() {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: ["permissions"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/permissions-list`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar permissões");
      }

      const json = await response.json();
      return json.data as Permission[];
    },
  });
}
