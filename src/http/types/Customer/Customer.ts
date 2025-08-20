export interface Customer {
  name: string;
  pessoa_fisica_id: string;
  nationality?: string;
  job?: string;
  doc?: string;
  type_doc?: string;
  representative?: string;
  company?: string;
  cnpj_company?: string;
  phone_company?: string;
  email_company?: string;
  active?: string;
  created_at: string;
  updated_at: string;
}

export type CustomerRequest = {
  name: string;
  email?: string;
  social_name?: string;
  address?: string;
  doc?: string;
  type_doc?: string;
  birthday?: string;
  phone?: string;
  gender?: string;
};
