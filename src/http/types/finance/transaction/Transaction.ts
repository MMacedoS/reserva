export interface Transaction {
  id?: string;
  amount: number;
  cashbox_id?: string;
  description: string;
  origin: string;
  payment_form: string;
  created_at: string; // Changed from date to created_at
  type: string;
}

export type TransactionRequest = Omit<Transaction, "id"> & {
  id?: string;
};
