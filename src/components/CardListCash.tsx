import type { Cashbox } from "@/http/types/cashbox/Cashbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import { TransactionDialog } from "./TransactionDialog";

const CardListCash = ({ cashbox }: { cashbox: Cashbox }) => {
  const getStatusBadge = (status: string) => {
    const colors = {
      aberto: "bg-green-100 text-green-800",
      fechado: "bg-blue-100 text-blue-800",
      cancelado: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full animate-pulse ${
          colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    );
  };

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{cashbox.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status:</span>
            {getStatusBadge(cashbox.status || "aberto")}
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Abertura:</span>
            <span>{formatDateWithTime(cashbox.opened_at || "")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Fechamento:</span>
            <span>{formatDateWithTime(cashbox.closed_at || "")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Valor inicial:</span>
            <span>{formatValueToBRL(cashbox.initial_amount || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total entradas:</span>
            <span>{formatValueToBRL(cashbox.total_input || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total saídas:</span>
            <span>{formatValueToBRL(cashbox.total_output || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Totais:</span>
            <span>
              {formatValueToBRL(
                (cashbox.total_input || 0) +
                  (cashbox.initial_amount || 0) -
                  (cashbox.total_output || 0)
              )}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Total Sangria:</span>
            <span>{formatValueToBRL(cashbox.total_bleed_box || 0)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Saldo atual:</span>
            <span>{formatValueToBRL(cashbox.current_balance || 0)}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Fechamento:</span>
            <span>{formatValueToBRL(cashbox.final_amount || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Diferença:</span>
            <span>{formatValueToBRL(cashbox.difference || 0)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <TransactionDialog
          title={cashbox.name || ""}
          cashBoxId={cashbox.id || ""}
        />
      </CardFooter>
    </Card>
  );
};

export default CardListCash;
