import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSaveReservationPerDiem } from "@/http/reservations/per-diems/savePerDiem";
import { useGetReservationPerDiems } from "@/http/reservations/per-diems/getPerDiems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatDate, formatValueToBRL } from "@/lib/utils";
import { useState } from "react";
import { Loader2, LucideTrash2 } from "lucide-react";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { useDeletePerDiem } from "@/http/reservations/per-diems/deletePerDiems";
import { ConfirmPopover } from "@/shared/components/ConfirmPopover";

type Props = { open: boolean; onClose: () => void; reservation?: Reservation };
type FormData = { dt_daily: string; amount: number; notes?: string };

export function PerDiemsDialog({ open, onClose, reservation }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      dt_daily: new Date().toISOString().split("T")[0],
      amount: reservation?.amount,
      notes: "",
    },
  });

  const [page, setPage] = useState(1);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const { mutateAsync: save, isPending } = useSaveReservationPerDiem(
    reservation?.id
  );
  const { mutateAsync: remove } = useDeletePerDiem();

  const { data, isLoading } = useGetReservationPerDiems(
    reservation?.id,
    page,
    10,
    open
  );

  const columns: ColumnDef<FormData & { id?: string }>[] = [
    {
      accessorKey: "dt_daily",
      header: "Data",
      cell: ({ row }) => formatDate(row.getValue("dt_daily") as string),
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => formatValueToBRL(row.getValue("amount") as number),
    },
    {
      accessorKey: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const realId = row.original.id as string | undefined;
        const key = String(realId ?? row.id);
        const isDeleting = deletingKey === key;
        const isConfirming = confirmKey === key;

        return (
          <div className="relative flex gap-2 justify-center">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setConfirmKey(isConfirming ? null : key)}
              aria-label="Excluir diária"
              title="Excluir diária"
            >
              {isDeleting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <LucideTrash2 className="text-red-500" />
              )}
            </Button>

            <ConfirmPopover
              open={isConfirming}
              loading={isDeleting}
              onCancel={() => setConfirmKey(null)}
              onConfirm={async () => {
                try {
                  if (!realId) {
                    setConfirmKey(null);
                    return;
                  }
                  setDeletingKey(key);
                  await remove({ id: realId, reservationId: reservation?.id });
                } finally {
                  setDeletingKey(null);
                  setConfirmKey(null);
                }
              }}
              title="Excluir diária?"
              description="Esta ação não pode ser desfeita."
              align="right"
            />
          </div>
        );
      },
    },
  ];

  const onSubmit = async (data: FormData) => {
    await save(data);
    reset();
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) onClose();
        }}
      >
        <DialogContent className="md:!max-w-5xl">
          <DialogHeader>
            <DialogTitle className="font-semibold">Diarias</DialogTitle>
            <DialogDescription>
              adicionar e gerenciar diárias da reserva.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Nova diária</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    <Input type="date" {...register("dt_daily")} />
                    <Input
                      type="number"
                      min={0}
                      step="0.01"
                      placeholder="Valor"
                      {...register("amount", { valueAsNumber: true })}
                    />
                    <Input
                      placeholder="Observações (opcional)"
                      {...register("notes")}
                    />
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={isPending}>
                        Adicionar
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            <div className="overflow-y-auto col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Diárias registradas</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={data?.data}
                      pagination={{
                        current_page: data?.pagination.current_page,
                        last_page: data?.pagination.last_page,
                        total: data?.pagination.total,
                        onPageChange: setPage,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
