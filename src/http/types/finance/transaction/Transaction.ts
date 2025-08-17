export interface Transaction {
  id?: string;
  code?: number;
  amount: number;
  cashbox_id?: string;
  description: string;
  origin: string;
  payment_form: string;
  created_at: string;
  type: string;
  canceled?: boolean;
}

export type TransactionRequest = Omit<Transaction, "id"> & {
  id?: string;
};
