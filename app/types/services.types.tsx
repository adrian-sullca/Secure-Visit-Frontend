export interface Service {
  id: number;
  name: string;
  enabled: boolean;
}

export interface ServiceFormData {
  intent: string;
  id?: number;
  name: string;
  enabled: boolean;
}
