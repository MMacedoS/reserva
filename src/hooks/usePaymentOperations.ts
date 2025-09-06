import { useState } from "react";
import { useProcessPayment } from "@/http/payments/processPayment";
import { useCancelPayment } from "@/http/payments/cancelPayment";
import type { PaymentRequest } from "@/http/types/payments/Payment";

export function usePaymentOperations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processPaymentMutation = useProcessPayment();
  const cancelPaymentMutation = useCancelPayment();

  const processPayment = async (data: PaymentRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await processPaymentMutation.mutateAsync(data);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar pagamento";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelPayment = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await cancelPaymentMutation.mutateAsync({ id });
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao cancelar pagamento";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (totalAmount: number, paidAmount: number): number => {
    return Math.max(0, paidAmount - totalAmount);
  };

  const calculateInstallmentValue = (
    totalAmount: number,
    installments: number
  ): number => {
    return totalAmount / installments;
  };

  const validatePaymentAmount = (
    amount: number,
    saleTotal: number
  ): boolean => {
    return amount > 0 && amount <= saleTotal;
  };

  return {
    processPayment,
    cancelPayment,
    calculateChange,
    calculateInstallmentValue,
    validatePaymentAmount,
    loading,
    error,
    isProcessing: processPaymentMutation.isPending,
    isCancelling: cancelPaymentMutation.isPending,
  };
}
