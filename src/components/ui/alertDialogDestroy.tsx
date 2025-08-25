import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";

type AlertDialogDestroyProps = {
  open: boolean;
  onCloseDestroy?: () => void;
  onConfirm: () => void;
  item: any;
  type?:
    | "apartamento"
    | "empregado"
    | "transação"
    | "cliente"
    | "reserva"
    | "diaria"
    | "consumo"
    | "pagamento"
    | "usuario"
    | "papel"
    | "permissao"
    | "servico"
    | "produto"
    | "categoria"
    | "fornecedor"
    | "pedido"
    | "fatura"
    | "relatório"
    | "configuração"
    | "outro";
};

export function AlertDialogDestroy({
  open,
  onCloseDestroy,
  onConfirm,
  item,
  type = "apartamento",
}: AlertDialogDestroyProps) {
  const itemName = item?.name || item?.description;

  return (
    <AlertDialog open={open} onOpenChange={onCloseDestroy}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir o {type} {itemName || "Item"}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCloseDestroy}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
