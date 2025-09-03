import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { Sidebar } from "@/components/layout/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useNavigate } from "react-router-dom";
import { useSidebar } from "@/contexts/SidebarContext";
import {
  useDashboardCheckinToday,
  useDashboardCheckoutToday,
  useDashboardGuests,
  useDashboardDailyRevenue,
  useDashboardApartments,
} from "@/http/dashboard/dashboardRequests";
import { Spinner } from "@/components/ui/spinner";

function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { data: apartmentsRes = {} } = useDashboardApartments();
  const { data: checkinTodayRes = {}, isLoading: loadingCheckin } =
    useDashboardCheckinToday();
  const { data: checkoutTodayRes = {}, isLoading: loadingCheckout } =
    useDashboardCheckoutToday();
  const { data: guestsRes = {}, isLoading: loadingGuests } =
    useDashboardGuests();

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - 6);
  const start = startDate.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];
  const { data: dailyRevenueRes = {}, isLoading: loadingRevenue } =
    useDashboardDailyRevenue({ start, end });

  const apartments = apartmentsRes.data ?? {};
  const checkinToday = checkinTodayRes.data ?? [];
  const checkoutToday = checkoutTodayRes.data ?? [];
  const guests = guestsRes.data ?? 0;
  const dailyRevenue = dailyRevenueRes.data ?? [];

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
            Faturamento Diário (últimos 7 dias)
          </CardTitle>
        </CardHeader>
        <div className="w-full h-[350px] flex items-center justify-center">
          <ChartContainer
            config={{
              revenue: { label: "Faturamento", color: "#7c3aed" },
              axis: { color: "#64748b" },
              background: { color: "#f3f4f6" },
            }}
          >
            {loadingRevenue ? (
              <div className="flex items-center justify-center w-full h-full">
                <Spinner />
              </div>
            ) : (
              <BarChart
                data={dailyRevenue}
                width={window.innerWidth < 600 ? 300 : 500}
                height={300}
              >
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="revenue" fill="var(--color-revenue)" />
              </BarChart>
            )}
          </ChartContainer>
        </div>
      </Card>
    </Sidebar>
  );
}
export default DashboardPage;
