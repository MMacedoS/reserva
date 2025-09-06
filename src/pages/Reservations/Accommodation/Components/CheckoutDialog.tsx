import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Props = {
  confirmCheckout: () => void;
  doingCheckout: boolean;
  confirmCheckoutOpen: boolean;
  setConfirmCheckoutOpen: (open: boolean) => void;
  selectedCheckout: { id: number | string; aptName?: string } | null;
};

const CheckoutDialog = ({
  confirmCheckout,
  doingCheckout,
  confirmCheckoutOpen,
  setConfirmCheckoutOpen,
  selectedCheckout,
}: Props) => {
  return (
    <AlertDialog
      open={confirmCheckoutOpen}
      onOpenChange={setConfirmCheckoutOpen}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar check-out</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja confirmar o check-out do apartamento{" "}
            {selectedCheckout?.aptName}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={confirmCheckout} disabled={doingCheckout}>
            {doingCheckout ? "Processando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckoutDialog;
