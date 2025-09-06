import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCheckinReservation } from "@/http/reservations/checkinReservation";
import { useCheckoutReservation } from "@/http/reservations/checkoutReservation";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { formatDateWithTime } from "@/lib/utils";
import CheckinDialog from "@/pages/Reservations/Accommodation/Components/CheckinDialog";
import CheckoutDialog from "@/pages/Reservations/Accommodation/Components/CheckoutDialog";
import { ConsumptionDialog } from "@/pages/Reservations/Accommodation/Components/ConsumptionDialog";
import { PaymentsDialog } from "@/pages/Reservations/Accommodation/Components/PaymentsDialog";
import { PerDiemsDialog } from "@/pages/Reservations/Accommodation/Components/PerDiemsDialog";
import { ReservationFormDialog } from "@/pages/Reservations/Form/ReservationFormDialog";
import {
  LucideArrowBigLeftDash,
  LucideCalendarDays,
  LucideDollarSign,
  LucideEdit2,
  LucideShoppingBasket,
} from "lucide-react";
import { useEffect, useState } from "react";

type ListProps = {
  open: boolean;
  onClose: () => void;
  reservations?: Reservation[];
  type: "checkin" | "checkout";
};

const ListReservations = ({
  open,
  onClose,
  reservations: initialReservations,
  type,
}: ListProps) => {
  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [perDiemOpen, setPerDiemOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [activeReservation, setActiveReservation] = useState<Reservation>();

  const [confirmCheckoutOpen, setConfirmCheckoutOpen] = useState(false);

  const [selectedCheckout, setSelectedCheckout] = useState<{
    id: number | string;
    aptName?: string;
  } | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selected, setSelected] = useState<{
    id: number | string;
    aptName: string;
    customerName: string;
    dt_checkin?: string;
  } | null>(null);

  const [reservations, setReservations] = useState<Reservation[]>(
    initialReservations || []
  );

  useEffect(() => {
    setReservations(initialReservations || []);
  }, [initialReservations]);

  const { mutateAsync: doCheckin, isPending: doingCheckin } =
    useCheckinReservation();
  const { mutateAsync: doCheckout, isPending: doingCheckout } =
    useCheckoutReservation();

  const confirmCheckout = async () => {
    if (!selectedCheckout) return;
    await doCheckout(selectedCheckout.id);
    setReservations((prev) => prev.filter((r) => r.id !== selectedCheckout.id));
    setConfirmCheckoutOpen(false);
    setSelectedCheckout(null);
  };

  useEffect(() => {
    if (!open) {
      setSelected(null);
      setSelectedCheckout(null);
    }
  }, [open]);

  const openConfirm = (payload: {
    id: number | string;
    aptName: string;
    customerName: string;
    dt_checkin?: string;
  }) => {
    setSelected(payload);
    setConfirmOpen(true);
  };

  const confirmCheckin = async () => {
    if (!selected) return;
    await doCheckin(selected.id);
    setReservations((prev) => prev.filter((r) => r.id !== selected.id));
    setConfirmOpen(false);
    setSelected(null);
  };

  return (
    <>
      <AlertDialog open={open} onOpenChange={onClose}>
        <AlertDialogContent className="max-h-[80vh] !max-w-5xl overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-semibold justify-between flex">
              Listagem de Reservas
              <AlertDialogAction onClick={() => onClose()}>
                <LucideArrowBigLeftDash />
              </AlertDialogAction>
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Reservas para {type === "checkin" ? "check-in" : "check-out"} hoje:
          </AlertDialogDescription>
          {reservations?.length === 0 && reservations ? (
            <p className="mt-4">Nenhuma reserva para hoje.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {reservations?.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="flex flex-col justify-between shadow-lg border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-green-100 hover:shadow-2xl transition-shadow duration-200"
                >
                  <CardContent>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                        {reservation.customer?.name?.[0] || "?"}
                      </div>
                      <div>
                        <div className="font-semibold text-md text-green-900">
                          {reservation.customer?.name || "Sem nome"}
                        </div>
                        <div className="text-lg text-green-700">
                          Apto: {reservation.apartment?.name || "Sem apto"}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                      <span className="text-sm text-gray-600">
                        <b>Check-in:</b>{" "}
                        {formatDateWithTime(reservation.checkin)}
                      </span>
                      <span className="text-sm text-gray-600">
                        <b>Check-out:</b>{" "}
                        {formatDateWithTime(reservation.checkout)}
                      </span>
                    </div>
                    {type === "checkout" && (
                      <>
                        <div className="text-sm text-red-600 font-semibold">
                          {new Date(reservation.checkout) < new Date()
                            ? "Atrasado"
                            : "No prazo"}
                        </div>
                        {reservation.estimated_value ===
                          reservation.paid_amount && (
                          <Button
                            variant="outline"
                            className="mt-4 w-full bg-slate-800 text-white hover:bg-slate-400"
                            onClick={() => {
                              setSelectedCheckout({
                                id: reservation.id,
                                aptName: reservation.apartment?.name,
                              });
                              setConfirmCheckoutOpen(true);
                            }}
                          >
                            Realizar Check-out
                          </Button>
                        )}
                        <div className="pt-3 mt-3 border-t flex flex-wrap gap-2 justify-center">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveReservation(reservation);
                              setConsumptionOpen(true);
                            }}
                          >
                            <LucideShoppingBasket />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveReservation(reservation);
                              setPaymentOpen(true);
                            }}
                          >
                            <LucideDollarSign />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setActiveReservation(reservation);
                              setPerDiemOpen(true);
                            }}
                          >
                            <LucideCalendarDays />
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditOpen(true);
                              setActiveReservation(reservation);
                            }}
                          >
                            <LucideEdit2 />
                          </Button>
                        </div>
                      </>
                    )}
                    {type === "checkin" && (
                      <Button
                        variant="outline"
                        className="mt-4 w-full bg-slate-800 text-white hover:bg-slate-400"
                        onClick={() =>
                          openConfirm({
                            id: reservation.id,
                            aptName: reservation.apartment?.name || "",
                            customerName: reservation.customer?.name || "",
                            dt_checkin: reservation.checkin,
                          })
                        }
                      >
                        Realizar Check-in
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          {}
        </AlertDialogContent>
      </AlertDialog>

      <ConsumptionDialog
        open={consumptionOpen}
        onClose={() => setConsumptionOpen(false)}
        reservation={activeReservation}
      />

      <PaymentsDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        reservation={activeReservation}
      />

      <PerDiemsDialog
        open={perDiemOpen}
        onClose={() => setPerDiemOpen(false)}
        reservation={activeReservation}
      />

      <ReservationFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        reservation={activeReservation}
      />

      <CheckoutDialog
        confirmCheckout={confirmCheckout}
        doingCheckout={doingCheckout}
        confirmCheckoutOpen={confirmCheckoutOpen}
        setConfirmCheckoutOpen={setConfirmCheckoutOpen}
        selectedCheckout={selectedCheckout}
      />

      <CheckinDialog
        confirmCheckin={confirmCheckin}
        doingCheckin={doingCheckin}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        selected={selected}
      />
    </>
  );
};

export default ListReservations;
