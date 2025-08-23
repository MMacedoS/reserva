import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import { useSidebar } from "@/contexts/SidebarContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Spinner } from "@/components/ui/spinner";
import { useReservationsFinancialReport } from "@/http/reservations/reports/getReservationsFinancialReport";
import { useReservationsStatusReport } from "@/http/reservations/reports/getReservationsStatusReport";
import { useReservationsCountReport } from "@/http/reservations/reports/getReservationsCountReport";
import { formatValueToBRL } from "@/lib/utils";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { LucideDownload } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const chartConfig: Record<string, { label: string; color: string }> = {
  Confirmada: { label: "Confirmadas", color: "#22c55e" },
  Cancelada: { label: "Canceladas", color: "#ef4444" },
  Reservada: { label: "Reservadas", color: "#f59e0b" },
  Hospedada: { label: "Hospedadas", color: "#3b82f6" },
  Finalizada: { label: "Finalizadas", color: "#8b5cf6" },
  Apagada: { label: "Apagadas", color: "#6b7280" },
};

export default function ReservationsReportPage() {
  const hoje = new Date();
  const dataInicialPadrao = addDays(hoje, -7).toISOString().split("T")[0];
  const dataFinalPadrao = hoje.toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(dataInicialPadrao);
  const [endDate, setEndDate] = useState(dataFinalPadrao);
  const { sidebarToggle } = useSidebar();

  const {
    data: financial,
    isLoading: loadingFinancial,
    error: errorFinancial,
  } = useReservationsFinancialReport({
    startDate,
    endDate,
    enabled: !!startDate && !!endDate,
  });
  const {
    data: statusData,
    isLoading: loadingStatus,
    error: errorStatus,
  } = useReservationsStatusReport({
    startDate,
    endDate,
    enabled: !!startDate && !!endDate,
  });
  const {
    data: countData,
    isLoading: loadingCount,
    error: errorCount,
  } = useReservationsCountReport({
    startDate,
    endDate,
    enabled: !!startDate && !!endDate,
  });

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Relatório de Reservas", 14, 22);
    doc.setFontSize(12);
    doc.text(
      `Período: ${format(new Date(startDate), "dd/MM/yyyy", {
        locale: ptBR,
      })} - ${format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}`,
      14,
      35
    );

    let y = 45;
    if (financial) {
      doc.text(
        `Faturamento: ${formatValueToBRL(financial.total_revenue || 0)}`,
        14,
        y
      );
      y += 7;
      doc.text(`Canceladas: ${financial.total_canceled || 0}`, 14, y);
      y += 7;
      doc.text(`Confirmadas: ${financial.total_confirmed || 0}`, 14, y);
      y += 7;
      if (financial.average_ticket !== undefined) {
        doc.text(
          `Ticket Médio: ${formatValueToBRL(financial.average_ticket)}`,
          14,
          y
        );
        y += 7;
      }
    }

    if (statusData?.length) {
      const tableData = statusData.map((s) => [s.status, s.count]);
      autoTable(doc, {
        head: [["Status", "Quantidade"]],
        body: tableData,
        startY: y + 5,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [59, 130, 246] },
      });
    }

    doc.save(`relatorio-reservas-${format(new Date(), "ddMMyyyy-HHmm")}.pdf`);
    alert("PDF gerado com sucesso!");
  };

  const generateExcel = () => {
    const wb = XLSX.utils.book_new();

    const resumo = [
      [
        "Período",
        `${format(new Date(startDate), "dd/MM/yyyy")} - ${format(
          new Date(endDate),
          "dd/MM/yyyy"
        )}`,
      ],
      ["Faturamento", financial?.total_revenue || 0],
      ["Canceladas", financial?.total_canceled || 0],
      ["Confirmadas", financial?.total_confirmed || 0],
      ["Ticket Médio", financial?.average_ticket || 0],
    ];
    const wsResumo = XLSX.utils.aoa_to_sheet(resumo);
    XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

    if (statusData?.length) {
      const wsStatus = XLSX.utils.json_to_sheet(statusData);
      XLSX.utils.book_append_sheet(wb, wsStatus, "Status");
    }

    if (countData?.by_day?.length) {
      const wsCount = XLSX.utils.json_to_sheet(countData.by_day);
      XLSX.utils.book_append_sheet(wb, wsCount, "Contagem por dia");
    }

    XLSX.writeFile(
      wb,
      `relatorio-reservas-${format(new Date(), "ddMMyyyy-HHmm")}.xlsx`
    );
    alert("Excel gerado com sucesso!");
  };

  const pieData = (statusData || []).map((s) => ({
    name: s.status,
    value: s.count,
    color: chartConfig[s.status]?.color || "#6b7280",
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div
        className={`flex-1 transition-all duration-300 ${
          sidebarToggle ? "ml-0" : "ml-50"
        }`}
      >
        <div className="container mx-auto p-6 space-y-6 py-20">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Relatórios de Reservas</h1>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="startDate">Data Inicial</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">Data Final</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button onClick={generatePDF} variant="outline">
                    <LucideDownload className="w-4 h-4 mr-2" /> PDF
                  </Button>
                  <Button onClick={generateExcel} variant="outline">
                    <LucideDownload className="w-4 h-4 mr-2" /> Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {(loadingFinancial || loadingStatus || loadingCount) && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {(errorFinancial || errorStatus || errorCount) && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-red-600">Erro ao carregar relatórios.</p>
              </CardContent>
            </Card>
          )}

          {financial && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Faturamento</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatValueToBRL(financial.total_revenue || 0)}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Confirmadas</p>
                  <p className="text-2xl font-bold">
                    {financial.total_confirmed || 0}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-gray-600">Canceladas</p>
                  <p className="text-2xl font-bold">
                    {financial.total_canceled || 0}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Reservas por Dia</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countData?.by_day || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={(entry as any).color}
                          />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Faturamento Diário</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={financial?.daily || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="value" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
