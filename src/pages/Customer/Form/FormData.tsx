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
import { PatternFormat, type NumberFormatValues } from "react-number-format";
import type { Customer } from "@/http/types/Customer/Customer";
import { saveCustomer } from "@/http/customers/saveCustomer";
import { onlyDigits } from "@/lib/utils";

const schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome obrigatório"),
  // doc: z
  //   .string()
  //   .optional()
  //   .refine((v) => (v ? (v.length === 11 ? isValidCPF(v) : true) : true), {
  //     message: "CPF inválido",
  //   }),
  doc: z.string().optional(),
  type_doc: z.string().optional(),
  email: z.email("Email inválido").optional(),
  social_name: z.string().optional(),
  address: z.string().optional(),
  birthday: z.string().optional(),
  phone: z.string().refine(
    (v) => {
      const digits = onlyDigits(v);
      return digits.length === 10 || digits.length === 11;
    },
    { message: "Telefone inválido" }
  ),
  gender: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type FormDataProps = {
  open: boolean;
  onClose: () => void;
  customer?: Customer | null;
};

export function FormData({ open, onClose, customer }: FormDataProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      doc: "",
      type_doc: "",
      email: "",
      social_name: "",
      address: "",
      birthday: "",
      phone: "",
      gender: "",
    },
  });

  useEffect(() => {
    if (customer) {
      form.reset({
        id: customer.id || undefined,
        name: customer.name || "",
        doc: customer.doc ? onlyDigits(customer.doc) : "",
        type_doc: customer.type_doc || "",
        email: customer.email || "",
        social_name: customer.social_name || "",
        address: customer.address || "",
        birthday: customer.birthday || "",
        phone: customer.phone ? onlyDigits(customer.phone) : "",
        gender: customer.gender || "",
      });
      return;
    }
    form.reset({
      name: "",
      doc: "",
      type_doc: "",
      email: "",
      social_name: "",
      address: "",
      birthday: "",
      phone: "",
      gender: "",
    });
    return;
  }, [customer]);

  const { mutateAsync: save } = saveCustomer();

  async function handleSubmit(data: FormData) {
    const payload = {
      ...data,
      phone: onlyDigits(data.phone),
      doc:
        data.doc && onlyDigits(data.doc).length === 11
          ? onlyDigits(data.doc)
          : undefined,
    };
    await save(payload);
    onClose();
  }

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <Form {...form}>
          <form className="space-y-4">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {customer ? "Atualizar Cliente" : "Cadastrar Cliente"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                Digite e confirme os dados do cliente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
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
                  name="doc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documento</FormLabel>
                      <FormControl>
                        <PatternFormat
                          format="###.###.###-##"
                          mask="_"
                          placeholder="000.000.000-00"
                          customInput={Input}
                          value={field.value || ""}
                          onValueChange={(values: NumberFormatValues) =>
                            field.onChange(values.value)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="type_doc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Documento</FormLabel>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        {(() => {
                          const digits = onlyDigits(field.value || "");
                          const isMobile = digits.length > 10;
                          const format = isMobile
                            ? "(##) #####-####"
                            : "(##) ####-####";
                          const placeholder = isMobile
                            ? "(11) 98765-4321"
                            : "(11) 3456-7890";
                          return (
                            <PatternFormat
                              format={format}
                              mask="_"
                              placeholder={placeholder}
                              customInput={Input}
                              value={field.value || ""}
                              onValueChange={(values: NumberFormatValues) =>
                                field.onChange(values.value)
                              }
                            />
                          );
                        })()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                <Button type="button" onClick={form.handleSubmit(handleSubmit)}>
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
