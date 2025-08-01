import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseProfilePass } from "@/http/profile/useProfilePass";
import { useState } from "react";

// Schema com Zod
const schema = z
  .object({
    password_old: z.string().min(1, "A senha atual deve ser digitada"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "As senhas não coincidem",
    path: ["confirm"],
  });

type FormData = z.infer<typeof schema>;

export function UpdatePass() {
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      password_old: "",
      password: "",
      confirm: "",
    },
  });

  const { mutateAsync: createPass } = UseProfilePass();
  
  async function onSubmit(data: FormData) {
        await createPass(data);
        setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Alterar senha</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <Form {...form}>
          <form className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>Alterar Senha</AlertDialogTitle>
              <AlertDialogDescription>
                Digite e confirme sua nova senha abaixo. Isso não poderá ser desfeito.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <FormField  
              control={form.control}
              name="password_old"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Antiga Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <AlertDialogCancel type="button">Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button type="button" onClick={form.handleSubmit(onSubmit)}  disabled={!form.formState.isValid}>Salvar</Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
