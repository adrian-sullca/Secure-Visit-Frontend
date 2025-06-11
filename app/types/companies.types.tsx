export interface Company {
  id: number;
  CIF: string;
  name: string;
  telephone: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface CompanyFormData {
  intent: string;
  id?: number;
  CIF: string;
  name: string;
  telephone: string;
  enabled: boolean;
}
