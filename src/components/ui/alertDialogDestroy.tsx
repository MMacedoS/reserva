import type { Apartment } from "@/http/types/apartments/Apartment";
import type { Employee } from "@/http/types/employees/Employee";
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
  apartment?: Apartment | null;
  employee?: Employee | null;
};

export function AlertDialogDestroy({
  open,
  onClose,
  onConfirm,
  apartment,
  employee,
}: AlertDialogDestroyProps) {
  const itemName = apartment?.name || employee?.name;
  const itemType = apartment ? "apartamento" : "funcionário";

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
          <AlertDialogDescription>
            Você está prestes a excluir o {itemType} {apartment ? "nº" : ""}{" "}
            {itemName}.
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
