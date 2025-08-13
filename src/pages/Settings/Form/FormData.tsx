import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
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
import { Textarea } from "@/components/ui/textarea";
import { updateSettings } from "@/http/settings/updateSettings";
import type { settingResponse } from "@/http/types/settings/settingResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const createSettingSchema = z.object({
  company_name: z
    .string()
    .min(3, "o nome é obrigatório conter  no minino 3 caracteres")
    .max(100, "Não deve ultrapassar 100 caracteres"),
  email: z.email("Email inválido").min(5, "Email é obrigatório"),
  cnpj: z.string(),
  phone: z.string(),
  address: z.string(),
  checkin: z.string(),
  checkout: z.string(),
  percentage_service_fee: z.string(),
  cleaning_rate: z.string(),
  allow_booking_online: z.string(),
  cancellation_policies: z.string(),
});

type CreateSettingFormData = z.infer<typeof createSettingSchema>;

type settingProps = { setting: settingResponse };

export function FormData({ setting }: settingProps) {
  const { mutateAsync: createSettings } = updateSettings();
  const form = useForm<CreateSettingFormData>({
    resolver: zodResolver(createSettingSchema),
    defaultValues: {
      company_name: setting?.company_name ?? "",
      email: setting?.email ?? "",
      cnpj: setting?.cnpj ?? "",
      phone: setting?.phone ?? "",
      address: setting?.address ?? "",
      checkin: setting?.checkin ?? "",
      checkout: setting?.checkout ?? "",
      percentage_service_fee:
        setting?.percentage_service_fee != null
          ? setting.percentage_service_fee.toString()
          : "0",
      cleaning_rate:
        setting?.cleaning_rate != null ? setting.cleaning_rate.toString() : "0",
      allow_booking_online:
        setting?.allow_booking_online != null
          ? setting.allow_booking_online.toString()
          : "0",
      cancellation_policies: setting?.cancellation_policies ?? "",
    },
  });

  async function handleCreateForm(data: CreateSettingFormData) {
    await createSettings(data);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Configurações</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(handleCreateForm)}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cnpj</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="w-full">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="w-full col-span-2">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="allow_booking_online"
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
                              <SelectItem value="0">Não</SelectItem>
                              <SelectItem value="1">Sim</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="checkin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="checkout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="percentage_service_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Serviço</FormLabel>
                      <FormControl>
                        <Input type="number" step={0.01} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="cleaning_rate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de Limpeza</FormLabel>
                      <FormControl>
                        <Input type="number" step={0.01} {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols gap-4">
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="cancellation_policies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Política de Cancelamento</FormLabel>
                      <FormControl>
                        <Textarea {...field} maxLength={500} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="text-end">
              <Button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition ml-2"
              >
                Atualizar dados
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
