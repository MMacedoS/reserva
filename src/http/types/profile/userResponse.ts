export interface userResponse {
  id: string;
  name: string;
  photo: string;
  arquivo_id: string;
  email: string;
  access: string;
  code: string;
  active: string | number;
  created_at: string | null;
  updated_at: string | null;
  pessoa_fisica: any | null;
}
