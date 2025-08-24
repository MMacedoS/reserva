import { useEffect, useMemo, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSidebar } from "@/contexts/SidebarContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { addDays } from "date-fns";
import { Loader2, LucidePencil, LucidePlus, LucideTrash2 } from "lucide-react";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatValueToBRL } from "@/lib/utils";
import { useGetReservations } from "@/http/reservations/getReservations";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { MenuButtons } from "@/shared/components/MenuButtons";
import { ReservationFormDialog } from "./Form/ReservationFormDialog";
import { useDeleteReservation } from "@/http/reservations/deleteReservation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ReservationsPage() {
  const { mutateAsync: deleteReservation } = useDeleteReservation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Reservation | null>(null);

  const columns: ColumnDef<Reservation>[] = useMemo(
    () => [
      { accessorKey: "code", header: "Código" },
      {
        accessorKey: "customer",
        header: "Hospede",
        cell: ({ row }) => <span>{row.original.customer?.name}</span>,
      },
      {
        accessorKey: "apartment",
        header: "Apto.",
        cell: ({ row }) => <span>{row.original.apartment?.name}</span>,
      },
      {
        accessorKey: "checkin",
        header: "Check-in",
        cell: ({ row }) => <span>{formatDate(row.getValue("checkin"))}</span>,
      },
      {
        accessorKey: "checkout",
        header: "Check-out",
        cell: ({ row }) => <span>{formatDate(row.getValue("checkout"))}</span>,
      },
      {
        accessorKey: "amount",
        header: "Valor",
        cell: ({ row }) => {
          const v = row.getValue("amount") as number | undefined;
          return <span>{v ? formatValueToBRL(v) : "-"}</span>;
        },
      },
      {
        accessorKey: "situation",
        header: "Situação",
        cell: ({ row }) => {
          const s = row.getValue("situation") as string;
          return <span>{s}</span>;
        },
      },
      {
        id: "actions",
        header: "Ações",
        cell: ({ row }) => {
          const r = row.original as Reservation;
          const actions = [
            {
              label: (
                <span className="flex items-center gap-2">
                  <LucidePencil className="w-4 h-4" /> Editar
                </span>
              ),
              onClick: () => {
                setEditing(r);
                setFormOpen(true);
              },
            },
            {
              label: (
                <span className="flex items-center gap-2 text-red-600">
                  <LucideTrash2 className="w-4 h-4" /> Excluir
                </span>
              ),
              onClick: async () => {
                await deleteReservation(r.id);
              },
            },
          ];
          return <MenuButtons actions={actions} />;
        },
      },
    ],
    [deleteReservation]
  );
  const hoje = new Date();
  const dataInicialPadrao = hoje.toISOString().split("T")[0];
  const dataFinalPadrao = addDays(hoje, 7).toISOString().split("T")[0];

  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState(dataInicialPadrao);
  const [endDate, setEndDate] = useState(dataFinalPadrao);
  const [situation, setSituation] = useState("");
  const [type, setType] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  useEffect(() => {
    if (debouncedSearchQuery !== searchQuery) setPage(1);
  }, [debouncedSearchQuery, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate, situation, type]);

  const { data, isLoading } = useGetReservations({
    page,
    limit: 10,
    search: debouncedSearchQuery,
    startDate,
    endDate,
    situation,
    type,
  });

  const clearFilters = () => {
    setSearchQuery("");
    setStartDate(dataInicialPadrao);
    setEndDate(dataFinalPadrao);
    setPage(1);
    setSituation("");
    setType("");
  };

  const hasActiveFilters =
    !!searchQuery ||
    !!situation ||
    !!type ||
    startDate !== dataInicialPadrao ||
    endDate !== dataFinalPadrao;

  return (
    <div className="col">
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="mt-1">Reservas</CardTitle>
            <CardAction>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <LucidePlus className="w-4 h-4" />
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="h-full">
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
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Reservada">Reservada</SelectItem>
                      <SelectItem value="Confirmada">Confirmada</SelectItem>
                      <SelectItem value="Hospedada">Hospedada</SelectItem>
                      <SelectItem value="Finalizada">Finalizada</SelectItem>
                      <SelectItem value="Cancelada">Cancelada</SelectItem>
                      <SelectItem value="Apagada">Apagada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full">
                  <Label className="text-sm">Tipo:</Label>
                  <Select
                    value={type}
                    onValueChange={(value) => setType(value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Todos os tipos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="promocional">Promocional</SelectItem>
                      <SelectItem value="diaria">Diária</SelectItem>
                      <SelectItem value="pacote">Pacote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {hasActiveFilters && (
                  <div className="flex items-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="flex items-center gap-2 mt-1"
                      title="Limpar filtros"
                    >
                      <LucideTrash2 className="h-4 w-4" />
                      <span className="hidden sm:inline">Limpar</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Card className="mt-4">
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="flex justify-center">
                    <Loader2 />
                  </div>
                ) : (
                  <DataTable
                    columns={columns}
                    data={data?.data || []}
                    pagination={
                      data?.pagination && {
                        current_page: data.pagination.current_page,
                        last_page: data.pagination.last_page,
                        total: data.pagination.total,
                        onPageChange: setPage,
                      }
                    }
                  />
                )}
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
      <Footer />

      <ReservationFormDialog
        open={formOpen}
        reservation={editing}
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
}
