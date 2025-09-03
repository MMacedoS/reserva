import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { showAutoDismissAlert } from "./showAutoDismissAlert";
import { saveCashbox } from "@/http/cashbox/saveCashbox";

const schema = z.object({
  initial_amount: z
    .number()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "Valor deve ser um número válido e não negativo",
    }),
  obs: z.string().optional(),
});

type CashboxFormData = z.infer<typeof schema>;

type CashboxFormProps = {
  open: boolean;
  onClose: () => void;
};

export function CashboxForm({ open, onClose }: CashboxFormProps) {
  const form = useForm<CashboxFormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutateAsync: save } = saveCashbox();

  const onSubmit = async (data: CashboxFormData) => {
    try {
      await save(data);
      onClose();
      form.reset();
    } catch (error) {
      showAutoDismissAlert({
        message: "Erro ao abrir caixa",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        duration: 3000,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Abrir Caixa</AlertDialogTitle>
          <AlertDialogDescription>
            Preencha as informações para abrir o caixa do dia.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="initial_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor Inicial *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="obs"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Observações sobre a abertura do caixa"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={onClose}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={
                  !form.formState.isValid || form.formState.isSubmitting
                }
              >
                {form.formState.isSubmitting ? "Abrindo..." : "Abrir Caixa"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
