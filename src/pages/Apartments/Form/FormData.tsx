import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Apartment } from "@/http/types/apartments/Apartment";
import { saveApartment } from "@/http/apartments/saveApartment";

// Schema com Zod
const schema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  situation: z.string(),
});

type FormData = z.infer<typeof schema>;

type FormDataProps = {
  open: boolean;
  onClose: () => void;
  apartment?: Apartment | null;
};

export function FormData({ open, onClose, apartment }: FormDataProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (apartment) {
      form.reset({
        id: apartment.uuid || "",
        name: apartment.name || "",
        description: apartment.description || "",
        category: apartment.category || "",
        situation: apartment.situation || "",
      });
      return;
    }
    form.reset({
      id: "",
      name: "",
      description: "",
      category: "",
      situation: "",
    });
    return;
  }, [apartment]);

  const { mutateAsync: save } = saveApartment();

  async function onSubmit(data: FormData) {
    await save(data);
    onClose();
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <Form {...form}>
          <form className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {apartment ? "Atualizar Apartamento" : "Cadastrar Apartamento"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Digite e confirme os dados do apartamento.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1 hidden">
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Numero</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Opções</SelectLabel>
                              <SelectItem value="Casal">Casal</SelectItem>
                              <SelectItem value="Triplo">Triplo</SelectItem>
                              <SelectItem value="Quadruplo">
                                Quadruplo
                              </SelectItem>
                              <SelectItem value="Suite">Suite</SelectItem>
                              <SelectItem value="Chale">Chale</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="situation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situação</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione uma opção" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Opções</SelectLabel>
                              <SelectItem value="Ocupado">Ocupado</SelectItem>
                              <SelectItem value="Disponivel">
                                Disponível
                              </SelectItem>
                              <SelectItem value="Impedido">Impedido</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <AlertDialogFooter>
              <AlertDialogCancel onClick={onClose}>Cancelar</AlertDialogCancel>
              <AlertDialogAction asChild>
                <Button
                  type="button"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={!(form.formState.isValid && form.formState.isDirty)}
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
