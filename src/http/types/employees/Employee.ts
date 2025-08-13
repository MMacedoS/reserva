export interface Employee {
  id: string;
  code: string;
  name: string;
  email: string;
  photo?: string;
  arquivo_id?: string;
  access: string;
  pessoa_fisica?: any;
  active: number | string;
  created_at: string | null;
  updated_at: string | null;
}

export interface EmployeeRequest {
  name: string;
  email: string;
  password?: string;
  access: string;
  active: string;
}
