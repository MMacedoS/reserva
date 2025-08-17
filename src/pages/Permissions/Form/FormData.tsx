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
import { Textarea } from "@/components/ui/textarea";
import { useSavePermission } from "@/http/permissions/savePermission";
import type { Permission } from "@/http/types/permissions/Permission";
import { Button } from "@/components/ui/button";

const schema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(100, "Nome não deve ultrapassar 100 caracteres"),
  description: z
    .string()
    .max(255, "Descrição não deve ultrapassar 255 caracteres")
    .optional(),
});

type FormData = z.infer<typeof schema>;

type FormDataProps = {
  open: boolean;
  onClose: () => void;
  permission?: Permission | null;
};

export function FormData({ open, onClose, permission }: FormDataProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutateAsync: savePermission } = useSavePermission();

  useEffect(() => {
    if (permission) {
      form.reset(
        {
          id: String(permission.id),
          name: permission.name || "",
          description: permission.description || "",
        },
        { keepDirty: false, keepTouched: false }
      );
      return;
    }

    form.reset(
      {
        name: "",
        description: "",
      },
      { keepDirty: false, keepTouched: false }
    );
  }, [permission, form]);

  const onSubmit = async (data: FormData) => {
    try {
      const submitData = {
        name: data.name,
        description: data.description,
        ...(permission && { id: permission.id }),
      };

      await savePermission(submitData);
      onClose();
      form.reset();
    } catch (error) {
      console.error("Erro ao salvar permissão:", error);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {permission ? "Editar Permissão" : "Nova Permissão"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {permission
              ? "Edite as informações da permissão abaixo."
              : "Preencha as informações para cadastrar uma nova permissão."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nome da permissão"
                      autoComplete="off"
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
                      placeholder="Descrição da permissão"
                      className="resize-none"
                      rows={3}
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
              <AlertDialogAction asChild>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={
                    permission
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
