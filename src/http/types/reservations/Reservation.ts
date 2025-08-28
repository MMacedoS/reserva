import type { Apartment } from "../apartments/Apartment";
import type { Customer } from "../Customer/Customer";

export type ReservationStatus =
  | "Reservada"
  | "Confirmada"
  | "Hospedada"
  | "Finalizada"
  | "Cancelada"
  | "Apagada";

export type ReservationType = "promocional" | "diaria" | "pacote";

export interface Reservation {
  id: string;
  code?: number;
  apartment?: Apartment;
  checkin: string;
  customer?: Customer;
  checkout: string;
  amount?: number;
  user?: string;
  estimated_value: number;
  consumption_value: number;
  paid_value: number;
  situation: ReservationStatus;
  type?: ReservationType;
  created_at?: string;
  updated_at?: string;
}

export interface ReservationRequest {
  id?: string;
  customer_id: string;
  apartment_id: string;
  check_in: string;
  check_out: string;
  guests?: number;
  amount?: number;
  status?: ReservationStatus;
  type?: ReservationType;
  notes?: string;
}
