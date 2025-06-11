import { ValidationErrors } from "~/types/general.types";
import { UserFormData } from "~/types/user.types";
import { REGEX_EMAIL, REGEX_NAME_SURNAME, REGEX_PASSWORD } from "~/utils/regex";

export function validateUserFormData(
  formData: UserFormData
): ValidationErrors | null {
  const validationErrors: ValidationErrors = {};

  if (!formData.name) {
    validationErrors.name = "El nombre de usuario es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = "El nombre es invalido";
  }

  if (!formData.email) {
    validationErrors.email = "El email de usuario es obligatorio";
  } else if (!REGEX_EMAIL.test(formData.email)) {
    validationErrors.email = "El email es invalido";
  }

  if (formData.intent == "add") {
    if (!formData.password) {
      validationErrors.password = "La contraseña es obligatoria";
    } else if (!REGEX_PASSWORD.test(formData.password)) {
      validationErrors.password = "La contraseña no es segura";
    }
  }

  if (formData.intent == "update") {
    if (formData.password != "") {
      if (!REGEX_PASSWORD.test(formData.password)) {
        validationErrors.password = "La contraseña no es segura";
      }
    }
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}
