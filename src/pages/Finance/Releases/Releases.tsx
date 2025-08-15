import Footer from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";
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
import { useSidebar } from "@/contexts/SidebarContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useTransactionsByCashboxId } from "@/http/finance/transactions/getTransactionsCashboxByCashboxId";
import { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { formatValueToBRL } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { saveTransactions } from "@/http/finance/transactions/saveTransactions";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";
import { useAuth } from "@/hooks/useAuth";

const ReleasesFormDataSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  description: z
    .string()
    .min(2, "Descrição deve ter pelo menos 2 caracteres")
    .max(100),
  origin: z.string().min(2, "Origem deve ter pelo menos 2 caracteres").max(100),
  payment_form: z.string().min(1, "Forma de pagamento é obrigatória"),
  created_at: z.string().min(10, "Data inválida").max(10),
  type: z.enum(["entrada", "saida"]),
});

type ReleasesFormData = z.infer<typeof ReleasesFormDataSchema>;

type Transaction = {
  id: string;
  type: string;
  description: string;
  amount: number;
  payment_form: string;
  created_at: string;
  canceled: string;
};

const Releases = () => {
  const { sidebarToggle } = useSidebar();
  const { cashbox } = useAuth();
  const [page, setPage] = useState(1);
  const cashBoxId = cashbox?.id || "";

  const form = useForm<ReleasesFormData>({
    resolver: zodResolver(ReleasesFormDataSchema),
    defaultValues: {
      amount: "",
      description: "",
      origin: "",
      payment_form: "dinheiro",
      type: "entrada",
      created_at: new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    form.reset();
  }, [form]);

  const { data: transactions } = useTransactionsByCashboxId({
    cashBoxId,
    page,
    limit: 5,
    enabled: true,
  });

  const { mutateAsync: mutateSave } = saveTransactions();

  const onSubmit = async (data: ReleasesFormData) => {
    if (!cashBoxId) {
      showAutoDismissAlert({
        message: "Erro - Caixa não encontrado",
        description:
          "É necessário ter um caixa aberto para registrar transações.",
        duration: 3000,
      });
      return;
    }

    try {
      const formattedData = {
        ...data,
        amount: parseFloat(data.amount),
        cashbox_id: cashBoxId,
        created_at: new Date().toISOString(),
      };

      await mutateSave(formattedData);
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  const columns: ColumnDef<Transaction>[] = [
    {
      accessorKey: "description",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Descrição
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Tipo
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "payment_form",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Forma
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting()}
        >
          Valor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return formatValueToBRL(row.getValue("amount"));
      },
      enableSorting: true,
    },
  ];

  return (
    <>
      <Sidebar />
      <div
        className={`${
          sidebarToggle ? "ml-5" : "ml-55"
        } py-20 mr-5 transition-all duration-1000 ease-in-out `}
      >
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Lançamentos Financeiros</h1>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Lançar Entrada/Saída</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
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

                      <FormField
                        control={form.control}
                        name="payment_form"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Forma de Pagamento</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Selecione a forma de pagamento" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="dinheiro">
                                  Dinheiro
                                </SelectItem>
                                <SelectItem value="pix">PIX</SelectItem>
                                <SelectItem value="cartao_credito">
                                  Cartão de Crédito
                                </SelectItem>
                                <SelectItem value="cartao_debito">
                                  Cartão de Débito
                                </SelectItem>
                                <SelectItem value="transferencia">
                                  Transferência Bancária
                                </SelectItem>
                                <SelectItem value="boleto">Boleto</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2 space-x-2">
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
                          name="type"
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormLabel>Tipo</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="entrada">
                                    Entrada
                                  </SelectItem>
                                  <SelectItem value="saida">Saída</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => form.reset()}
                          className="flex-1"
                        >
                          Limpar
                        </Button>
                        <Button type="submit" className="flex-1">
                          Lançar
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Últimos Lançamentos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Aqui serão exibidos os últimos lançamentos financeiros.
                  </p>
                  <div className="w-full h-full overflow-auto">
                    <DataTable
                      columns={columns}
                      multipleFilters={[
                        {
                          column: "description",
                          placeholder: "Buscar por descrição...",
                        },
                        {
                          column: "type",
                          placeholder: "Filtrar por tipo...",
                        },
                        {
                          column: "payment_form",
                          placeholder: "Filtrar por forma de pagamento...",
                        },
                      ]}
                      data={transactions?.data || []}
                      pagination={{
                        total: transactions?.pagination.total || 0,
                        current_page:
                          transactions?.pagination.current_page || 0,
                        last_page: transactions?.pagination.last_page || 0,
                        onPageChange: setPage,
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Releases;
