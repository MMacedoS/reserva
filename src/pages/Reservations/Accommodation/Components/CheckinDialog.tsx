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
import { formatDateWithTime } from "@/lib/utils";

type Props = {
  confirmCheckin: () => void;
  doingCheckin: boolean;
  confirmOpen: boolean;
  setConfirmOpen: (open: boolean) => void;
  selected: {
    id: number | string;
    aptName: string;
    dt_checkin?: string;
    customerName: string;
  } | null;
};

const CheckinDialog = ({
  confirmCheckin,
  doingCheckin,
  confirmOpen,
  setConfirmOpen,
  selected,
}: Props) => {
  return (
    <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar check-in</AlertDialogTitle>
          <AlertDialogDescription>
            Deseja confirmar o check-in do apartamento {selected?.aptName}?
            {selected?.dt_checkin && (
              <>
                <br />
                Entrada: {formatDateWithTime(selected.dt_checkin)}
                <br />
                Hospede: {selected.customerName}
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={confirmCheckin} disabled={doingCheckin}>
            {doingCheckin ? "Processando..." : "Confirmar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CheckinDialog;
