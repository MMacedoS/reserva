import { useMutation, useQueryClient } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { PaymentRequest } from "@/http/types/payments/Payment";
import { getCashboxByUserId } from "../cashbox/getCashboxByUserId";

export function useProcessPayment() {
  const { fetchWithAuth } = useApi();
  const queryClient = useQueryClient();
  const { mutate: refetchCashbox } = getCashboxByUserId();

  return useMutation({
    mutationFn: async (data: PaymentRequest) => {
      if (!data.cashbox_id) {
        throw new Error("Cashbox ID is required");
      }
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${environment.apiVersion}/payments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erro ao processar pagamento");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({
        queryKey: ["cashbox", variables.cashbox_id],
      });

      if (variables.sale_id) {
        queryClient.invalidateQueries({
          queryKey: ["payments-by-sale", variables.sale_id],
        });
      }

      if (variables.reservation_id) {
        queryClient.invalidateQueries({
          queryKey: ["reservations", variables.reservation_id, "payments"],
        });
      }

      queryClient.invalidateQueries({ queryKey: ["accommodations"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-daily-revenue"] });

      refetchCashbox();
    },
  });
}
