export interface User {
  id: number;
  name: string;
  email: string;
  admin: boolean;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserFormData {
  intent: string;
  id?: number;
  name: string;
  email: string;
  password: string;
  password_confirmation?: string;
  admin: boolean;
  enabled: boolean;
}
