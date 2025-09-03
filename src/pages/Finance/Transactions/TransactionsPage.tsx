import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import { useSidebar } from "@/contexts/SidebarContext";
import { useAuth } from "@/hooks/useAuth";
import { useTransactionsByUserId } from "@/http/finance/transactions/getTransactionsCashboxByCashboxId";
import type { Transaction } from "@/http/types/finance/transaction/Transaction";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import HoverCardToTable from "@/shared/components/HoverCardToTable";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LucideTrash2 } from "lucide-react";
import { useState } from "react";

const TransactionsPage = () => {
  const { sidebarToggle } = useSidebar();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const userId = user?.id || "";

  const { data: transactions } = useTransactionsByUserId({
    userId,
    page,
    limit: 5,
    enabled: true,
  });

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Descrição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return (
          <>
            <div className="space-x-2 justify-baseline flex items-center">
              <Button variant="link" onClick={() => {}}>
                <LucideTrash2 className="text-red-800" />
              </Button>
              <Button variant="link" onClick={() => {}}>
                <HoverCardToTable
                  title={row.original.description}
                  type="transaction"
                  item={row.original}
                />
              </Button>
            </div>
          </>
        );
      },
      enableSorting: true,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Data
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return formatDateWithTime(row.getValue("created_at"));
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "payment_form",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Forma
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return formatValueToBRL(row.getValue("amount"));
      },
      enableSorting: true,
    },
  ];
  return (
    <Sidebar>
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="mt-1">Histórico de Transações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Aqui serão exibidos os últimos lançamentos financeiros.
            </p>
            <div className="w-full h-full overflow-auto">
              <DataTable
                columns={columns}
                multipleFilters={[
                  {
                    column: "description",
                    placeholder: "Buscar por descrição...",
                  },
                  {
                    column: "type",
                    placeholder: "Filtrar por tipo...",
                  },
                  {
                    column: "payment_form",
                    placeholder: "Filtrar por forma de pagamento...",
                  },
                ]}
                data={transactions?.data || []}
                pagination={{
                  total: transactions?.pagination.total || 0,
                  current_page: transactions?.pagination.current_page || 0,
                  last_page: transactions?.pagination.last_page || 0,
                  onPageChange: setPage,
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
};

export default TransactionsPage;
