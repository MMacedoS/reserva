import { useState } from "react";
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
import { getTransactionsCashboxByCashboxId } from "@/http/transactions/getTransactionsCashboxByCashboxId";
import { formatDate, formatValueToBRL } from "@/lib/utils";

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
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const {
    data: transactions,
    isLoading,
    error,
  } = getTransactionsCashboxByCashboxId(cashBoxId, page, 10, isOpen);

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: "Descrição",
    },
    {
      accessorKey: "type",
      header: "Tipo",
    },
    {
      accessorKey: "created_at",
      header: "Data",
      cell: ({ row }) => {
        return formatDate(row.getValue("created_at"));
      },
    },
    {
      accessorKey: "payment_form",
      header: "Forma de Pagamento",
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => {
        return formatValueToBRL(row.getValue("amount"));
      },
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className="border p-3 text-dark rounded-3xl text-muted-foreground font-semibold hover:bg-green-600 hover:text-white focus-visible:ring-green-500"
        onClick={() => setIsOpen(true)}
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
