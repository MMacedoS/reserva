import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  reservation_id: z.string().optional(),
});

type SaleFormData = z.infer<typeof saleSchema>;

interface SaleFormDialogProps {
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
}: SaleFormDialogProps) => {
  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      sale_name: "",
      reservation_id: "",
    },
  });

  useEffect(() => {
    if (editingSale) {
      form.reset({
        sale_name: editingSale.sale_name || editingSale.name || "",
        reservation_id: editingSale.reservation_id || "",
      });
      return;
    }

    form.reset({
      sale_name: "",
      reservation_id: "",
    });
  }, [editingSale, form]);

  const handleSubmit = async (data: SaleFormData) => {
    try {
      const saleRequest: SaleRequest = {
        sale_name: data.sale_name,
        reservation_id: data.reservation_id,
      };

      await onSubmit(saleRequest);
      onClose();
    } catch (error) {
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
                  ? `Editando venda: ${
                      editingSale.sale_name ||
                      editingSale.name ||
                      editingSale.id
                    }`
                  : "Preencha os dados básicos da venda. Você poderá adicionar itens depois."}
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
                name="reservation_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID da Reserva (opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID da reserva relacionada"
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
