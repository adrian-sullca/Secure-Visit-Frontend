export interface Motive {
  id: number;
  name: string;
  enabled: boolean;
}

export interface MotiveFormData {
  intent: string;
  id?: number;
  name: string;
  enabled: boolean;
}
