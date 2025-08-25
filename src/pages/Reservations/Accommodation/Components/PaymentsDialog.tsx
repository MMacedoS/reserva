import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { useSaveReservationPayment } from "@/http/reservations/payments/savePayment";
import { useGetReservationPayments } from "@/http/reservations/payments/getPayments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatValueToBRL } from "@/lib/utils";

type Props = { open: boolean; onClose: () => void; reservationUuid: string };
type FormData = { amount: number; method: string; reference?: string };

export function PaymentsDialog({ open, onClose, reservationUuid }: Props) {
  const { register, handleSubmit, setValue, reset, watch } = useForm<FormData>({
    defaultValues: { amount: 0, method: "cash", reference: "" },
  });
  const { mutateAsync: save, isPending } =
    useSaveReservationPayment(reservationUuid);
  const method = watch("method");
  const { data: payments = [] } = useGetReservationPayments(
    reservationUuid,
    open
  );

  const columns: ColumnDef<FormData & { id?: string }>[] = [
    { accessorKey: "method", header: "Forma" },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => formatValueToBRL(row.getValue("amount") as number),
    },
    { accessorKey: "reference", header: "Referência" },
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
          <DialogTitle>Pagamentos</DialogTitle>
          <DialogDescription>
            Gerencie os pagamentos desta hospedagem.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Novo pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                  <Input
                    type="number"
                    step="0.01"
                    min={0}
                    placeholder="Valor"
                    {...register("amount", { valueAsNumber: true })}
                  />
                  <Select
                    value={method}
                    onValueChange={(v) => setValue("method", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Dinheiro</SelectItem>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="debit_card">
                        Cartão de Débito
                      </SelectItem>
                      <SelectItem value="credit_card">
                        Cartão de Crédito
                      </SelectItem>
                      <SelectItem value="transfer">Transferência</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Referência (opcional)"
                    {...register("reference")}
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
                <CardTitle>Pagamentos registrados</CardTitle>
              </CardHeader>
              <CardContent>
                <DataTable columns={columns} data={payments} />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
