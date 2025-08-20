export interface Sale {
  id?: string;
  name?: string;
  sale_name?: string;
  description?: string;
  sale_date?: string;
  reservation_id?: string;
  payment_type?: string;
  amount?: number;
  current_amount?: number;
  payment_details?: any;
  payment_status?: string;
  payment_date?: string;
  user_name?: string;
  status?: string | number;
  cashbox_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleItem {
  id?: string;
  sale_id?: string;
  quantity?: number;
  product_name?: string;
  product_price?: number;
  amount?: number;
  total?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SaleRequest {
  name?: string;
  sale_name?: string;
  reservation_id?: string | null;
  payment_type?: string;
  amount?: number;
  items?: {
    quantity: number;
    product_name: string;
    product_price: number;
  }[];
}

export interface SaleUpdateRequest {
  payment_type?: string;
  amount?: number;
  sale_name?: string;
  status?: string;
}
