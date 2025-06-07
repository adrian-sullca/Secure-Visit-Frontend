import { ValidationErrors } from "~/types/general.types";
import { ServiceFormData } from "~/types/services.types";
import { REGEX_NAME_SURNAME } from "~/utils/regex";

export function validateServiceFormData(
  formData: ServiceFormData
): ValidationErrors | null {
  const validationErrors: ValidationErrors = {};

  if (!formData.name) {
    validationErrors.name = "El nombre de servicio es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = "El nombre es invalido";
  }

  if (formData.intent == "update") {
    if (typeof formData.enabled !== "boolean") {
      validationErrors.enabled = "El estado debe ser activo o inactivo";
    }
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}