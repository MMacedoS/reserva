import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatValueToBRL = (value: number | string = 0) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
};

export const formatDateWithTime = (date: string | null) => {
  if (!date) return "N/A";
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(date).toLocaleDateString("pt-BR", options);
};

export const formatDate = (date: string | null) => {
  if (!date) return "N/A";
  const date_split = date.split("-");
  return `${date_split[2]}/${date_split[1]}/${date_split[0]}`;
};

export const formatLocalDateTime = (date: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d}T${hh}:${mm}`;
};

export const formatLocalDateTimeAt = (date: Date, hours = 12, minutes = 0) => {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  return formatLocalDateTime(d);
};

export const textSlice = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
};

export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function isValidCPF(value: string): boolean {
  const cpf = onlyDigits(value);
  if (!cpf || cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcCheckDigit = (base: string, factor: number) => {
    let total = 0;
    for (let i = 0; i < base.length; i++) {
      total += parseInt(base[i], 10) * factor--;
    }
    const rest = total % 11;
    return rest < 2 ? 0 : 11 - rest;
  };

  const d1 = calcCheckDigit(cpf.substring(0, 9), 10);
  const d2 = calcCheckDigit(cpf.substring(0, 10), 11);
  return cpf[9] === String(d1) && cpf[10] === String(d2);
}
