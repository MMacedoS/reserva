import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import { getCashboxByUserId } from "../cashbox/getCashboxByUserId";

type cancelPaymentProps = {
  id?: string;
  reference?: string;
};

export function useCancelPayment() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();

  const { mutate: refetchCashbox } = getCashboxByUserId();

  return useMutation({
    mutationFn: async ({ id }: cancelPaymentProps) => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/payments/${id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao cancelar pagamento");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });

      queryClient.invalidateQueries({
        queryKey: ["reservations", variables.reference, "payments"],
      });
      queryClient.invalidateQueries({ queryKey: ["dashboard-daily-revenue"] });

      refetchCashbox();
    },
  });
}
