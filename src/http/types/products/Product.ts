export interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  stock?: number;
  stock_quantity?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProductCategory {
  id?: string;
  name: string;
  description?: string;
  is_active: boolean;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ProductRequest {
  name: string;
  description?: string;
  price: number;
  category?: string;
  stock_quantity: number;
  status?: string;
}

export interface ProductStockUpdate {
  quantity: number;
  type: "add" | "subtract" | "set";
  reason?: string;
}

export interface StockMovement {
  id?: string;
  product_id: string;
  product_name?: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reason?: string;
  employee_id?: string;
  created_at?: string;
}
