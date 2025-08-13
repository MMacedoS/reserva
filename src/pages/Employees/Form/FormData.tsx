import { useEffect } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSaveEmployee } from "@/http/employees/saveEmployee";
import type { Employee } from "@/http/types/employees/Employee";
import { Button } from "@/components/ui/button";

const schema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    name: z
      .string()
      .min(3, "Nome deve ter pelo menos 3 caracteres")
      .max(100, "Nome não deve ultrapassar 100 caracteres"),
    email: z.email("Email inválido").min(5, "Email é obrigatório"),
    password: z.string().optional(),
    access: z.string().min(1, "Nível de acesso é obrigatório"),
    active: z.string().min(1, "Status é obrigatório"),
  })
  .superRefine((data, ctx) => {
    const isCreate = typeof data.id === "undefined";
    if (isCreate && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["password"],
        message: "Senha deve ter pelo menos 6 caracteres",
      });
    }
  });

type FormData = z.infer<typeof schema>;

type FormDataProps = {
  open: boolean;
  onClose: () => void;
  employee?: Employee | null;
};

export function FormData({ open, onClose, employee }: FormDataProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutateAsync: saveEmployee } = useSaveEmployee();

  useEffect(() => {
    if (employee) {
      form.reset(
        {
          id: String(employee.id),
          name: employee.name || "",
          email: employee.email || "",
          password: "",
          access: employee.access || "",
          active: String(employee.active ?? ""),
        },
        { keepDirty: false, keepTouched: false }
      );
      return;
    }

    form.reset(
      {
        name: "",
        email: "",
        password: "",
        access: "",
        active: "",
      },
      { keepDirty: false, keepTouched: false }
    );
  }, [employee, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        name: data.name,
        email: data.email,
        access: data.access,
        active: data.active,
        ...(data.password && { password: data.password }),
        ...(employee && { id: employee.id }),
      };

      await saveEmployee(submitData);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar funcionário:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {employee ? "Editar Funcionário" : "Novo Funcionário"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {employee
              ? "Edite as informações do funcionário abaixo."
              : "Preencha as informações para cadastrar um novo funcionário."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Nome completo"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="email@exemplo.com"
                        autoComplete="off"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!employee && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Digite a senha"
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="access"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível de Acesso *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="administrador">
                          Administrador
                        </SelectItem>
                        <SelectItem value="recepcionista">
                          Recepcionista
                        </SelectItem>
                        <SelectItem value="recepcionista_bar">
                          Recepcionista do bar
                        </SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="active"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">Ativo</SelectItem>
                        <SelectItem value="0">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel type="button" onClick={onClose}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={
                    employee
                      ? !form.formState.isValid
                      : !(form.formState.isValid && form.formState.isDirty)
                  }
                >
                  Salvar
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
