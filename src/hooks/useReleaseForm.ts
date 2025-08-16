import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import z from "zod";
import { saveTransactions } from "@/http/finance/transactions/saveTransactions";
import { showAutoDismissAlert } from "@/components/showAutoDismissAlert";

const ReleasesFormDataSchema = z.object({
  amount: z.string().min(1, "Valor é obrigatório"),
  description: z
    .string()
    .min(2, "Descrição deve ter pelo menos 2 caracteres")
    .max(100),
  origin: z.string().min(2, "Origem deve ter pelo menos 2 caracteres").max(100),
  payment_form: z.string().min(1, "Forma de pagamento é obrigatória"),
  created_at: z.string().min(10, "Data inválida").max(10),
  type: z.string().min(1, "Tipo é obrigatório"),
});

export type ReleasesFormData = z.infer<typeof ReleasesFormDataSchema>;

export type Transaction = {
  id: string;
  type: string;
  description: string;
  amount: number;
  origin: string;
  cashbox_id?: string;
  payment_form: string;
  created_at: string;
  canceled: boolean;
};

const DEFAULT_FORM_VALUES: ReleasesFormData = {
  amount: "",
  description: "",
  origin: "",
  payment_form: "dinheiro",
  type: "entrada",
  created_at: new Date().toISOString().split("T")[0],
};

interface UseReleaseFormProps {
  cashBoxId: string;
  release: Transaction | null;
  onSuccess?: () => void;
}

export const useReleaseForm = ({
  cashBoxId,
  release,
  onSuccess,
}: UseReleaseFormProps) => {
  const form = useForm<ReleasesFormData>({
    resolver: zodResolver(ReleasesFormDataSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { mutateAsync: mutateSave } = saveTransactions();

  useEffect(() => {
    if (release) {
      form.reset({
        amount: release.amount?.toString() || "0.0",
        description: release.description || "",
        origin: release.origin || "",
        payment_form: release.payment_form || "dinheiro",
        type: release.type || "entrada",
        created_at: new Date(release.created_at).toISOString().split("T")[0],
      });
      return;
    }
    form.reset(DEFAULT_FORM_VALUES);
  }, [form, release]);

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
        created_at: release?.id ? data.created_at : new Date().toISOString(),
        id: release?.id || undefined,
      };

      await mutateSave(formattedData);
      form.reset(DEFAULT_FORM_VALUES);
      onSuccess?.();
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  };

  const clearForm = () => {
    form.reset(DEFAULT_FORM_VALUES);
    onSuccess?.();
  };

  return {
    form,
    onSubmit,
    clearForm,
    DEFAULT_FORM_VALUES,
  };
};
