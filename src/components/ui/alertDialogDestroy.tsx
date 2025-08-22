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
  onClose: () => void;
  onConfirm: () => void;
  item: any;
  type?: "apartment" | "employee" | "transaction" | "customer";
};

export function AlertDialogDestroy({
  open,
  onClose,
  onConfirm,
  item,
  type = "apartment",
}: AlertDialogDestroyProps) {
  const itemName = item?.name || item?.description;

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir o {type} {itemName}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirmar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
