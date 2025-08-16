export interface Cashbox {
  id?: string;
  user_id?: string;
  initial_amount: number;
  current_balance?: number;
  status?: "aberto" | "fechado";
  opened_at?: string;
  final_amount?: number;
  total_input?: number;
  total_output?: number;
  total_bleed_box?: number;
  difference?: number;
  closed_at?: string;
  transactions?: any[];
  name?: string;
  obs?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CashboxRequest {
  initial_amount: number;
}
