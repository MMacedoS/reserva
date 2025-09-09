import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  Reservation,
  ReservationRequest,
  ReservationStatus,
  ReservationType,
} from "@/http/types/reservations/Reservation";
import { useSaveReservation } from "@/http/reservations/saveReservation";
import { getCustomers } from "@/http/customers/getCustomers";
import { addDays } from "date-fns";
import { useAvailableApartments } from "@/http/reservations/getAvailableApartments";
import { useSaveReservationsBatch } from "@/http/reservations/saveReservationsBatch";
import { formatLocalDateTimeAt } from "@/lib/utils";
import {
  RESERVATION_SITUATIONS,
  RESERVATION_TYPES,
} from "@/constants/reservations";

const ReservationStatusSchema = z.enum([
  "Reservada",
  "Confirmada",
  "Hospedada",
  "Finalizada",
  "Cancelada",
  "Apagada",
] as const);
const ReservationTypeSchema = z.enum([
  "promocional",
  "diaria",
  "pacote",
] as const);

const schema = z
  .object({
    id: z.string().optional(),
    customer_id: z.string().min(1, "Selecione um hóspede"),
    apartment_ids: z
      .array(z.string().min(1))
      .min(1, "Selecione pelo menos um apartamento"),
    check_in: z.string().min(1, "Informe a data de check-in"),
    check_out: z.string().min(1, "Informe a data de check-out"),
    guests: z.coerce.number().int().min(1, "Pelo menos 1 hóspede"),
    amount: z.coerce.number().min(0, "Valor inválido").optional(),
    status: ReservationStatusSchema,
    type: ReservationTypeSchema,
    notes: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.check_in || !data.check_out) return true;
      const ci = new Date(data.check_in);
      const co = new Date(data.check_out);
      return co > ci;
    },
    { path: ["check_out"], message: "Check-out deve ser após o check-in" }
  );

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onClose: () => void;
  reservation?: Reservation | null;
};

