import { DollarSign, CreditCard, Smartphone, Receipt } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import type { Payment } from "@/http/types/payments/Payment";

interface PaymentCardProps {
  payment: Payment;
  onViewDetails?: (payment: Payment) => void;
  onViewReceipt?: (payment: Payment) => void;
  onCancel?: (payment: Payment) => void;
}

export function PaymentCard({
  payment,
  onViewDetails,
  onViewReceipt,
  onCancel,
}: PaymentCardProps) {
  const getStatusBadge = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
      failed: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      completed: "Concluído",
      cancelled: "Cancelado",
      failed: "Falhou",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "debit_card":
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "pix":
        return <Smartphone className="h-4 w-4" />;
      default:
        return <Receipt className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    const labels = {
      cash: "Dinheiro",
      debit_card: "Cartão de Débito",
      credit_card: "Cartão de Crédito",
      pix: "PIX",
      transfer: "Transferência",
      other: "Outro",
    };
    return labels[method as keyof typeof labels] || method;
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {getMethodIcon(payment.method)}
            <span className="font-medium">
              {getMethodLabel(payment.method)}
            </span>
          </div>
          <p className="text-sm text-gray-500">
            {payment.reference && `Ref: ${payment.reference}`}
          </p>
          {payment.transaction_id && (
            <p className="text-xs text-gray-400">
              ID: {payment.transaction_id}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">Valor</p>
          <p className="font-medium text-lg">R$ {payment.amount.toFixed(2)}</p>
          {payment.installments && payment.installments > 1 && (
            <p className="text-xs text-gray-500">
              {payment.installments}x de R${" "}
              {(payment.amount / payment.installments).toFixed(2)}
            </p>
          )}
          {payment.fee && payment.fee > 0 && (
            <p className="text-xs text-red-500">
              Taxa: R$ {payment.fee.toFixed(2)}
            </p>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500">Data</p>
          <p className="font-medium">
            {payment.processed_at
              ? format(new Date(payment.processed_at), "dd/MM/yyyy")
              : format(new Date(payment.created_at!), "dd/MM/yyyy")}
          </p>
          <p className="text-xs text-gray-500">
            {payment.processed_at
              ? format(new Date(payment.processed_at), "HH:mm")
              : format(new Date(payment.created_at!), "HH:mm")}
          </p>
        </div>

        <div>
          <Badge className={getStatusBadge(payment.status)}>
            {getStatusLabel(payment.status)}
          </Badge>
          {payment.authorization_code && (
            <p className="text-xs text-gray-400 mt-1">
              Auth: {payment.authorization_code}
            </p>
          )}
        </div>

        <div className="flex gap-2 justify-end">
          {onViewDetails && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(payment)}
            >
              Detalhes
            </Button>
          )}
          {payment.receipt_url && onViewReceipt && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewReceipt(payment)}
            >
              Comprovante
            </Button>
          )}
          {payment.status === "pending" && onCancel && (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel(payment)}
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
