import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { formatDateWithTime, formatValueToBRL, textSlice } from "@/lib/utils";

type HoverCardToReservaProps = {
  title: string;
  type: string;
  reservation?: Reservation;
};

const HoverCardToReserva = ({
  title,
  type,
  reservation,
}: HoverCardToReservaProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>{textSlice(title, 20)}</HoverCardTrigger>
      <HoverCardContent>
        <p className="text-sm ">
          <strong>{title}</strong>
        </p>
        {type === "reservation" && reservation && (
          <div className="mt-2">
            <strong className="text-muted-foreground text-center">
              Detalhes:
            </strong>
            <div className="mt-1">
              <p className="text-muted-foreground">
                <strong>Hóspede:</strong> {reservation.customer?.name}
              </p>
              <p className="text-muted-foreground">
                <strong>Apartamento:</strong> {reservation.apartment?.name}
              </p>
              <p className="text-muted-foreground">
                <strong>Check-in:</strong>{" "}
                {formatDateWithTime(reservation.checkin)}
              </p>
              <p className="text-muted-foreground">
                <strong>Check-out:</strong>{" "}
                {formatDateWithTime(reservation.checkout)}
              </p>
              <p className="text-muted-foreground">
                <strong>Valor:</strong> {formatValueToBRL(reservation.amount)}
              </p>
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  );
};

export default HoverCardToReserva;
