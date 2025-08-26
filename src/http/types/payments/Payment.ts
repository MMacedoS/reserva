export interface Payment {
  id?: string;
  sale_id?: string;
  amount: number;
  method: "cash" | "debit_card" | "credit_card" | "pix" | "transfer" | "other";
  status: "Pendente" | "Pago" | "Cancelado" | "Falhou";
  reference?: string;
  receipt_url?: string;
  receipt_number?: string;
  installments?: number;
  fee?: number;
  net_amount?: number;
  processor?: string;
  transaction_id?: string;
  authorization_code?: string;
  processed_at?: string;
  cancelled_at?: string;
  employee_id?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentRequest {
  sale_id?: string;
  amount: number;
  method: "cash" | "debit_card" | "credit_card" | "pix" | "transfer" | "other";
  installments?: number;
  reservation_id?: string;
  reference?: string;
  notes?: string;
  cashbox_id?: string;
}

export interface PaymentMethod {
  id?: string;
  name: string;
  type: "cash" | "card" | "digital" | "other";
  is_active: boolean;
  accepts_installments: boolean;
  max_installments?: number;
  fee_percentage?: number;
  processor?: string;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentSummary {
  total_amount: number;
  paid_amount: number;
  pending_amount: number;
  change_amount?: number;
  payments: Payment[];
}
