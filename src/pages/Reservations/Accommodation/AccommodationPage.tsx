import Footer from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAccommodations } from "@/http/reservations/accommodations/getAccommodations";
import { useCheckinReservation } from "@/http/reservations/checkinReservation";
import { formatDateWithTime } from "@/lib/utils";
import { Loader2, LogIn } from "lucide-react";
import { useState } from "react";
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

const AccommodationPage = () => {
  const { sidebarToggle } = useSidebar();
  const { data: accommodations, isLoading } = useAccommodations();
  const { mutateAsync: doCheckin, isPending: doingCheckin } =
    useCheckinReservation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState<{
    id: number | string;
    aptName: string;
    dt_checkin?: string;
  } | null>(null);

  // Helper para obter cor de status
  const getSituationBadge = (situation?: string) => {
    const map: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      Disponivel: { label: "Disponível", variant: "secondary" },
      Reservada: { label: "Reservada", variant: "outline" },
      Confirmada: { label: "Confirmada", variant: "default" },
      Hospedada: { label: "Hospedada", variant: "default" },
      Finalizada: { label: "Finalizada", variant: "secondary" },
      Cancelada: { label: "Cancelada", variant: "destructive" },
    } as const;
    const s = (situation || "").trim();
    return map[s] || { label: s || "-", variant: "outline" };
  };

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

  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
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
                  const badge = getSituationBadge(status);
                  const todayReservation =
                    hasReservation && isToday(reservation?.dt_checkin);
                  const canCheckin =
                    todayReservation &&
                    ["Reservada", "Confirmada"].includes(status);
                  const customerName =
                    reservation?.customer?.name || reservation?.customer_name;

                  return (
                    <Card
                      key={apt.id}
                      className={`relative overflow-hidden ${
                        todayReservation ? "ring-2 ring-amber-500/40" : ""
                      }`}
                    >
                      {todayReservation && (
                        <div className="absolute right-2 top-2">
                          <Badge className="bg-amber-500 text-white hover:bg-amber-500/90">
                            Hoje
                          </Badge>
                        </div>
                      )}
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">
                            Apt. {apt.name}
                          </CardTitle>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                        {apt.category && (
                          <span className="text-xs text-muted-foreground">
                            {apt.category}
                          </span>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {hasReservation ? (
                          <div className="text-sm space-y-1">
                            {customerName ? (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Hóspede:
                                </span>
                                <span className="truncate max-w-[55%] text-right">
                                  {customerName}
                                </span>
                              </div>
                            ) : null}
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Entrada:
                              </span>
                              <span>
                                {formatDateWithTime(reservation.dt_checkin)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-muted-foreground">
                                Saída:
                              </span>
                              <span>
                                {formatDateWithTime(reservation.dt_checkout)}
                              </span>
                            </div>
                            {reservation.amount ? (
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Valor:
                                </span>
                                <span>
                                  R$ {Number(reservation.amount).toFixed(2)}
                                </span>
                              </div>
                            ) : null}

                            {canCheckin ? (
                              <Button
                                size="sm"
                                className="mt-2 w-full"
                                onClick={() =>
                                  openConfirm({
                                    id: reservation.id,
                                    aptName: apt.name,
                                    dt_checkin: reservation.dt_checkin,
                                  })
                                }
                                disabled={doingCheckin}
                              >
                                <LogIn className="w-4 h-4 mr-2" />
                                {doingCheckin
                                  ? "Processando..."
                                  : "Fazer check-in"}
                              </Button>
                            ) : null}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Sem reserva ativa.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />

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
    </div>
  );
};

export default AccommodationPage;
