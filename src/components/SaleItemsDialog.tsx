import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Sale } from "@/http/types/sales/Sale";
import { SaleItemsManager } from "@/components/SaleItemsManager";
import { SalePaymentsManager } from "@/components/SalePaymentsManager";
import { useGetSaleItems } from "@/http/sales/getSaleItems";
import { useGetSale } from "@/http/sales/getSale";
import { formatValueToBRL } from "@/lib/utils";

interface SaleItemsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  sale: Sale | null;
}

export const SaleItemsDialog = ({
  isOpen,
  onClose,
  sale,
}: SaleItemsDialogProps) => {
  const { data: saleItemsData } = useGetSaleItems(sale?.id || "");
  const { data: saleData } = useGetSale(sale?.id || "");

  const currentSale = saleData?.data || sale;
  const items = Array.isArray(saleItemsData?.data.itens)
    ? saleItemsData.data.itens
    : [];
  const totalAmount = items.reduce((sum, item) => sum + (item.total || 0), 0);

  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader className="mb-4 text-sm">
          <DialogTitle className="text-lg font-semibold text-start ps-2">
            Gerenciar Venda - {sale.sale_name || `Venda ${sale.name}`}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-start ps-2 text-gray-500">
            Adicione ou remova itens e gerencie os pagamentos desta venda. O
            total será calculado automaticamente.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <SaleItemsManager
            saleId={sale.id || ""}
            readOnly={
              sale.status === "completed" || sale.status === "cancelled"
            }
          />

          <SalePaymentsManager
            saleId={sale.id || ""}
            saleAmount={currentSale?.amount || totalAmount}
            readOnly={
              sale.status === "completed" || sale.status === "cancelled"
            }
          />

          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Total da Venda:</span>
              <span className="text-xl font-bold text-green-600">
                {formatValueToBRL(totalAmount)}
              </span>
            </div>
            {(currentSale?.amount || 0) !== totalAmount && (
              <p className="text-sm text-orange-600 mt-1">
                Diferença do valor original:{" "}
                {formatValueToBRL(
                  (totalAmount || 0) - (currentSale?.amount || 0)
                )}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
