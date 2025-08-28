import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { useGetReservationConsumption } from "@/http/reservations/consumption/getConsumption";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatValueToBRL } from "@/lib/utils";
import type { Reservation } from "@/http/types/reservations/Reservation";
import { getProducts } from "@/http/products/getProducts";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import type { Product } from "@/http/types/products/Product";
import { Button } from "@/components/ui/button";
import { Loader2, LucideTrash2, Plus } from "lucide-react";
import { Form, FormField, FormItem } from "@/components/ui/form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRemoveConsumption } from "@/http/reservations/consumption/removeConsuption";
import { useAddConsumptions } from "@/http/reservations/consumption/addSaleItem";
import ConfirmPopover from "@/shared/components/ConfirmPopover";

const schema = z.object({
  product_id: z.string().min(2).max(100),
  quantity: z.number().min(1).optional(),
  unit_price: z.number().min(0).optional(),
  dt_consumption: z.string().optional(),
});

type Props = { open: boolean; onClose: () => void; reservation: Reservation };
type FormData = z.infer<typeof schema>;

export function ConsumptionDialog({ open, onClose, reservation }: Props) {
  const hoje = new Date().toISOString().split("T")[0];
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      product_id: "",
      quantity: 1,
      unit_price: 0,
      dt_consumption: hoje,
    },
  });

  const [newItem, setNewItem] = useState({
    product_id: "",
    product_name: "",
    quantity: 1,
    unit_price: 0,
    dt_consumption: hoje,
  });

  const [page, setPage] = useState(1);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [confirmKey, setConfirmKey] = useState<string | null>(null);

  const { data: productsData, isLoading: isLoadingProducts } = getProducts({
    page: 1,
    limit: 100,
    status: "1",
  });

  useEffect(() => {
    form.reset({
      product_id: "",
      quantity: 1,
      unit_price: 0,
      dt_consumption: hoje,
    });
  }, [form, hoje]);

  const products = productsData?.data.products || [];

  const { data: consumptionsData, isPending: isPendingConsumptions } =
    useGetReservationConsumption(reservation.id, page, 10, open);

  const addConsumptionMutation = useAddConsumptions();
  const removeConsumptionMutation = useRemoveConsumption();

  const filterProducts = (id: string) => {
    return products.find(
      (p: Product) =>
        String(p.id) === String(id) || String(p.code) === String(id)
    );
  };

  const handleProductSelect = (productId: string) => {
    const product = filterProducts(productId);
    if (product) {
      setNewItem({
        product_id: productId,
        product_name: product.name || "",
        quantity: newItem.quantity,
        unit_price: product.price || 0,
        dt_consumption: hoje,
      });
      form.setValue("product_id", productId);
      form.setValue("unit_price", product.price || 0);
      form.setValue("dt_consumption", hoje);
      return;
    }
    setNewItem({
      product_id: "",
      product_name: "",
      quantity: 1,
      unit_price: 0,
      dt_consumption: hoje,
    });
    return;
  };

  const columns: ColumnDef<FormData & { id?: string }>[] = [
    {
      accessorKey: "product_id",
      header: "Produto",
      cell: ({ row }) => {
        const productId = row.getValue("product_id") as string;
        const product = filterProducts(productId);
        return product?.name || "Produto não encontrado";
      },
    },
    { accessorKey: "quantity", header: "Qtd." },
    {
      accessorKey: "amount",
      header: "Preço unitário",
      cell: ({ row }) => formatValueToBRL(row.getValue("amount") as number),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }) => {
        return formatValueToBRL(row.getValue("total") as number);
      },
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
                  await removeConsumptionMutation.mutateAsync({
                    reservation_id: reservation.id,
                    item_id: realId,
                  });
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

  const addItem = async () => {
    if (
      !newItem.product_id ||
      !newItem.product_name ||
      newItem.quantity <= 0 ||
      newItem.unit_price <= 0
    ) {
      return;
    }

    try {
      await addConsumptionMutation.mutateAsync({
        reservation_id: reservation.id,
        product_id: newItem.product_id,
        quantity: newItem.quantity,
        unit_price: newItem.unit_price,
        dt_consumption: newItem.dt_consumption,
      });

      setNewItem({
        product_id: "",
        product_name: "",
        quantity: 1,
        unit_price: 0,
        dt_consumption: hoje,
      });

      form.reset();
    } catch (error) {}
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
        {isLoadingProducts && isPendingConsumptions ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Novo consumo</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form className="space-y-3">
                      <div className="space-y-2">
                        <FormField
                          control={form.control}
                          name="product_id"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <Select
                                onValueChange={handleProductSelect}
                                {...field}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione um produto" />
                                </SelectTrigger>
                                <SelectContent className="w-full">
                                  {products.map((product: Product) => (
                                    <SelectItem
                                      key={product.id}
                                      value={product.id || "all"}
                                    >
                                      {product.name} -{" "}
                                      {formatValueToBRL(product.price || 0)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <Label>Quantidade</Label>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 1;
                                field.onChange(value);
                                setNewItem((prev) => ({
                                  ...prev,
                                  quantity: value,
                                }));
                              }}
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="unit_price"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <Label>Preço Unitário</Label>
                            <Input
                              type="number"
                              step="0.01"
                              min={0}
                              {...field}
                              onChange={(e) => {
                                field.onChange(parseFloat(e.target.value) || 0);
                              }}
                            />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="dt_consumption"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <Label>Data de Consumo</Label>
                            <Input
                              type="date"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e.target.value);
                                setNewItem((prev) => ({
                                  ...prev,
                                  dt_consumption: e.target.value,
                                }));
                              }}
                            />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end">
                        <Button
                          onClick={addItem}
                          type="button"
                          className="w-full"
                          disabled={
                            !addConsumptionMutation.isPending &&
                            (!form.watch("product_id") ||
                              form.formState.isValid)
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          {addConsumptionMutation.isPending
                            ? "Adicionando..."
                            : "Adicionar"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Consumos registrados</CardTitle>
                </CardHeader>
                <CardContent>
                  {isPendingConsumptions ? (
                    <Loader2 className="animate-spin mx-auto" />
                  ) : (
                    <DataTable
                      columns={columns}
                      data={consumptionsData.consumptions}
                      pagination={{
                        current_page: consumptionsData.paginations.current_page,
                        last_page: consumptionsData.paginations.last_page,
                        total: consumptionsData.paginations.total,
                        onPageChange: setPage,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
