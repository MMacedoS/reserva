export interface Table {
  id?: string;
  name?: string;
  reservation_id?: string;
  sale_id?: string;
  sale_name?: string;
  sales_total?: number;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TableRequest {
  name: string;
  reservation_id?: string;
}

export interface TableReservation {
  id?: string;
  table_id: string;
  customer_name: string;
  customer_phone?: string;
  reserved_at: string;
  reserved_until: string;
  party_size: number;
  notes?: string;
  status: "active" | "completed" | "cancelled";
  employee_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TableOccupancy {
  table_id: string;
  customer_name?: string;
  party_size?: number;
  notes?: string;
}
