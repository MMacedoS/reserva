import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable } from "@/components/ui/DataTable";
import { Spinner } from "@/components/ui/spinner";
import { PermissionGuard } from "@/components/PermissionGuard";
import { useTransactionsReport } from "@/http/finance/transactions/getTransactionsReport";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  LucideDownload,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideDroplet,
  LucideDollarSign,
} from "lucide-react";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";
import type { ColumnDef } from "@tanstack/react-table";
import type { Transaction } from "@/http/types/finance/transaction/Transaction";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => {
      const code = row.getValue("code") as number;
      return <div className="font-medium text-sm">{code || "N/A"}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("description")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: "Valor",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="text-sm text-gray-600">{formatValueToBRL(amount)}</div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Tipo",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return <div className="text-sm text-gray-600 capitalize">{type}</div>;
    },
  },
  {
    accessorKey: "created_at",
    header: "Data",
    cell: ({ row }) => {
      const date = row.getValue("created_at") as string;
      return (
        <div className="text-sm text-gray-600">
          {date ? formatDateWithTime(date) : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "payment_form",
    header: "Forma de Pagamento",
    cell: ({ row }) => {
      const method = row.getValue("payment_form") as string;
      return <div className="text-sm text-gray-600 capitalize">{method}</div>;
    },
  },
];

const chartConfig = {
  entrada: {
    label: "Entradas",
    color: "#22c55e",
  },
  saida: {
    label: "Saídas",
    color: "#ef4444",
  },
  sangria: {
    label: "Sangrias",
    color: "#f97316",
  },
};

export function ReportTransactionsPage() {
  const hoje = new Date();

  const dataInicialPadrao = addDays(hoje, -7).toISOString().split("T")[0];

  const dataFinalPadrao = hoje.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(dataInicialPadrao);

  const [endDate, setEndDate] = useState(dataFinalPadrao);

  const [typeFilter, setTypeFilter] = useState<
    "entrada" | "saida" | "sangria" | "todos"
  >("todos");

  const { data, isLoading, error } = useTransactionsReport({
    startDate,
    endDate,
    type: typeFilter === "todos" ? "" : typeFilter,
    enabled: !!startDate && !!endDate,
  });

  const generatePDF = () => {
    if (!data?.summary?.cashbox_transactions) return;

    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Relatório de Transações", 14, 22);

    doc.setFontSize(12);
    doc.text(
      `Período: ${format(new Date(startDate), "dd/MM/yyyy", {
        locale: ptBR,
      })} - ${format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}`,
      14,
      35
    );

    if (data.summary) {
      doc.text(
        `Total de Entradas: ${formatValueToBRL(data.summary.total_entradas)}`,
        14,
        45
      );
      doc.text(
        `Total de Saídas: ${formatValueToBRL(data.summary.total_saidas)}`,
        14,
        52
      );
      doc.text(
        `Total de Sangrias: ${formatValueToBRL(data.summary.total_sangrias)}`,
        14,
        59
      );
      doc.text(
        `Saldo Final: ${formatValueToBRL(data.summary.saldo_final)}`,
        14,
        66
      );
    }

    const tableData = data.summary.cashbox_transactions.map((transaction) => [
      transaction.code || "N/A",
      transaction.description,
      formatValueToBRL(transaction.amount),
      transaction.type === "entrada"
        ? "Entrada"
        : transaction.type === "saida"
        ? "Saída"
        : "Sangria",
      transaction.payment_form,
      transaction.origin,
      format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm", {
        locale: ptBR,
      }),
    ]);

    autoTable(doc, {
      head: [
        ["Código", "Descrição", "Valor", "Tipo", "Pagamento", "Origem", "Data"],
      ],
      body: tableData,
      startY: 75,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 35 },
      },
    });

    doc.save(`relatorio-transacoes-${format(new Date(), "ddMMyyyy-HHmm")}.pdf`);

    alert("PDF gerado com sucesso!");
  };

  const generateExcel = () => {
    if (!data?.summary?.cashbox_transactions) return;

    const summaryData = [
      ["Resumo Financeiro", ""],
      [
        "Período",
        `${format(new Date(startDate), "dd/MM/yyyy", {
          locale: ptBR,
        })} - ${format(new Date(endDate), "dd/MM/yyyy", { locale: ptBR })}`,
      ],
      ["Total de Entradas", data.summary.total_entradas],
      ["Total de Saídas", data.summary.total_saidas],
      ["Total de Sangrias", data.summary.total_sangrias],
      ["Saldo Final", data.summary.saldo_final],
      ["", ""],
      ["Formas de Pagamento", ""],
      ["Dinheiro", data.summary.money],
      ["PIX", data.summary.pix],
      ["Cartão de Crédito", data.summary.credit_card],
      ["Cartão de Débito", data.summary.debit_card],
      ["Outros", data.summary.others],
      ["", ""],
    ];

    const transactionsData = data.summary.cashbox_transactions.map(
      (transaction) => ({
        Código: transaction.code || "N/A",
        Descrição: transaction.description,
        Valor: transaction.amount,
        Tipo:
          transaction.type === "entrada"
            ? "Entrada"
            : transaction.type === "saida"
            ? "Saída"
            : "Sangria",
        "Forma de Pagamento": transaction.payment_form,
        Origem: transaction.origin,
        Data: format(new Date(transaction.created_at), "dd/MM/yyyy HH:mm", {
          locale: ptBR,
        }),
        Cancelado: transaction.canceled ? "Sim" : "Não",
      })
    );

    const wb = XLSX.utils.book_new();

    const wsResumo = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo");

    const wsTransacoes = XLSX.utils.json_to_sheet(transactionsData);
    XLSX.utils.book_append_sheet(wb, wsTransacoes, "Transações");

    XLSX.writeFile(
      wb,
      `relatorio-transacoes-${format(new Date(), "ddMMyyyy-HHmm")}.xlsx`
    );

    alert("Excel gerado com sucesso!");
  };

  const getChartData = () => {
    if (!data?.summary?.cashbox_transactions) return [];

    const groupedData = data.summary.cashbox_transactions.reduce(
      (acc, transaction) => {
        const date = format(new Date(transaction.created_at), "dd/MM", {
          locale: ptBR,
        });
        if (!acc[date]) {
          acc[date] = { date, entrada: 0, saida: 0, sangria: 0 };
        }
        acc[date][transaction.type as keyof (typeof acc)[typeof date]] +=
          transaction.amount;
        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(groupedData);
  };

  const getPieChartData = () => {
    if (!data?.summary) return [];

    return [
      {
        name: "Entradas",
        value: data.summary.total_entradas,
        color: "#22c55e",
      },
      { name: "Saídas", value: data.summary.total_saidas, color: "#ef4444" },
      {
        name: "Sangrias",
        value: data.summary.total_sangrias,
        color: "#f97316",
      },
    ].filter((item) => item.value > 0);
  };

  const getPaymentMethodsData = () => {
    if (!data?.summary) return [];

    return [
      { name: "Dinheiro", value: data.summary.money, color: "#10b981" },
      { name: "PIX", value: data.summary.pix, color: "#3b82f6" },
      {
        name: "Cartão de Crédito",
        value: data.summary.credit_card,
        color: "#8b5cf6",
      },
      {
        name: "Cartão de Débito",
        value: data.summary.debit_card,
        color: "#f59e0b",
      },
      { name: "Outros", value: data.summary.others, color: "#6b7280" },
    ].filter((item) => item.value > 0);
  };

  return (
    <Sidebar>
      <PermissionGuard requiredPermission={["financial.reports"]}>
        <div className="container space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Relatório de Transações</h1>
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
                <div>
                  <Label htmlFor="type">Tipo</Label>
                  <Select
                    value={typeFilter}
                    onValueChange={(value: any) => setTypeFilter(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="entrada">Entradas</SelectItem>
                      <SelectItem value="saida">Saídas</SelectItem>
                      <SelectItem value="sangria">Sangrias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    onClick={generatePDF}
                    disabled={
                      !data?.summary?.cashbox_transactions ||
                      data.summary.cashbox_transactions.length === 0
                    }
                    variant="outline"
                  >
                    <LucideDownload className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                  <Button
                    onClick={generateExcel}
                    disabled={
                      !data?.summary?.cashbox_transactions ||
                      data.summary.cashbox_transactions.length === 0
                    }
                    variant="outline"
                  >
                    <LucideDownload className="w-4 h-4 mr-2" />
                    Excel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {isLoading && (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          )}

          {error && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-red-600">
                  Erro ao carregar dados: {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          {data?.summary && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <LucideTrendingUp className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Entradas
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {formatValueToBRL(data.summary.total_entradas)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <LucideTrendingDown className="h-8 w-8 text-red-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Saídas
                      </p>
                      <p className="text-2xl font-bold text-red-600">
                        {formatValueToBRL(data.summary.total_saidas)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <LucideDroplet className="h-8 w-8 text-orange-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">
                        Total Sangrias
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {formatValueToBRL(data.summary.total_sangrias)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <LucideDollarSign className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Saldo</p>
                      <p
                        className={`text-2xl font-bold ${
                          data.summary.saldo_final >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {formatValueToBRL(data.summary.saldo_final)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {data?.summary && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Transações por Dia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[300px] w-full overflow-auto"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={getChartData()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="entrada" fill="#22c55e" />
                          <Bar dataKey="saida" fill="#ef4444" />
                          <Bar dataKey="sangria" fill="#f97316" />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição por Tipo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPieChartData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getPieChartData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
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
                    <CardTitle>Formas de Pagamento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={chartConfig}
                      className="h-[300px] w-full"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={getPaymentMethodsData()}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) =>
                              `${name} ${(percent * 100).toFixed(0)}%`
                            }
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {getPaymentMethodsData().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Transações Detalhadas</CardTitle>
                </CardHeader>
                <CardContent className="w-xs md:w-full">
                  <DataTable
                    columns={columns}
                    data={data.summary.cashbox_transactions}
                  />
                </CardContent>
              </Card>
            </>
          )}

          {data?.summary?.cashbox_transactions &&
            data.summary.cashbox_transactions.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    Nenhuma transação encontrada para o período selecionado.
                  </p>
                </CardContent>
              </Card>
            )}
        </div>
      </PermissionGuard>
    </Sidebar>
  );
}