export function ReservationFormDialog({ open, onClose, reservation }: Props) {
  const [availableApartments, setAvailableApartments] = useState<any[]>([]);
  const hoje = new Date();

  const dataInicialPadrao = formatLocalDateTimeAt(hoje, 12, 0);
  const dataFinalPadrao = formatLocalDateTimeAt(addDays(hoje, 1), 12, 0);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as any,
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      customer_id: "",
      apartment_ids: [],
      check_in: dataInicialPadrao,
      check_out: dataFinalPadrao,
      guests: 1,
      amount: 0,
      status: "Reservada",
      type: "diaria",
      notes: "",
    },
  });

  const checkIn = form.watch("check_in");
  const checkOut = form.watch("check_out");
  const isEdit = !!reservation;

  const minCheckIn =
    isEdit && reservation?.checkin && reservation.checkin < dataInicialPadrao
      ? formatLocalDateTimeAt(new Date(reservation.checkin), 12, 0)
      : dataInicialPadrao;

  const minCheckOut = checkIn || minCheckIn;

  const { mutateAsync: saveReservation, isPending: saving } =
    useSaveReservation();

  const { mutateAsync: saveBatchReservations } = useSaveReservationsBatch();

  const { data: customers } = getCustomers({ page: 1, limit: 100 });

  const { data: availableFromApi, isLoading: loadingApartments } =
    useAvailableApartments({
      check_in: checkIn,
      check_out: checkOut,
    });

  useEffect(() => {
    setAvailableApartments(availableFromApi || []);
    if (!isEdit) {
      form.setValue("apartment_ids", []);
    }
  }, [availableFromApi, isEdit]);

  useEffect(() => {
    if (!checkIn) return;
    const ci = new Date(checkIn);
    const co = checkOut ? new Date(checkOut) : null;
    if (!co || co <= ci) {
      const novoCheckout = formatLocalDateTimeAt(addDays(ci, 1), 12, 0);
      form.setValue("check_out", novoCheckout, { shouldValidate: true });
    }
  }, [checkIn]);

  useEffect(() => {
    if (reservation) {
      form.reset({
        id: reservation.id,
        customer_id: reservation.customer?.id || "",
        apartment_ids: reservation.apartment ? [reservation.apartment.id] : [],
        check_in: reservation.checkin
          ? formatLocalDateTimeAt(new Date(reservation.checkin), 12, 0)
          : "",
        check_out: reservation.checkout
          ? formatLocalDateTimeAt(new Date(reservation.checkout), 12, 0)
          : "",
        amount: reservation.amount || 0,
        status: reservation.situation,
        type: reservation.type || "diaria",
        notes: "",
        guests: reservation.guests || 1,
      });
      return;
    }
    form.reset({
      customer_id: "",
      apartment_ids: [],
      check_in: dataInicialPadrao,
      check_out: dataFinalPadrao,
      guests: 1,
      amount: 0,
      status: "Reservada",
      type: "diaria",
      notes: "",
    });
  }, [reservation, form]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isEdit && data.apartment_ids.length > 1) {
      await saveBatchReservations({
        customer_id: data.customer_id,
        apartment_ids: data.apartment_ids,
        check_in: data.check_in,
        check_out: data.check_out,
        guests: data.guests,
        amount: data.amount,
        status: data.status as ReservationStatus,
        type: data.type as ReservationType,
        notes: data.notes,
      } as any);
      onClose();
      return;
    }

    const payload: ReservationRequest = {
      ...(data.id ? { id: data.id } : {}),
      customer_id: data.customer_id,
      apartment_id: (data.apartment_ids && data.apartment_ids[0]) as string,
      check_in: data.check_in,
      check_out: data.check_out,
      guests: data.guests,
      amount: data.amount,
      status: data.status as ReservationStatus,
      type: data.type as ReservationType,
      notes: data.notes,
    };
    await saveReservation(payload);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-3xl max-h-[90vh]">
        <div className="max-h-[80vh] overflow-y-auto">
          <Form {...form}>
            <form
              className="space-y-4"
              onSubmit={form.handleSubmit(onSubmit as any)}
            >
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {reservation ? "Atualizar Reserva" : "Cadastrar Reserva"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Preencha e confirme os dados da reserva.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <FormField
                name="id"
                render={({ field }) => <input type="hidden" {...field} />}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  name="check_in"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-in</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          step={900}
                          min={minCheckIn}
                          value={field.value}
                          onChange={(e) => {
                            const v = e.target.value;
                            const d = new Date(v);
                            if (!isNaN(d.getTime())) {
                              field.onChange(formatLocalDateTimeAt(d, 12, 0));
                              return;
                            }
                            field.onChange(v);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="check_out"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Check-out</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          step={900}
                          min={minCheckOut}
                          value={field.value}
                          onChange={(e) => {
                            const v = e.target.value;
                            const d = new Date(v);
                            if (!isNaN(d.getTime())) {
                              field.onChange(formatLocalDateTimeAt(d, 12, 0));
                            } else {
                              field.onChange(v);
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Hóspede</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o hóspede" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Hóspedes</SelectLabel>
                              {customers?.data?.map((c) => (
                                <SelectItem key={c.id} value={String(c.id)}>
                                  {c.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="apartment_ids"
                  render={({ field }) => {
                    const selectedFirst = (field.value || [])[0];
                    const selectedApt = availableApartments.find(
                      (a: any) =>
                        String(a.uuid || a.id) === String(selectedFirst)
                    );
                    const buttonText = isEdit
                      ? selectedApt?.name ||
                        reservation?.apartment?.name ||
                        "Selecione o apartamento"
                      : field.value?.length
                      ? `${field.value.length} Apt(s) selecionado(s)`
                      : "Selecione os apartamentos";

                    return (
                      <FormItem>
                        <FormLabel>
                          {isEdit ? "Apartamento" : "Apartamentos"}
                        </FormLabel>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between"
                            >
                              {buttonText}
                              <span className="opacity-50">▾</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-[var(--radix-select-trigger-width)] max-h-64 overflow-auto">
                            <DropdownMenuLabel>
                              {isEdit
                                ? "Selecionar apartamento"
                                : "Selecionar apartamentos"}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {loadingApartments ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                Carregando apartamentos...
                              </div>
                            ) : availableApartments.length === 0 ? (
                              <div className="p-2 text-sm text-muted-foreground">
                                Nenhum apartamento disponível
                              </div>
                            ) : (
                              availableApartments.map(
                                (a: any, index: number) => {
                                  const value = String(
                                    a.uuid || a.id || `${a.name}-${index}`
                                  );
                                  const checked = isEdit
                                    ? field.value && field.value[0] === value
                                    : (field.value || []).includes(value);
                                  return (
                                    <DropdownMenuCheckboxItem
                                      key={value}
                                      checked={checked}
                                      onCheckedChange={(isChecked) => {
                                        if (isEdit) {
                                          if (isChecked) {
                                            field.onChange([value]);
                                            return;
                                          }
                                          field.onChange([]);
                                          return;
                                        }
                                        const current: string[] = Array.isArray(
                                          field.value
                                        )
                                          ? field.value
                                          : [];
                                        if (isChecked) {
                                          if (!current.includes(value))
                                            field.onChange([...current, value]);
                                          return;
                                        }
                                        field.onChange(
                                          current.filter((v) => v !== value)
                                        );
                                      }}
                                    >
                                      {a.name} - {a.category}
                                    </DropdownMenuCheckboxItem>
                                  );
                                }
                              )
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />

                <FormField
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Hóspedes</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          value={field.value ?? 1}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Total (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Situação</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                          <SelectContent>
                            {RESERVATION_SITUATIONS.map((situation) => (
                              <SelectItem
                                key={situation.value}
                                value={situation.value}
                              >
                                {situation.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {RESERVATION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="notes"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <AlertDialogFooter>
                <AlertDialogCancel onClick={onClose}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction asChild>
                  <Button
                    type="submit"
                    disabled={saving || (!isEdit && !form.formState.isValid)}
                  >
                    Salvar
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
