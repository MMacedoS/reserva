import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { Sale, SaleRequest } from "@/http/types/sales/Sale";

const saleSchema = z.object({
  sale_name: z.string().min(1, "Nome do cliente é obrigatório"),
  amount: z.number().min(0, "Valor não pode ser negativo").optional(),
  payment_type: z.string().optional(),
  reservation_id: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface FormDataProps {
  isOpen: boolean;
  onClose: () => void;
  editingSale: Sale | null;
  onSubmit: (data: SaleRequest) => Promise<void>;
}

export const SaleFormDialog = ({
  isOpen,
  onClose,
  editingSale,
  onSubmit,
}: FormDataProps) => {
  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      sale_name: "",
      amount: 0,
      payment_type: "",
      reservation_id: "",
    },
  });

  useEffect(() => {
    if (editingSale) {
      form.reset({
        sale_name: editingSale.sale_name || "",
        amount: editingSale.amount || 0,
        payment_type: editingSale.payment_type || "",
        reservation_id: editingSale.reservation_id || "",
      });
      return;
    }
    form.reset({
      sale_name: "",
      amount: 0,
      payment_type: "",
      reservation_id: "",
    });
  }, [editingSale, form]);

  const handleSubmit = async (data: SaleFormData) => {
    try {
      const saleRequest: SaleRequest = {
        sale_name: data.sale_name,
        amount: data.amount,
        payment_type: data.payment_type,
        reservation_id: data.reservation_id,
      };

      await onSubmit(saleRequest);
      onClose();
    } catch (error) {
      // O erro já é tratado no hook useSaleForm
      console.error("Erro ao processar formulário:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {editingSale ? "Editar Venda" : "Nova Venda"}
              </DialogTitle>
              <DialogDescription>
                {editingSale
                  ? `Editando venda: ${editingSale.sale_name || editingSale.id}`
                  : "Preencha os campos abaixo para criar uma nova venda."}
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="sale_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente/Mesa *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do cliente ou mesa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor Total</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00 (será calculado automaticamente com base nos itens)"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Pagamento</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo de pagamento" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="card">Cartão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reservation_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Reserva</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID da reserva (opcional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Salvando..."
                  : editingSale
                  ? "Salvar Alterações"
                  : "Criar Venda"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
