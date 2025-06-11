import { CompanyFormData } from "~/types/companies.types";
import { ValidationErrors } from "~/types/general.types";
import { REGEX_CIF, REGEX_NAME_SURNAME, REGEX_PHONE_ES } from "~/utils/regex";

export function validateCompanyFormData(
  formData: CompanyFormData
) {
  const validationErrors: ValidationErrors = {};

  if (!formData.CIF) {
    validationErrors.CIF = "CIF es obligatorio";
  } else if (!REGEX_CIF.test(formData.CIF)) {
    validationErrors.CIF = "CIF invalido";
  }

  if (!formData.telephone) {
    validationErrors.telephone = "Telefono es obligatorio";
  } else if (!REGEX_PHONE_ES.test(formData.telephone)) {
    validationErrors.telephone = "El telefono es invalido";
  }

  if (!formData.name) {
    validationErrors.name = "Nombre obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = "Nombre solo puede contener letras";
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}