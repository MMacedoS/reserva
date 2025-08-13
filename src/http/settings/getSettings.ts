import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";

export function getSettings() {
  const { fetchWithAuth } = useApi();
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/settings`
      );
      const result: { data: any } = await response.json();

      return result;
    },
  });
}
