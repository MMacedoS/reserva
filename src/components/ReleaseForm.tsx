import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { ReleasesFormData, Transaction } from "@/hooks/useReleaseForm";
import { PAYMENT_FORMS, TRANSACTION_TYPES } from "@/constants/releases";
import { filterOptionsPayment } from "@/lib/utils";

interface ReleaseFormProps {
  form: UseFormReturn<ReleasesFormData>;
  onSubmit: (data: ReleasesFormData) => Promise<void>;
  onClear: () => void;
  release: Transaction | null;
}

export const ReleaseForm = ({
  form,
  onSubmit,
  onClear,
  release,
}: ReleaseFormProps) => {
  const isSangria = form.watch("type")?.toLowerCase() === "sangria";

  const paymentOptions = isSangria
    ? filterOptionsPayment("cash")
    : PAYMENT_FORMS;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {release ? "Editar Lançamento" : "Lançar Entrada/Saída"}
        </CardTitle>
        {release && (
          <p className="text-sm text-muted-foreground">
            Editando transação: {release.description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 grid grid-cols-2 gap-4"
          >
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Tipo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRANSACTION_TYPES.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Digite o valor em R$"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_form"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a forma de pagamento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origem</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Ex: Aluguel Apartamento 101 ou sangria"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-2 space-y-6">
              <FormField
                control={form.control}
                name="created_at"
                render={({ field }) => (
                  <FormItem className="flex-2">
                    <FormLabel>Data</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descreva o lançamento..."
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2 pt-4 col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClear}
                className="flex-1"
              >
                Limpar
              </Button>
              <Button type="submit" className="flex-1">
                {release ? "Atualizar" : "Lançar"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
