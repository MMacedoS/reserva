import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAccommodations } from "@/http/reservations/accommodations/getAccommodations";
import { useCheckinReservation } from "@/http/reservations/checkinReservation";
import { useCheckoutReservation } from "@/http/reservations/checkoutReservation";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { AccommodationCard } from "./Components/AccommodationCard";
import { ConsumptionDialog } from "./Components/ConsumptionDialog";
import { PaymentsDialog } from "./Components/PaymentsDialog";
import { PerDiemsDialog } from "./Components/PerDiemsDialog";
import { ReservationFormDialog } from "@/pages/Reservations/Form/ReservationFormDialog";
import type { Reservation } from "@/http/types/reservations/Reservation";
import CheckoutDialog from "./Components/CheckoutDialog";
import CheckinDialog from "./Components/CheckinDialog";

const AccommodationPage = () => {
  const { data: accommodations, isLoading } = useAccommodations();

  const { mutateAsync: doCheckin, isPending: doingCheckin } =
    useCheckinReservation();

  const { mutateAsync: doCheckout, isPending: doingCheckout } =
    useCheckoutReservation();

  const [confirmOpen, setConfirmOpen] = useState(false);

  const [selected, setSelected] = useState<{
    id: number | string;
    aptName: string;
    customerName: string;
    dt_checkin?: string;
  } | null>(null);

  const [confirmCheckoutOpen, setConfirmCheckoutOpen] = useState(false);

  const [selectedCheckout, setSelectedCheckout] = useState<{
    id: number | string;
    aptName: string;
  } | null>(null);

  const [consumptionOpen, setConsumptionOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [perDiemOpen, setPerDiemOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState<any | null>(
    null
  );
  const [activeReservation, setActiveReservation] = useState<Reservation>();

  const isToday = (dateStr?: string | null) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    const pad = (n: number) => String(n).padStart(2, "0");
    const today = new Date();
    const toKey = (x: Date) =>
      `${x.getFullYear()}-${pad(x.getMonth() + 1)}-${pad(x.getDate())}`;
    return toKey(d) === toKey(today);
  };

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
    setConfirmOpen(false);
    setSelected(null);
  };

  const openCheckoutConfirm = (payload: {
    id: number | string;
    aptName: string;
  }) => {
    setSelectedCheckout(payload);
    setConfirmCheckoutOpen(true);
  };

  const confirmCheckout = async () => {
    if (!selectedCheckout) return;
    await doCheckout(selectedCheckout.id);
    setConfirmCheckoutOpen(false);
    setSelectedCheckout(null);
  };

  return (
    <Sidebar>
      <Card>
        <CardHeader>
          <CardTitle className="mt-1">Acomodações</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="animate-spin size-6 text-gray-500" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(accommodations || []).map((apt: any) => {
                const reservation = apt.reservation;
                const hasReservation = !!reservation;
                const status = reservation?.situation || apt.situation;
                const todayReservation =
                  hasReservation && isToday(reservation?.checkin);
                const canCheckin =
                  todayReservation &&
                  ["Reservada", "Confirmada"].includes(status);
                return (
                  <AccommodationCard
                    key={apt.id}
                    apt={apt}
                    doingCheckin={doingCheckin}
                    canCheckin={canCheckin}
                    todayReservation={todayReservation}
                    onCheckin={() =>
                      openConfirm({
                        id: reservation.id,
                        aptName: apt.name,
                        customerName:
                          reservation?.customer?.name ||
                          reservation?.customer_name,
                        dt_checkin: reservation.checkin,
                      })
                    }
                    onAddConsumption={() => {
                      setActiveReservation(reservation);
                      setConsumptionOpen(true);
                    }}
                    onAddPayment={() => {
                      setActiveReservation(reservation);
                      setPaymentOpen(true);
                    }}
                    onEdit={() => {
                      setEditingReservation({ ...reservation });
                      setEditOpen(true);
                    }}
                    onAddPerDiem={() => {
                      setActiveReservation(reservation);
                      setPerDiemOpen(true);
                    }}
                    onCheckout={() =>
                      openCheckoutConfirm({
                        id: reservation.id,
                        aptName: apt.name,
                      })
                    }
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <CheckinDialog
        confirmCheckin={confirmCheckin}
        doingCheckin={doingCheckin}
        confirmOpen={confirmOpen}
        setConfirmOpen={setConfirmOpen}
        selected={selected}
      />

      <CheckoutDialog
        confirmCheckout={confirmCheckout}
        doingCheckout={doingCheckout}
        confirmCheckoutOpen={confirmCheckoutOpen}
        setConfirmCheckoutOpen={setConfirmCheckoutOpen}
        selectedCheckout={selectedCheckout}
      />

      {activeReservation && (
        <>
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
        </>
      )}

      <ReservationFormDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        reservation={editingReservation}
      />
    </Sidebar>
  );
};

export default AccommodationPage;
