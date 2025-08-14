import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { useSidebar } from "@/contexts/SidebarContext";
import { getCashbox } from "@/http/cashbox/getCashbox";
import type { Cashbox } from "@/http/types/cashbox/Cashbox";
import { formatDate } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { Loader2 } from "lucide-react";

const Finance = () => {
  const { sidebarToggle } = useSidebar();
  const [page, setPage] = useState(1);
  const limit = 2;

  const { data: financeData, isLoading } = getCashbox(page, limit);

  const getStatusBadge = (status: string) => {
    const colors = {
      aberto: "bg-green-100 text-green-800",
      fechado: "bg-blue-100 text-blue-800",
      cancelado: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    );
  };

  const columns: ColumnDef<Cashbox>[] = [
    {
      accessorKey: "name",
      header: "Nome",
    },
    {
      accessorKey: "opened_at",
      header: "Dt. Abertura",
      cell: ({ row }) => formatDate(row.getValue("opened_at")),
    },
    {
      accessorKey: "status",
      header: "Situação",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
  ];

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
            <CardTitle className="mt-1">Financeiro</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="animate-spin size-6 text-gray-500" />
            ) : (
              <div className="w-full">
                <DataTable
                  columns={columns}
                  data={financeData?.data}
                  pagination={{
                    current_page: financeData?.pagination.current_page,
                    last_page: financeData?.pagination.last_page,
                    total: financeData?.pagination.total,
                    onPageChange: setPage,
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Finance;
