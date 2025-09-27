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
import { useGetReservationPayments } from "@/http/reservations/payments/getPayments";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatValueToBRL } from "@/lib/utils";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { useProcessPayment } from "@/http/payments/processPayment";
import { useCashbox } from "@/hooks/useCashbox";
import { paymentMethods } from "@/constants/payments";
import { useState } from "react";
import { Loader2, LucideTrash2 } from "lucide-react";
import ConfirmPopover from "@/shared/components/ConfirmPopover";
import { useCancelPayment } from "@/http/payments/cancelPayment";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const schema = z.object({
  amount: z.string("digite um valor").min(1),
  method: z.string("defina um método").min(2),
  reference: z.string().optional(),
});

type Props = { open: boolean; onClose: () => void; reservation?: Reservation };

type FormData = z.infer<typeof schema>;

export function PaymentsDialog({ open, onClose, reservation }: Props) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { cashbox } = useCashbox();
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);
  const { mutateAsync: save, isPending } = useProcessPayment();
  const { data: payments = [] } = useGetReservationPayments(
    reservation?.id,
    open
  );
  const cancelPaymentMutation = useCancelPayment();
  const cancelPayment = async (paymentId: string) => {
    try {
      await cancelPaymentMutation.mutateAsync({
        id: paymentId,
        reference: reservation?.id,
      });
    } catch (error) {}
  };

  async function onSubmit(data: FormData) {
    await save({
      cashbox_id: cashbox?.id,
      reservation_id: reservation?.id,
      amount: parseFloat(data.amount) || 0,
      method: data.method as
        | "cash"
        | "debit_card"
        | "credit_card"
        | "pix"
        | "transfer"
        | "other",
      reference: data.reference,
    });
    form.reset(
      { amount: "", method: "", reference: "" },
      { keepDefaultValues: true }
    );
  }

  const getMethodLabel = (method: string) => {
    const paymentMethod = paymentMethods.find((m) => m.value === method);
    return paymentMethod ? paymentMethod.label : method;
  };

  const columns: ColumnDef<FormData & { id?: string }>[] = [
    {
      accessorKey: "method",
      header: "Forma",
      cell: ({ row }) => (
        <>{getMethodLabel(row.getValue("method") as string)}</>
      ),
    },
    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => formatValueToBRL(row.getValue("amount") as number),
    },
    {
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
              aria-label="Excluir pagamento"
              title="Excluir pagamento"
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
                  await cancelPayment(realId);
                } finally {
                  setDeletingKey(null);
                  setConfirmKey(null);
                }
              }}
              title="Excluir pagamento?"
              description="Esta ação não pode ser desfeita."
              align="right"
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-h-[95vh] md:!max-w-5xl">
          <DialogHeader>
            <DialogTitle>Pagamentos</DialogTitle>
            <DialogDescription>
              Gerencie os pagamentos desta hospedagem.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Novo pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-3 grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Valor</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min={0}
                                placeholder="Valor"
                                className="w-full"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="method"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Forma de pagamento</FormLabel>
                            <FormControl>
                              <Select
                                value={field.value}
                                onValueChange={field.onChange}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Forma de pagamento" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  {paymentMethods.map(({ label, value }) => (
                                    <SelectItem key={value} value={value}>
                                      {label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="reference"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel>Referência</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Referência (opcional)"
                                {...field}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={onClose}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="button"
                          onClick={form.handleSubmit(onSubmit)}
                          disabled={isPending}
                        >
                          Adicionar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-2 max-h-[40vh] md:max-h-[80vh] overflow-y-auto scrollbar-hide">
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
    </>
  );
}
