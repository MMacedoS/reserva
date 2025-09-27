import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTransactionsByCashboxId } from "@/http/finance/transactions/getTransactionsCashboxByCashboxId";
import { useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { filterOptionsPayment, formatValueToBRL } from "@/lib/utils";
import { ArrowUpDown, LucideTrash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useReleaseForm, type Transaction } from "@/hooks/useReleaseForm";
import { ReleaseForm } from "@/components/ReleaseForm";
import { AlertDialogDestroy } from "@/components/ui/alertDialogDestroy";
import { deleteTransaction } from "@/http/finance/transactions/deleteTransaction";
import HoverCardToTable from "@/shared/components/HoverCardToTable";

const ReleasesPage = () => {
  const { cashbox } = useAuth();
  const [page, setPage] = useState(1);
  const cashBoxId = cashbox?.id || "";
  const [release, setRelease] = useState<Transaction | null>(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  const { form, onSubmit, clearForm } = useReleaseForm({
    cashBoxId,
    release,
    onSuccess: () => setRelease(null),
  });

  const { data: transactions } = useTransactionsByCashboxId({
    cashBoxId,
    page,
    limit: 5,
    enabled: true,
  });
  const { mutateAsync: destroyTransaction } = deleteTransaction();
  const handleDelete = async () => {
    if (!release) return;

    release.cashbox_id = cashBoxId;
    await destroyTransaction(release);

    setOpenConfirmDialog(false);
  };

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
              <Button
                variant="link"
                onClick={() => {
                  setRelease(row.original);
                  setOpenConfirmDialog(true);
                }}
              >
                <LucideTrash2 className="text-red-800" />
              </Button>
              <Button variant="link" onClick={() => setRelease(row.original)}>
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
      cell: ({ row }) => {
        return filterOptionsPayment(row.getValue("payment_form") as string)[0]
          .label;
      },
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lançamentos Financeiros</h1>
      </div>
      <div className="mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4">
          <div className="col-span-1">
            <ReleaseForm
              form={form}
              onSubmit={onSubmit}
              onClear={clearForm}
              release={release}
            />
          </div>
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Últimos Lançamentos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Aqui serão exibidos os últimos lançamentos financeiros.
                </p>
                <div className="w-full h-full overflow-auto scrollbar-hide">
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
        </div>
      </div>
      <AlertDialogDestroy
        open={openConfirmDialog}
        onCloseDestroy={() => setOpenConfirmDialog(false)}
        onConfirm={handleDelete}
        item={release}
        type="transação"
      />
    </Sidebar>
  );
};

export default ReleasesPage;
