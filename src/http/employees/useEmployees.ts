import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Employee } from "../types/employees/Employee";

export function useEmployees() {
  const { fetchWithAuth } = useApi();

  return useQuery({
    queryKey: ["employees"],
    queryFn: async (): Promise<Employee[]> => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/employees`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar funcionários");
      }

      const result = await response.json();
      return result.data || result;
    },
  });
}
