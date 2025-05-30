import { ValidationErrors } from "../types/general.types";
import { LoginFormData, RegisterFormData } from "../types/auth.types";

const NAME_REGEX = /^[a-zA-Z\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;

export function validateLoginFormData(
  formData: LoginFormData
): ValidationErrors | null {
  const validationErrors: ValidationErrors = {};

  if (!formData.email) {
    validationErrors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(formData.email)) {
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
  } else if (!NAME_REGEX.test(formData.name)) {
    validationErrors.name = "Name should only contain letters";
  }

  if (!formData.email) {
    validationErrors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(formData.email)) {
    validationErrors.email = "Email is invalid";
  }

  if (!formData.password) {
    validationErrors.password = "Password is required";
  } else if (!PASSWORD_REGEX.test(formData.password)) {
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
