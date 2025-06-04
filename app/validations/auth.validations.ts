import { ValidationErrors } from "../types/general.types";
import { LoginFormData, RegisterFormData } from "../types/auth.types";
import {
  REGEX_NAME_SURNAME,
  REGEX_EMAIL,
  REGEX_PASSWORD,
} from "./../utils/regex";

export function validateLoginFormData(
  formData: LoginFormData
): ValidationErrors | null {
  const validationErrors: ValidationErrors = {};

  if (!formData.email) {
    validationErrors.email = "Email is required";
  } else if (!REGEX_EMAIL.test(formData.email)) {
    validationErrors.email = "Email is invalid";
  }

  if (!formData.password) {
    validationErrors.password = "Password is required";
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}

export function validateRegisterFormData(
  formData: RegisterFormData
): ValidationErrors | null {
  const validationErrors: ValidationErrors = {};

  if (!formData.name) {
    validationErrors.name = "Name are required";
  } else if (!REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = "Name should only contain letters";
  }

  if (!formData.email) {
    validationErrors.email = "Email is required";
  } else if (!REGEX_EMAIL.test(formData.email)) {
    validationErrors.email = "Email is invalid";
  }

  if (!formData.password) {
    validationErrors.password = "Password is required";
  } else if (!REGEX_PASSWORD.test(formData.password)) {
    validationErrors.password =
      "The password needs to meet the complexity requirements";
  }

  if (!formData.password_confirmation) {
    validationErrors.password_confirmation = "Confirm Password is required";
  } else if (formData.password !== formData.password_confirmation) {
    validationErrors.password_confirmation = "Passwords do not match";
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}
