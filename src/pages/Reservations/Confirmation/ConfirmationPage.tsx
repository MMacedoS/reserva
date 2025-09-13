import { Sidebar } from "@/components/layout/Sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RESERVATION_TYPES } from "@/constants/reservations";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetReservations } from "@/http/reservations/getReservations";
import { getReservationsOffline, saveReservationsOffline } from "@/lib/offline";
import { useEffect, useState } from "react";

function useOnlineStatus() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  return online;
}
import { addDays } from "date-fns";
import {
  Loader2,
  LucideDollarSign,
  LucideListFilter,
  LucideTrash2,
} from "lucide-react";
import { Label } from "recharts";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import { PaymentsDialog } from "../Accommodation/Components/PaymentsDialog";
import type { Reservation } from "@/http/types/reservations/Reservation";

const ConfirmationPage = () => {
  const hoje = new Date();
  const dataInicialPadrao = addDays(hoje, -5).toISOString().split("T")[0];
  const dataFinalPadrao = addDays(hoje, 7).toISOString().split("T")[0];

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(dataInicialPadrao);
  const [endDate, setEndDate] = useState(dataFinalPadrao);
  const [situation, setSituation] = useState("Confirmada");
  const [type, setType] = useState("");
  const [paymentOpen, setPaymentOpen] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const [activeReservation, setActiveReservation] = useState<Reservation>();

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) setPage(1);
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, situation, type]);

  const online = useOnlineStatus();
  const { data: accommodations, isLoading } = useGetReservations({
    page,
    limit: 10,
    search: debouncedSearchQuery,
    startDate,
    endDate,
    situation,
    type,
  });

  const [offlineAccommodations, setOfflineAccommodations] = useState<any[]>([]);

  useEffect(() => {
    if (
      online &&
      accommodations &&
      Array.isArray(accommodations.data) &&
      accommodations.data.length > 0
    ) {
      saveReservationsOffline(accommodations.data);
    }
  }, [online, accommodations]);

  useEffect(() => {
    if (!online) {
      getReservationsOffline().then((data) => {
        setOfflineAccommodations(Array.isArray(data) ? data : []);
      });
    }
  }, [online]);

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(dataInicialPadrao);
    setEndDate(dataFinalPadrao);
    setPage(1);
    setSituation("Confirmada");
    setType("");
  };

  const hasActiveFilters =
    !!searchQuery ||
    !!situation ||
    !!type ||
    startDate !== dataInicialPadrao ||
    endDate !== dataFinalPadrao;
  return (
    <Sidebar>
      <Card>
        <CardContent>
          <Accordion type="single" collapsible className="w-full mb-4">
            <AccordionItem value="item-1" className="w-full">
              <AccordionTrigger>
                <div className="flex justify-between w-full">
                  <span className="flex items-center gap-2">
                    Filtros <LucideListFilter className="h-4 w-4" />
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="filter mb-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    <div className="lg:col-span-2 xl:col-span-1">
                      <Label className="text-sm">Buscar:</Label>
                      <Input
                        type="text"
                        placeholder="Buscar por cliente, código..."
                        className="mt-1"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="min-w-[150px]">
                      <Label className="text-sm">Data inicial:</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        value={startDate}
                        max={endDate || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div className="min-w-[150px]">
                      <Label className="text-sm">Data final:</Label>
                      <Input
                        type="date"
                        className="mt-1"
                        value={endDate}
                        min={startDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                    <div className="w-full">
                      <Label className="text-sm">Situação:</Label>
                      <Select
                        value={situation}
                        onValueChange={(value) => setSituation(value)}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          <SelectItem value="Confirmada">Confirmada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-full">
                      <Label className="text-sm">Tipo:</Label>
                      <Select
                        value={type}
                        onValueChange={(value) => setType(value)}
                      >
                        <SelectTrigger className="mt-1 w-full">
                          <SelectValue placeholder="Todos os tipos" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                          {RESERVATION_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="flex items-center gap-2"
                    title="Limpar filtros"
                  >
                    <LucideTrash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Limpar</span>
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Card>
            <CardContent className="h-96 flex items-start justify-start flex-wrap overflow-auto">
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="animate-spin size-6 text-gray-500" />
                </div>
              ) : online ? (
                accommodations && accommodations?.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {accommodations.data.map((apt: any) => {
                      const reservation = apt;
                      if (!reservation) return null;
                      return (
                        <Card
                          key={reservation.id}
                          className="shadow-lg border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-green-100"
                        >
                          <CardContent>
                            <div className="flex items-center gap-3 mb-2">
                              <div className="flex-shrink-0 w-10 h-10 rounded-full animate-pulse bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
                                {reservation.customer?.name?.[0] || "?"}
                              </div>
                              <div>
                                <div className="font-semibold text-md text-green-900">
                                  {reservation.customer?.name || "Sem nome"}
                                </div>
                                <div className="text-lg text-green-700">
                                  Apto: {apt.apartment.name || "Sem apto"}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 justify-between">
                              <div className="col-span-2 flex flex-col gap-1 mb-2">
                                <span className="text-sm text-gray-600">
                                  <b>Check-in:</b>{" "}
                                  {formatDateWithTime(reservation.checkin)}
                                </span>
                                <span className="text-sm text-gray-600">
                                  <b>Check-out:</b>{" "}
                                  {formatDateWithTime(reservation.checkout)}
                                </span>
                              </div>
                              <div className="flex flex-col items-end">
                                <span className="text-lg font-bold text-green-600 animate-pulse">
                                  {formatValueToBRL(
                                    reservation.paid_amount || 0
                                  )}
                                </span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-700">
                              <b>Tipo:</b> {reservation.type || "-"}
                            </div>
                            <div className="text-sm text-gray-700">
                              <b>Situação:</b> {reservation.situation || "-"}
                            </div>
                          </CardContent>
                          <CardAction className="justify-end flex mt-2 w-full">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-50 mt-4 hover:bg-green-50/80 shadow-md text-green-700"
                              onClick={() => {
                                setActiveReservation(reservation);
                                setPaymentOpen(true);
                              }}
                            >
                              <LucideDollarSign />
                              <span>Adicionar Pagamento</span>
                            </Button>
                          </CardAction>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex justify-center py-10">
                    <Label className="text-gray-500">
                      Nenhum resultado encontrado
                    </Label>
                  </div>
                )
              ) : offlineAccommodations && offlineAccommodations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {offlineAccommodations.map((reservation: any) => (
                    <Card
                      key={reservation.id}
                      className="shadow-lg border border-gray-200 rounded-xl p-4 bg-gradient-to-br from-green-50 to-green-100"
                    >
                      <CardContent>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full animate-pulse bg-green-200 flex items-center justify-center text-green-700 font-bold text-lg">
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
                        <div className="grid grid-cols-3 justify-between">
                          <div className="col-span-2 flex flex-col gap-1 mb-2">
                            <span className="text-sm text-gray-600">
                              <b>Check-in:</b>{" "}
                              {formatDateWithTime(reservation.checkin)}
                            </span>
                            <span className="text-sm text-gray-600">
                              <b>Check-out:</b>{" "}
                              {formatDateWithTime(reservation.checkout)}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-lg font-bold text-green-600 animate-pulse">
                              {formatValueToBRL(reservation.paid_amount || 0)}
                            </span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-700">
                          <b>Tipo:</b> {reservation.type || "-"}
                        </div>
                        <div className="text-sm text-gray-700">
                          <b>Situação:</b> {reservation.situation || "-"}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center py-10">
                  <Label className="text-gray-500">
                    Nenhum resultado encontrado
                  </Label>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
      <PaymentsDialog
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        reservation={activeReservation}
      />
    </Sidebar>
  );
};

export default ConfirmationPage;
