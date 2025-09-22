import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { formatDateWithTime, formatValueToBRL, textSlice } from "@/lib/utils";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="text-left underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-sm"
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {textSlice(title, 20)}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-72">
        <p className="text-sm">
          <strong>{title}</strong>
        </p>
        {type === "reservation" && reservation && (
          <div className="mt-2">
            <strong className="text-muted-foreground text-center">
              Detalhes:
            </strong>
            <div className="mt-1 space-y-1">
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
      </PopoverContent>
    </Popover>
  );
};

export default HoverCardToReserva;
