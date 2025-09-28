import { Sidebar } from "@/components/layout/Sidebar";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getApartments } from "@/http/apartments/getApartments";
import { useGetReservations } from "@/http/reservations/getReservations";
import type { Apartment } from "@/http/types/apartments/Apartment";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { Calendar, momentLocalizer } from "react-big-calendar";
import type { Event, View } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "@/styles/calendar-pt-br.css";

// Configurar moment para português brasileiro
moment.updateLocale("pt", {
  months: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthsShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  weekdays: [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ],
  weekdaysShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  weekdaysMin: ["D", "S", "T", "Q", "Q", "S", "S"],
});
moment.locale("pt");
const localizer = momentLocalizer(moment);

interface CustomEvent extends Event {
  reservation?: Reservation;
}

const MapPage = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>("month");
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: apartmentsData, isLoading: loadingApartments } = getApartments(
    1,
    100
  );
  const apartments: Apartment[] = apartmentsData?.data || [];

  const startDate = new Date(year, month, 1).toISOString().slice(0, 10);
  const endDate = new Date(year, month + 1, 0).toISOString().slice(0, 10);

  const { data: reservationsData, isLoading: loadingReservations } =
    useGetReservations({
      startDate,
      endDate,
      limit: 200,
    });

  const reservations: Reservation[] = reservationsData?.data || [];

  const getReservationColor = (status: string) => {
    switch (status) {
      case "Reservada":
        return "#FFA726";
      case "Confirmada":
        return "#66BB6A";
      case "Hospedada":
        return "#42A5F5";
      case "Finalizada":
        return "#9E9E9E";
      default:
        return "#66BB6A";
    }
  };

  const events: CustomEvent[] = useMemo(() => {
    return reservations.map((reservation) => ({
      id: reservation.id,
      title: `Apto ${reservation.apartment?.name} - ${
        reservation.customer?.name || "Cliente"
      }`,
      start: new Date(reservation.checkin),
      end: new Date(reservation.checkout),
      reservation,
    }));
  }, [reservations]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectEvent = (event: CustomEvent) => {
    if (event.reservation) {
      setSelectedReservation(event.reservation);
      setShowDetailsModal(true);
    }
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    const checkinDate = slotInfo.start.toISOString().slice(0, 10);
    navigate(`/reservations/create?checkin_date=${checkinDate}`);
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const closeModal = () => {
    setShowDetailsModal(false);
    setSelectedReservation(null);
  };

  const eventStyleGetter = (event: CustomEvent) => {
    const backgroundColor = event.reservation
      ? getReservationColor(event.reservation.situation)
      : "#66BB6A";

    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
      },
    };
  };

  const getApartmentStatus = (apartment: Apartment) => {
    const hasReservation = reservations.some(
      (reservation) =>
        reservation.apartment?.id === apartment.id &&
        new Date(reservation.checkin) <= new Date() &&
        new Date(reservation.checkout) >= new Date()
    );
    return hasReservation ? "ocupado" : "disponivel";
  };

  const handleCreateReservation = (apartmentId: string) => {
    navigate(`/reservations/create?apartment_id=${apartmentId}`);
  };

  return (
    <Sidebar>
      <div className="container mx-auto max-w-full px-4 py-6">
        <div className="bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <span className="text-gray-500 text-lg">‹</span>
              </button>
              <span className="text-lg font-medium text-gray-700 min-w-[200px] text-center">
                {new Date(year, month)
                  .toLocaleDateString("pt-BR", {
                    month: "long",
                    year: "numeric",
                  })
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <span className="text-gray-500 text-lg">›</span>
              </button>
            </div>

            <button
              onClick={handleToday}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded border border-blue-300 hover:bg-blue-50"
            >
              Hoje
            </button>
          </div>

          <div style={{ height: "600px" }} className="p-4">
            {loadingApartments || loadingReservations ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-500">Carregando...</div>
              </div>
            ) : (
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%" }}
                onSelectEvent={handleSelectEvent}
                onSelectSlot={handleSelectSlot}
                onView={handleViewChange}
                eventPropGetter={eventStyleGetter}
                date={currentDate}
                onNavigate={setCurrentDate}
                view={currentView}
                selectable={true}
                messages={{
                  next: "Próximo",
                  previous: "Anterior",
                  today: "Hoje",
                  month: "Mês",
                  week: "Semana",
                  day: "Dia",
                  agenda: "Agenda",
                  date: "Data",
                  time: "Horário",
                  event: "Reserva",
                  noEventsInRange: "Não há reservas neste período",
                  allDay: "Dia todo",
                  work_week: "Semana de trabalho",
                  yesterday: "Ontem",
                  tomorrow: "Amanhã",
                  showMore: (total) => `+${total} mais`,
                }}
                views={["month", "week", "day"]}
                culture="pt-BR"
              />
            )}
          </div>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4 gap-2">
              <h3 className="text-lg font-semibold text-gray-800">
                Apartamentos
              </h3>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-green-500"></span>
                  <span>Disponível</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded bg-red-500"></span>
                  <span>Ocupado</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {apartments.map((apartment) => {
                const status = getApartmentStatus(apartment);
                return (
                  <div
                    key={apartment.id}
                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      status === "disponivel"
                        ? "border-green-300 bg-green-100 hover:bg-green-200"
                        : "border-red-300 bg-red-100 hover:bg-red-200"
                    }`}
                    onClick={() =>
                      status === "disponivel" &&
                      handleCreateReservation(apartment.id || "")
                    }
                  >
                    <div className="text-center">
                      <div className="font-bold text-lg text-gray-800 mb-1">
                        {apartment.name}
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {apartment.category}
                      </div>
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-full \${
                        status === 'disponivel' 
                          ? 'bg-green-200 text-green-800' 
                          : 'bg-red-200 text-red-800'
                      }`}
                      >
                        {status === "disponivel" ? "Disponível" : "Ocupado"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-t border-gray-200">
            <div className="flex gap-8 text-xs">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">
                  Status das Reservas
                </h4>
                <div className="flex gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: "#FFA726" }}
                    ></span>
                    <span>Reservada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: "#66BB6A" }}
                    ></span>
                    <span>Confirmada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: "#42A5F5" }}
                    ></span>
                    <span>Hospedada</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: "#9E9E9E" }}
                    ></span>
                    <span>Finalizada</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDetailsModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Detalhes da Reserva A-
                {selectedReservation.code || selectedReservation.id}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Informações do Cliente
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Nome:
                    </label>
                    <p className="text-gray-800 font-medium">
                      {selectedReservation.customer?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      CPF:
                    </label>
                    <p className="text-gray-800">
                      {selectedReservation.customer?.pessoa_fisica_id || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Detalhes da Reserva
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Apartamento:
                    </label>
                    <p className="text-gray-800 font-medium">
                      {selectedReservation.apartment?.name || "N/A"} -{" "}
                      {selectedReservation.apartment?.category || "N/A"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Status:
                    </label>
                    <span
                      className="inline-block px-3 py-1 rounded-full text-xs font-medium text-white ml-2"
                      style={{
                        backgroundColor: getReservationColor(
                          selectedReservation.situation
                        ),
                      }}
                    >
                      {selectedReservation.situation}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Check-in:
                    </label>
                    <p className="text-gray-800 font-medium">
                      {new Date(selectedReservation.checkin).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Check-out:
                    </label>
                    <p className="text-gray-800 font-medium">
                      {new Date(
                        selectedReservation.checkout
                      ).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Hóspedes:
                    </label>
                    <p className="text-gray-800 font-medium">
                      {selectedReservation.guests || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Informações Financeiras
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Valor Estimado:
                    </label>
                    <p className="text-gray-800 font-medium">
                      R${" "}
                      {parseFloat(
                        selectedReservation.estimated_value?.toString() || "0"
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Valor Total:
                    </label>
                    <p className="text-gray-800 font-bold text-lg">
                      R${" "}
                      {parseFloat(
                        selectedReservation.total_reservation_value?.toString() ||
                          selectedReservation.estimated_value?.toString() ||
                          "0"
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Consumo:
                    </label>
                    <p className="text-gray-800 font-medium">
                      R${" "}
                      {parseFloat(
                        selectedReservation.consumption_value?.toString() || "0"
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Valor Pago:
                    </label>
                    <p className="text-gray-800 font-medium">
                      R${" "}
                      {parseFloat(
                        selectedReservation.paid_value?.toString() || "0"
                      ).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {(() => {
                  const total = parseFloat(
                    selectedReservation.total_reservation_value?.toString() ||
                      selectedReservation.estimated_value?.toString() ||
                      "0"
                  );
                  const pago = parseFloat(
                    selectedReservation.paid_value?.toString() || "0"
                  );
                  const saldo = total - pago;

                  return saldo > 0 ? (
                    <div className="mt-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-yellow-800">
                          Saldo Devedor:
                        </span>
                        <span className="text-lg font-bold text-yellow-800">
                          R${" "}
                          {saldo.toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ) : saldo < 0 ? (
                    <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 rounded">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-green-800">
                          Crédito:
                        </span>
                        <span className="text-lg font-bold text-green-800">
                          R${" "}
                          {Math.abs(saldo).toLocaleString("pt-BR", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 rounded">
                      <div className="flex justify-center items-center">
                        <span className="text-sm font-medium text-green-800">
                          ✓ Totalmente Pago
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                onClick={() => {
                  navigate(`/reservations/edit/${selectedReservation.id}`);
                }}
              >
                Editar Reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </Sidebar>
  );
};

export default MapPage;
