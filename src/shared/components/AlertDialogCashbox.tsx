import { useState } from "react";
import { formatDate, formatValueToBRL } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { LucideCircleDollarSign } from "lucide-react";

type AlertDialogCashboxProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: (finalAmount?: number) => void;
  item: any;
  type?: "Cashbox";
};

export function AlertDialogCashbox({
  open,
  onClose,
  onConfirm,
  item,
  type = "Cashbox",
}: AlertDialogCashboxProps) {
  const [finalAmount, setFinalAmount] = useState<string>("");
  const itemName = item?.name || item?.description;

  const handleConfirm = () => {
    const amount = finalAmount ? parseFloat(finalAmount) : undefined;
    onConfirm(amount);
    setFinalAmount("");
  };

  const handleClose = () => {
    setFinalAmount("");
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja Fechar?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a fechar o {type} {itemName}.
            {item && (
              <div className="mt-2">
                <div className="mt-1">
                  <p className="text-muted-foreground">
                    <strong>Descrição:</strong> {item.obs}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Situação:</strong>{" "}
                    <LucideCircleDollarSign className="inline text-green-500 rounded-full animate-pulse" />{" "}
                    {item.status}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Data Abertura:</strong> {formatDate(item.opened_at)}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Valor Inicial:</strong>{" "}
                    {formatValueToBRL(item.initial_balance)}
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Valor atual:</strong>{" "}
                    {formatValueToBRL(item.current_balance)}
                  </p>
                </div>
                <div className="mt-4 space-y-2">
                  <Label htmlFor="final-amount">Valor Final do Caixa:</Label>
                  <Input
                    id="final-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Digite o valor final do caixa"
                    value={finalAmount}
                    onChange={(e) => setFinalAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Se deixado vazio, será usado o valor atual do sistema
                  </p>
                </div>
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
