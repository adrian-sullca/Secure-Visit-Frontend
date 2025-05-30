export type ValidationErrors = Record<string, string>;

export interface ValidationMessages {
  clientSideValidationErrors?: ValidationErrors;
  serverSideValidationErrors?: ValidationErrors;
}
