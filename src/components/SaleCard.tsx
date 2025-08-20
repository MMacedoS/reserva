import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Sale } from "@/http/types/sales/Sale";
import { formatValueToBRL } from "@/lib/utils";

interface SaleCardProps {
  sale: Sale;
  onEdit: (sale: Sale) => void;
  onClose?: (saleId: Sale) => void;
  onCancel?: (saleId: string) => void;
  onManageItems?: (sale: Sale) => void;
}

export const SaleCard = ({
  sale,
  onEdit,
  onClose,
  onCancel,
  onManageItems,
}: SaleCardProps) => {
  const getStatusBadge = (status: string | number) => {
    let statusStr = String(status);

    const colors = {
      Pendente: "bg-yellow-100 text-yellow-800 border-yellow-200 animate-pulse",
      Pago: "bg-green-100 text-green-800 border-green-200 animate-pulse",
      Finalizada: "bg-green-100 text-green-800 border-green-200 animate-pulse",
      Cancelada: "bg-red-100 text-red-800 border-red-200 animate-pulse",
    };
    return (
      colors[statusStr as keyof typeof colors] ||
      "bg-gray-100 text-gray-800 border-gray-200"
    );
  };

  const getStatusLabel = (status: string | number) => {
    let statusStr = String(status);
    if (statusStr === "Pendente") statusStr = "Pendente";
    if (statusStr === "Pago") statusStr = "Finalizada";
    if (statusStr === "Cancelado") statusStr = "Cancelada";

    const labels = {
      pending: "Pendente",
      paid: "Pago",
      completed: "Finalizada",
      cancelled: "Cancelada",
    };
    return labels[statusStr as keyof typeof labels] || statusStr;
  };

  const canManipulate =
    String(sale.status) !== "Cancelada" &&
    sale.status !== "Pago" &&
    sale.status !== "Finalizada";

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 items-center">
          <div className="w-full grid grid-cols-2 items-end">
            <div>
              <p className="font-medium text-sm line-clamp-1">
                {sale.sale_name || sale.name || `Venda ${sale.id}`}
              </p>
              <p className="text-xs text-gray-500">
                {sale.created_at &&
                  format(new Date(sale.created_at), "dd/MM/yyyy HH:mm")}
              </p>
              {sale.user_name && (
                <p className="text-xs text-gray-400 line-clamp-1">
                  Por: {sale.user_name}
                </p>
              )}
            </div>
            <div className="w-full text-end">
              <Badge className={getStatusBadge(sale.status || "Pendente")}>
                {getStatusLabel(sale.status || "Pendente")}
              </Badge>
              {sale.updated_at && (
                <p className="text-xs text-gray-500 mt-1">
                  Atualizada em:{" "}
                  {format(new Date(sale.updated_at), "dd/MM/yyyy")}
                </p>
              )}
            </div>
          </div>

          <div className="w-full">
            <p className="text-xs text-gray-500">Valor Total</p>
            <p className="font-medium text-sm">
              {formatValueToBRL(sale.current_amount)}
            </p>
            {sale.payment_details && (
              <Badge
                className={getStatusBadge(
                  sale.payment_details.status || "Pendente"
                )}
              >
                {sale.payment_details.status || "Pendente"}
              </Badge>
            )}
          </div>
          <div className="w-full gap-5 justify-end grid grid-cols-2 md:grid-cols-4">
            {canManipulate && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEdit(sale)}
                  className="text-xs"
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onManageItems?.(sale)}
                  className="text-xs"
                >
                  Itens
                </Button>
                <Button
                  size="sm"
                  onClick={() => sale.id && onClose?.(sale)}
                  className="text-xs"
                >
                  Finalizar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => sale.id && onCancel?.(sale.id)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
              </>
            )}
          </div>
          {!canManipulate && (
            <div className="w-full text-end">
              <p className="text-xs text-gray-500 mt-1">
                Valor Pago : {formatValueToBRL(sale.payment_details.payment)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
