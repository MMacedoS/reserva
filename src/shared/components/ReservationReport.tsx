import { useMemo, useRef } from "react";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface ReservationReportProps {
  reservation: Reservation | null;
  observation?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationReport({
  reservation,
  observation,
  open,
  onOpenChange,
}: ReservationReportProps) {
  if (!reservation) return null;

  const printRef = useRef<HTMLDivElement>(null);

  const { nights, totalReservation, consumption, paid, balance, change } =
    useMemo(() => {
      const checkin = reservation.checkin
        ? new Date(reservation.checkin)
        : null;
      const checkout = reservation.checkout
        ? new Date(reservation.checkout)
        : null;
      const dayMs = 1000 * 60 * 60 * 24;
      const rawNights =
        checkin && checkout
          ? Math.max(
              1,
              Math.round((checkout.getTime() - checkin.getTime()) / dayMs)
            )
          : undefined;

      const totalReservation = Number(reservation.total_reservation ?? 0);
      const consumption = Number(reservation.consumption_value ?? 0);
      const paid = Number(reservation.paid_amount ?? 0);
      const balance = Math.max(consumption - paid, 0);
      const change = Math.max(paid - consumption, 0);

      return {
        nights: rawNights,
        totalReservation,
        consumption,
        paid,
        balance,
        change,
      };
    }, [reservation]);

  const handlePrint = () => {
    const node = printRef.current;
    if (!node) return;

    const printWindow = window.open("", "_blank", "width=1024,height=768");
    if (!printWindow) return;

    const head = document.head.innerHTML;
    const content = node.innerHTML;
    const pageTitle = `Nota de Cliente – ${reservation.code ?? "Reserva"}`;
    printWindow.document.open();
    printWindow.document.write(
      `<!doctype html><html><head><title>${pageTitle}</title>${head}<style>@page{margin:16mm}body{padding:0;margin:0;background:#fff}</style></head><body>${content}</body></html>`
    );
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const shareText = useMemo(() => {
    const parts: string[] = [];
    parts.push(`Nota de Cliente – ${reservation.code ?? "Reserva"}`);
    parts.push("");
    parts.push(`Cliente: ${reservation.customer?.name ?? "—"}`);
    parts.push(
      `Período: ${formatDateWithTime(
        reservation.checkin
      )} até ${formatDateWithTime(reservation.checkout)}`
    );
    parts.push(
      `Apartamento: ${reservation.apartment?.name || "N/A"} • Hóspedes: ${
        reservation.guests ?? "N/A"
      }${typeof nights !== "undefined" ? ` • Diárias: ${nights}` : ""}`
    );
    parts.push("");
    parts.push(`Valores:`);
    parts.push(`- Total da Reserva: ${formatValueToBRL(totalReservation)}`);
    parts.push(`- Consumido: ${formatValueToBRL(consumption)}`);
    parts.push(`- Pago: ${formatValueToBRL(paid)}`);
    if (balance > 0) {
      parts.push(`- Saldo a pagar: ${formatValueToBRL(balance)}`);
    }
    if (observation) {
      parts.push("");
      parts.push(`Observações: ${observation}`);
    }
    try {
      if (typeof window !== "undefined" && window.location?.href) {
        parts.push("");
        parts.push(`Link: ${window.location.href}`);
      }
    } catch {
      // ignore
    }
    return parts.join("\n");
  }, [
    reservation,
    observation,
    nights,
    totalReservation,
    consumption,
    paid,
    balance,
    change,
  ]);

  const handleShare = async () => {
    const canShare = typeof navigator !== "undefined" && "share" in navigator;
    try {
      if (canShare) {
        await navigator.share({ title: "Nota de Cliente", text: shareText });
        showAutoDismissAlert({
          message: "Compartilhado",
          description:
            "Os detalhes foram enviados pelo app de compartilhamento.",
          duration: 2000,
        });
        return;
      }
      await navigator.clipboard.writeText(shareText);
      showAutoDismissAlert({
        message: "Copiado",
        description:
          "Detalhes da reserva copiados para a área de transferência.",
        duration: 2000,
      });
    } catch {
      showAutoDismissAlert({
        message: "Não foi possível compartilhar",
        description: "Tente novamente ou copie os detalhes manualmente.",
        duration: 2500,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="!max-w-4xl w-[min(90vw,900px)] max-h-[90vh] overflow-scroll">
        <AlertDialogHeader>
          <AlertDialogTitle>Nota de Cliente</AlertDialogTitle>
          <AlertDialogDescription className="mb-4">
            Visualize os dados principais da reserva, valores e observações.
            Você pode imprimir ou salvar em PDF.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div ref={printRef}>
          <Card>
            <CardHeader className="bg-gray-100 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src="/logonome.png"
                    alt="Logo"
                    className="h-8 w-auto hidden print:block"
                  />
                  <CardTitle className="text-lg font-semibold">
                    Nota de Cliente
                  </CardTitle>
                  {!!reservation.situation && (
                    <Badge
                      className="print:opacity-100"
                      variant={
                        reservation.situation === "Cancelada" ||
                        reservation.situation === "Apagada"
                          ? "destructive"
                          : reservation.situation === "Reservada"
                          ? "outline"
                          : reservation.situation === "Finalizada"
                          ? "secondary"
                          : "default"
                      }
                    >
                      {reservation.situation}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 print:hidden">
                  <span className="font-medium">Código:</span>
                  <span className="font-mono bg-white border rounded px-2 py-0.5">
                    {reservation.code ?? "—"}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="ml-1"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(
                          String(reservation.code ?? "")
                        );
                        showAutoDismissAlert({
                          message: "Código copiado",
                          description:
                            "Código da reserva na área de transferência.",
                          duration: 1500,
                        });
                      } catch {
                        // noop
                      }
                    }}
                  >
                    Copiar
                  </Button>
                  <div className="mx-2 h-5 w-px bg-gray-300" />
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    Compartilhar
                  </Button>
                  <Button variant="default" size="sm" onClick={handlePrint}>
                    Imprimir
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 p-6 !break-inside-avoid">
              {/* Dados da reserva */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Dados da reserva
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Situação</span>
                    <span className="font-medium">{reservation.situation}</span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Código</span>
                    <span className="font-medium font-mono">
                      {reservation.code ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Cliente</span>
                    <span className="font-medium">
                      {reservation.customer?.name ?? "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Entrada</span>
                    <span className="font-medium">
                      {formatDateWithTime(reservation.checkin)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Saída</span>
                    <span className="font-medium">
                      {formatDateWithTime(reservation.checkout)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Apartamento</span>
                    <span className="font-medium">
                      {reservation.apartment?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Hóspedes</span>
                    <span className="font-medium">
                      {reservation.guests ?? "N/A"}
                    </span>
                  </div>
                  {typeof nights !== "undefined" && (
                    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                      <span className="text-gray-600">Diárias</span>
                      <span className="font-medium">{nights}</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Valores */}
              <section>
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Valores
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-700">
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">
                      Valor Total da Reserva
                    </span>
                    <span className="font-medium">
                      {formatValueToBRL(totalReservation)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Valor consumido</span>
                    <span className="font-medium">
                      {formatValueToBRL(consumption)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                    <span className="text-gray-600">Valor pago</span>
                    <span className="font-medium">
                      {formatValueToBRL(paid)}
                    </span>
                  </div>
                  {balance > 0 ? (
                    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                      <span className="text-gray-600">Saldo a pagar</span>
                      <span className="font-semibold text-red-600">
                        {formatValueToBRL(balance)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between sm:justify-start sm:gap-2">
                      <span className="text-gray-600">...</span>
                    </div>
                  )}
                </div>
              </section>

              {/* Observações */}
              {observation && (
                <section>
                  <h3 className="text-sm font-semibold text-gray-800 mb-2">
                    Observações
                  </h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap border border-dashed rounded-md p-3 bg-gray-50">
                    {observation}
                  </p>
                </section>
              )}
            </CardContent>
          </Card>
        </div>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>Fechar</AlertDialogCancel>
          <AlertDialogAction onClick={handlePrint}>Imprimir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
