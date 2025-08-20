import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { getPaymentsBySale } from "@/http/payments/getPaymentsBySale";
import { useProcessPayment } from "@/http/payments/processPayment";
import { useCancelPayment } from "@/http/payments/cancelPayment";
import type { Payment } from "@/http/types/payments/Payment";
import { formatValueToBRL } from "@/lib/utils";
import { useCashbox } from "@/hooks/useCashbox";

interface SalePaymentsManagerProps {
  saleId: string;
  saleAmount: number;
  readOnly?: boolean;
}

export const SalePaymentsManager = ({
  saleId,
  saleAmount,
  readOnly = false,
}: SalePaymentsManagerProps) => {
  const [newPayment, setNewPayment] = useState<{
    method: Payment["method"] | "";
    amount: number;
    installments: number;
    reference: string;
    notes: string;
  }>({
    method: "",
    amount: 0,
    installments: 1,
    reference: "",
    notes: "",
  });

  const { cashbox } = useCashbox();

  const { data: paymentsData, isLoading } = getPaymentsBySale(saleId);
  const processPaymentMutation = useProcessPayment();
  const cancelPaymentMutation = useCancelPayment();

  const payments = Array.isArray(paymentsData?.data?.payments)
    ? paymentsData.data.payments
    : [];

  const totalPaid = payments
    .filter((payment: Payment) => payment.status === "Pago")
    .reduce((sum: number, payment: Payment) => sum + payment.amount, 0);

  const remainingAmount = saleAmount - totalPaid;

  const paymentMethods = [
    { value: "cash", label: "Dinheiro" },
    { value: "debit_card", label: "Cartão de Débito" },
    { value: "credit_card", label: "Cartão de Crédito" },
    { value: "pix", label: "PIX" },
    { value: "transfer", label: "Transferência" },
    { value: "other", label: "Outro" },
  ];

  const addPayment = async () => {
    if (!newPayment.method || newPayment.amount <= 0) {
      return;
    }

    if (newPayment.amount > remainingAmount) {
      return;
    }

    try {
      await processPaymentMutation.mutateAsync({
        sale_id: saleId,
        method: newPayment.method as Payment["method"],
        amount: newPayment.amount,
        installments: newPayment.installments || 1,
        reference: newPayment.reference || undefined,
        notes: newPayment.notes || undefined,
        cashbox_id: cashbox?.id || undefined,
      });

      setNewPayment({
        method: "",
        amount: 0,
        installments: 1,
        reference: "",
        notes: "",
      });
    } catch (error) {}
  };

  const cancelPayment = async (paymentId: string) => {
    try {
      await cancelPaymentMutation.mutateAsync(paymentId);
    } catch (error) {}
  };

  const getStatusLabel = (status: string) => {
    const statusMap = {
      pending: "Pendente",
      completed: "Concluído",
      cancelled: "Cancelado",
      failed: "Falhou",
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const getMethodLabel = (method: string) => {
    const methodMap = {
      cash: "Dinheiro",
      debit_card: "Cartão de Débito",
      credit_card: "Cartão de Crédito",
      pix: "PIX",
      transfer: "Transferência",
      other: "Outro",
    };
    return methodMap[method as keyof typeof methodMap] || method;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pagamentos da Venda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Carregando pagamentos...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pagamentos da Venda</CardTitle>
      </CardHeader>
      <CardContent>
        {!readOnly && remainingAmount > 0 && (
          <div className="mb-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Método de Pagamento</Label>
                <Select
                  value={newPayment.method}
                  onValueChange={(value) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      method: value as Payment["method"],
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={remainingAmount}
                  value={newPayment.amount}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      amount: Math.min(
                        parseFloat(e.target.value) || 0,
                        remainingAmount
                      ),
                    }))
                  }
                />
              </div>
              {newPayment.method === "credit_card" && (
                <div>
                  <Label>Parcelas</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={newPayment.installments}
                    onChange={(e) =>
                      setNewPayment((prev) => ({
                        ...prev,
                        installments: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Referência (opcional)</Label>
                <Input
                  value={newPayment.reference}
                  onChange={(e) =>
                    setNewPayment((prev) => ({
                      ...prev,
                      reference: e.target.value,
                    }))
                  }
                  placeholder="Ex: Número do cartão, código PIX..."
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={addPayment}
                  className="w-full"
                  disabled={
                    processPaymentMutation.isPending ||
                    !newPayment.method ||
                    newPayment.amount <= 0 ||
                    newPayment.amount > remainingAmount
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {processPaymentMutation.isPending
                    ? "Processando..."
                    : "Adicionar Pagamento"}
                </Button>
              </div>
            </div>
          </div>
        )}

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Método</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Referência</TableHead>
              {!readOnly && <TableHead className="w-20">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment: Payment) => (
              <TableRow key={payment.id}>
                <TableCell>{getMethodLabel(payment.method)}</TableCell>
                <TableCell>{formatValueToBRL(payment.amount)}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === "Pago"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "Pendente"
                        ? "bg-yellow-100 text-yellow-800"
                        : payment.status === "Cancelado"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {getStatusLabel(payment.status)}
                  </span>
                </TableCell>
                <TableCell>{payment.reference || "-"}</TableCell>
                {!readOnly && (
                  <TableCell>
                    {payment.status === "Pago" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelPayment(payment.id || "")}
                        disabled={cancelPaymentMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
            {payments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={readOnly ? 4 : 5}
                  className="text-center text-gray-500"
                >
                  Nenhum pagamento adicionado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Total da Venda:</span>
            <span className="font-medium">{formatValueToBRL(saleAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Pago:</span>
            <span className="font-medium text-green-600">
              {formatValueToBRL(totalPaid)}
            </span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Restante:</span>
            <span
              className={
                remainingAmount > 0 ? "text-red-600" : "text-green-600"
              }
            >
              {formatValueToBRL(remainingAmount)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
