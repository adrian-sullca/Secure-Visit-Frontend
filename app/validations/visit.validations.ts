import {
  FormDataAddFamilyVisit,
  FormDataAddProfessionalVisit,
} from "../types/visits.types";
import { ValidationErrors } from "../types/general.types";
import { REGEX_NAME_SURNAME, REGEX_EMAIL, REGEX_CIF, REGEX_NIF, REGEX_AGE, REGEX_PHONE_ES } from "./../utils/regex";

export function validateFormAddFamilyVisit(formData: FormDataAddFamilyVisit) {
  const validationErrors: ValidationErrors = {};

  if (!formData.visitName) {
    validationErrors.visitName = "Nombre de visita es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.visitName)) {
    validationErrors.visitName = "Nombre de visita solo puede contener letras";
  }

  if (!formData.visitSurname) {
    validationErrors.visitSurname = "Apellido de visita es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.visitSurname)) {
    validationErrors.visitSurname =
      "Apellido de visita solo puede contener letras";
  }

  if (!formData.visitEmail) {
    validationErrors.visitEmail = "Email es obligatorio";
  } else if (!REGEX_EMAIL.test(formData.visitEmail)) {
    validationErrors.visitEmail = "Email es invalido";
  }

  if (!formData.studentName) {
    validationErrors.studentName = "Nombre de estudiante es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.studentName)) {
    validationErrors.studentName =
      "Nombre de estudiante solo puede contener letras";
  }

  if (!formData.studentSurname) {
    validationErrors.studentSurname = "Apellido de estudiante es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.studentSurname)) {
    validationErrors.studentSurname =
      "Apellido de estudiante solo puede contener letras";
  }

  if (!formData.studentCourse) {
    validationErrors.studentCourse = "Curso de estudiante es obligatorio";
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}

export function validateFormAddProfessionalVisit(
  formData: FormDataAddProfessionalVisit
) {
  const validationErrors: ValidationErrors = {};

  if (!formData.professionalNIF) {
    validationErrors.professionalNIF = "NIF es obligatorio";
  } else if (!REGEX_NIF.test(formData.professionalNIF)) {
    validationErrors.professionalNIF = "NIF invalido";
  }

  if (!formData.professionalAge) {
    validationErrors.professionalAge = "Edad es obligatorio";
  } else if (!REGEX_AGE.test(formData.professionalAge)) {
    validationErrors.professionalAge = "Edad solo puede contener números";
  }

  if (!formData.visitName) {
    validationErrors.visitName = "Nombre de visita es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.visitName)) {
    validationErrors.visitName = "Nombre solo puede contener letras";
  }

  if (!formData.visitSurname) {
    validationErrors.visitSurname = "Apellido de visita es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.visitSurname)) {
    validationErrors.visitSurname =
      "Apellido solo puede contener letras";
  }

  if (!formData.visitEmail) {
    validationErrors.visitEmail = "Email es obligatorio";
  } else if (!REGEX_EMAIL.test(formData.visitEmail)) {
    validationErrors.visitEmail = "Email es invalido";
  }

  if (!formData.companyCIF) {
    validationErrors.companyCIF = "CIF de empresa es obligatorio";
  } else if (!REGEX_CIF.test(formData.companyCIF)) {
    validationErrors.companyCIF = "CIF de empresa es invalido";
  }

  if (!formData.companyName) {
    validationErrors.companyName = "Nombre de empresa es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.companyName)) {
    validationErrors.companyName = "Nombre de empresa es invalido";
  }

  if (!formData.companyTelephone) {
    validationErrors.companyTelephone = "Telefono de empresa es obligatorio";
  } else if (!REGEX_PHONE_ES.test(formData.companyTelephone)) {
    validationErrors.companyTelephone = "Telefono de empresa es invalido";
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}
