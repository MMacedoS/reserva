import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import {
  useDashboardCheckinToday,
  useDashboardCheckoutToday,
  useDashboardGuests,
  useDashboardDailyRevenue,
  useDashboardApartments,
} from "@/http/dashboard/dashboardRequests";
import { Spinner } from "@/components/ui/spinner";
import { formatDate } from "@/lib/utils";
import ListReservations from "./components/ListReservations";
import type { Reservation } from "@/http/types/reservations/Reservation";

function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [selectReservations, setSelectReservations] = useState<Reservation[]>(
    []
  );
  const [type, setType] = useState<"checkin" | "checkout">("checkin");
  const { data: apartmentsRes = {} } = useDashboardApartments();
  const { data: checkinTodayRes = {}, isLoading: loadingCheckin } =
    useDashboardCheckinToday();
  const { data: checkoutTodayRes = {}, isLoading: loadingCheckout } =
    useDashboardCheckoutToday();
  const { data: guestsRes = {}, isLoading: loadingGuests } =
    useDashboardGuests();

  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 6);
    return d.toISOString().split("T")[0];
  });
  const [end, setEnd] = useState(() => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  });

  const {
    data: dailyRevenueRes,
    isLoading: loadingRevenue,
    refetch,
  } = useDashboardDailyRevenue({ start, end });

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "start" | "end"
  ) => {
    if (type === "start") setStart(e.target.value);
    else setEnd(e.target.value);
  };

  useEffect(() => {
    refetch && refetch();
  }, [start, end]);

  const apartments = apartmentsRes.data ?? {};
  const checkinToday = Array.isArray(checkinTodayRes) ? checkinTodayRes : [];
  const checkoutToday = Array.isArray(checkoutTodayRes) ? checkoutTodayRes : [];
  const guests = guestsRes.data ?? 0;

  const getChartData = () => {
    if (!dailyRevenueRes?.revenue) return [];
    return dailyRevenueRes.revenue.map((item: any) => ({
      date: formatDate(item.date),
      ...item.types,
    }));
  };

  const totalInterval = getChartData().reduce((acc: number, item: any) => {
    const sum = Object.keys(item)
      .filter((key) => key !== "date")
      .reduce((a, k) => a + Number(item[k]), 0);
    return acc + sum;
  }, 0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <Sidebar>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-md rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-700">Apartamentos</CardTitle>
            <CardAction
              onClick={() => {
                navigate("/apartments");
              }}
              className="bg-blue-700 rounded-3xl text-sm p-2 border-2 shadow-2xl text-white cursor-pointer"
            >
              Ver
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">
              Total: {apartments.max ?? 0}
            </p>
            <p className="text-lg text-accent-foreground">
              Ocupados: {apartments.occupied ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-xl bg-gradient-to-br from-green-50 to-green-100">
          <CardHeader>
            <CardTitle className="text-green-700">Check-in Hoje</CardTitle>
            <CardAction
              onClick={() => {
                setOpen(true);
                setSelectReservations(checkinToday);
                setType("checkin");
              }}
              className="bg-green-700 rounded-3xl text-sm p-2 border-2 shadow-2xl text-white cursor-pointer"
            >
              Ver
            </CardAction>
          </CardHeader>
          <CardContent>
            {loadingCheckin ? (
              <Spinner />
            ) : (
              <p className="text-lg font-semibold">
                {checkinToday.length} reservas
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100">
          <CardHeader>
            <CardTitle className="text-yellow-700">
              Checkout Hoje/Atrasados
            </CardTitle>
            <CardAction
              onClick={() => {
                setOpen(true);
                setSelectReservations(checkoutToday);
                setType("checkout");
              }}
              className="bg-yellow-700 rounded-3xl text-sm p-2 border-2 shadow-2xl text-white cursor-pointer"
            >
              Ver
            </CardAction>
          </CardHeader>
          <CardContent>
            {loadingCheckout ? (
              <Spinner />
            ) : (
              <p className="text-lg font-semibold">
                {checkoutToday.length} reservas
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="shadow-md rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
          <CardHeader>
            <CardTitle className="text-purple-700">Lotação</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingGuests ? (
              <Spinner />
            ) : (
              <p className="text-lg font-semibold">
                {guests.current_guests}{" "}
                <span className="font-medium">Hóspede(s)</span>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
      <Card className="shadow-lg rounded-xl p-4 bg-white">
        <CardHeader>
          <CardTitle className="text-indigo-700">
            Faturamento Diário (intervalo personalizado)
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center mb-4">
          <label>
            Início:
            <input
              type="date"
              value={start}
              onChange={(e) => handleDateChange(e, "start")}
              className="ml-2 border rounded px-2 py-1"
            />
          </label>
          <label>
            Fim:
            <input
              type="date"
              value={end}
              onChange={(e) => handleDateChange(e, "end")}
              className="ml-2 border rounded px-2 py-1"
            />
          </label>
          <div className="col-span-2 justify-end flex">
            <span className="ml-auto text-2xl font-bold text-green-700 bg-green-100 px-4 py-2 rounded shadow">
              Total: R${" "}
              {totalInterval.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
        <div>
          {loadingRevenue ? (
            <Spinner />
          ) : (
            <ChartContainer
              config={{
                revenue: { label: "Faturamento", color: "#7c3aed" },
                axis: { color: "#64748b" },
                background: { color: "#f3f4f6" },
              }}
              className="h-[300px] w-full overflow-auto"
            >
              <BarChart data={getChartData()} width={500} height={300}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="cash" fill="#22c55e" name="Dinheiro" />
                <Bar dataKey="debit_card" fill="#a855f7" name="Cartão Debito" />
                <Bar
                  dataKey="credit_card"
                  fill="#f97316"
                  name="Cartão Crédito"
                />
                <Bar dataKey="pix" fill="#3b82f6" name="Pix" />
                <Bar dataKey="transfer" fill="#f97316" name="Transferência" />
              </BarChart>
            </ChartContainer>
          )}
        </div>
      </Card>
      <ListReservations
        open={open}
        onClose={() => setOpen(false)}
        reservations={selectReservations}
        type={type}
      />
    </Sidebar>
  );
}
export default DashboardPage;
