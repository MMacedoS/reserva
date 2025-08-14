export interface Cashbox {
  id?: string;
  user_id?: string;
  initial_amount: number | string;
  current_balance?: number;
  status?: "aberto" | "fechado";
  opened_at?: string;
  closed_at?: string;
  transactions?: any[];
  obs?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CashboxRequest {
  initial_amount: number;
}
