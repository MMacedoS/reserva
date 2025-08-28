import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import {
  LogIn,
  LucideCalendarDays,
  LucideDollarSign,
  LucideEdit2,
  LucideLogOut,
  LucideShoppingBasket,
} from "lucide-react";

type Props = {
  apt: any;
  doingCheckin?: boolean;
  canCheckin: boolean;
  todayReservation: boolean;
  onCheckin: () => void;
  onAddConsumption: () => void;
  onAddPayment: () => void;
  onAddPerDiem: () => void;
  onEdit: () => void;
  onCheckout: () => void;
};

export function AccommodationCard({
  apt,
  doingCheckin,
  canCheckin,
  todayReservation,
  onCheckin,
  onAddConsumption,
  onAddPayment,
  onAddPerDiem,
  onEdit,
  onCheckout,
}: Props) {
  const reservation = apt.reservation;
  const hasReservation = !!reservation;
  const status = reservation?.situation || apt.situation;
  const customerName =
    reservation?.customer?.name || reservation?.customer_name;

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
  const badge = getSituationBadge(status);

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
          <CardTitle className="text-lg">Apt. {apt.name}</CardTitle>
          <Badge variant={badge.variant}>{badge.label}</Badge>
        </div>
        {apt.category && (
          <span className="text-xs text-muted-foreground">{apt.category}</span>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        {hasReservation ? (
          <>
            <div className="text-sm space-y-1">
              {customerName ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Hóspede:</span>
                  <span className="truncate max-w-[55%] text-right">
                    {customerName}
                  </span>
                </div>
              ) : null}

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Entrada:</span>
                <span>{formatDateWithTime(reservation.checkin)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Saída:</span>
                <span>{formatDateWithTime(reservation.checkout)}</span>
              </div>

              {reservation.amount ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valor:</span>
                  <span>{formatValueToBRL(reservation.amount)}</span>
                </div>
              ) : null}

              {reservation.estimated_value ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valor estimado:</span>
                  <span>
                    {formatValueToBRL(
                      reservation.estimated_value +
                        reservation.consumption_value
                    )}
                  </span>
                </div>
              ) : null}

              {reservation.paid_amount ? (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Valor pago:</span>
                  <span>{formatValueToBRL(reservation.paid_amount)}</span>
                </div>
              ) : null}

              {canCheckin ? (
                <Button
                  size="sm"
                  className="mt-2 w-full"
                  onClick={onCheckin}
                  disabled={doingCheckin}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  {doingCheckin ? "Processando..." : "Fazer check-in"}
                </Button>
              ) : null}
            </div>

            {status === "Hospedada" && (
              <div className="pt-3 mt-3 border-t flex flex-wrap gap-2 justify-center">
                <Button size="sm" variant="outline" onClick={onAddConsumption}>
                  <LucideShoppingBasket />
                </Button>

                <Button size="sm" variant="outline" onClick={onAddPayment}>
                  <LucideDollarSign />
                </Button>

                <Button size="sm" variant="outline" onClick={onAddPerDiem}>
                  <LucideCalendarDays />
                </Button>

                <Button size="sm" variant="outline" onClick={onEdit}>
                  <LucideEdit2 />
                </Button>

                <Button size="sm" variant="destructive" onClick={onCheckout}>
                  <LucideLogOut />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            Sem reserva ativa.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
