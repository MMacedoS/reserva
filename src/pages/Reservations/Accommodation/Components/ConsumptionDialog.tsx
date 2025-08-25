import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useSaveReservationConsumption } from "@/http/reservations/consumption/saveConsumption";
import { useGetReservationConsumption } from "@/http/reservations/consumption/getConsumption";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatValueToBRL } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void; reservationUuid: string };
type FormData = { description?: string; quantity: number; unit_price: number };

export function ConsumptionDialog({ open, onClose, reservationUuid }: Props) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { description: "", quantity: 1, unit_price: 0 },
  });
  const { mutateAsync: save, isPending } =
    useSaveReservationConsumption(reservationUuid);
  const { data: consumption = [] } = useGetReservationConsumption(
    reservationUuid,
    open
  );

  const columns: ColumnDef<FormData & { id?: string }>[] = [
    { accessorKey: "description", header: "Descrição" },
    { accessorKey: "quantity", header: "Qtd." },
    {
      accessorKey: "unit_price",
      header: "Preço unitário",
      cell: ({ row }) => formatValueToBRL(row.getValue("unit_price") as number),
    },
    {
      id: "total",
      header: "Total",
      cell: ({ row }) => {
        const q = Number(row.getValue("quantity"));
        const p = Number(row.getValue("unit_price"));
        return formatValueToBRL(q * p);
      },
    },
  ];

  const onSubmit = async (data: FormData) => {
    await save(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!max-w-5xl">
        <DialogHeader>
          <DialogTitle>Consumos</DialogTitle>
          <DialogDescription>
            Gerencie os consumos desta hospedagem.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Novo consumo</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    placeholder="Descrição (opcional)"
                    {...register("description")}
                  />
                  <Input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="Quantidade"
                    {...register("quantity", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Preço unitário"
                    {...register("unit_price", { valueAsNumber: true })}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      Salvar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Consumos registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={consumption} />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
