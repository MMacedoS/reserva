import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { DataTable } from "./ui/DataTable";
import { Spinner } from "./ui/spinner";
import type { ColumnDef } from "@tanstack/react-table";
import { useTransactionDialog } from "@/hooks/useTransactionDialog";
import { formatDateWithTime, formatValueToBRL } from "@/lib/utils";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";

interface TransactionDialogProps {
  title: string;
  cashBoxId: string;
}

type Transaction = {
  id: string;
  type: string;
  description: string;
  amount: number;
  payment_form: string;
  created_at: string;
  canceled: string;
};

export function TransactionDialog({
  title,
  cashBoxId,
}: TransactionDialogProps) {
  const {
    isOpen,
    openDialog,
    setIsOpen,
    setPage,
    transactions,
    isLoading,
    error,
  } = useTransactionDialog({ cashBoxId });

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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="border p-3 text-dark rounded-3xl text-muted-foreground font-semibold hover:bg-green-600 hover:text-white focus-visible:ring-green-500"
        onClick={openDialog}
      >
        Ver Transações
      </DialogTrigger>
      <DialogContent className="!max-w-none !w-[75vw] !max-h-[90vh]">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Transações do Caixa - {title}</DialogTitle>
          <DialogDescription>
            Histórico completo de transações deste caixa.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex-1 overflow-hidden relative">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spinner />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">
              <p className="text-lg">⚠️</p>
              <p>Erro ao carregar transações. Tente novamente.</p>
            </div>
          ) : transactions?.data.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg">📋</p>
              <p>Nenhuma transação encontrada para este caixa.</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
