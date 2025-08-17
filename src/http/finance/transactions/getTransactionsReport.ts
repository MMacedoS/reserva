import { useQuery } from "@tanstack/react-query";
import { environment } from "@/environments/environment";
import { useApi } from "@/hooks/useApi";
import type { Transaction } from "@/http/types/finance/transaction/Transaction";

interface TransactionReportParams {
  startDate: string;
  endDate: string;
  type?: "entrada" | "saida" | "sangria" | "";
  enabled?: boolean;
}

interface TransactionReportResponse {
  summary: {
    cashbox_transactions: Transaction[];
    total_entradas: number;
    total_saidas: number;
    total_sangrias: number;
    saldo_final: number;
    payment_methods: {
      credit_card: number;
      debit_card: number;
      money: number;
      pix: number;
      others: number;
    };
    credit_card: number;
    debit_card: number;
    money: number;
    pix: number;
    others: number;
  };
}

export function useTransactionsReport({
  startDate,
  endDate,
  type = "",
  enabled = true,
}: TransactionReportParams) {
  const { fetchWithAuth } = useApi();

  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append("start_date", startDate);
  if (endDate) queryParams.append("end_date", endDate);
  if (type) queryParams.append("type", type);

  return useQuery<TransactionReportResponse>({
    queryKey: ["transactions-report", startDate, endDate, type],
    queryFn: async () => {
      const response = await fetchWithAuth(
        `${environment.apiUrl}/${
          environment.apiVersion
        }/cashbox/transactions/report?${queryParams.toString()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar relatório de transações");
      }

      const json = await response.json();
      return json.data;
    },
    enabled: enabled && !!startDate && !!endDate,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
