import { FormDataEntryVisit, VisitorData } from "../types/visits.types";
import { ValidationErrors } from "../types/general.types";
import {
  REGEX_NAME_SURNAME,
  REGEX_EMAIL,
  REGEX_CIF,
  REGEX_NIF,
  REGEX_AGE,
  REGEX_PHONE_ES,
} from "./../utils/regex";

export function validateFormDataEntryVisit(formData: FormDataEntryVisit) {
  const validationErrors: ValidationErrors = {};

  if (!formData.name) {
    validationErrors.name = "Nombre de visita es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = "Nombre de visita solo puede contener letras";
  }

  if (!formData.surname) {
    validationErrors.surname = "Apellido de visita es obligatorio";
  } else if (!REGEX_NAME_SURNAME.test(formData.surname)) {
    validationErrors.surname = "Apellido de visita solo puede contener letras";
  }

  if (!formData.email) {
    validationErrors.email = "Email es obligatorio";
  } else if (!REGEX_EMAIL.test(formData.email)) {
    validationErrors.email = "Email es invalido";
  }

  if (formData.visit_type == "family") {
    if (!formData.student_name) {
      validationErrors.student_name = "Nombre de estudiante es obligatorio";
    } else if (!REGEX_NAME_SURNAME.test(formData.student_name)) {
      validationErrors.student_name =
        "Nombre de estudiante solo puede contener letras";
    }

    if (!formData.student_surname) {
      validationErrors.student_surname =
        "Apellido de estudiante es obligatorio";
    } else if (!REGEX_NAME_SURNAME.test(formData.student_surname)) {
      validationErrors.student_surname =
        "Apellido de estudiante solo puede contener letras";
    }

    if (!formData.student_course) {
      validationErrors.student_course = "Curso de estudiante es obligatorio";
    }
  } else {
    if (!formData.NIF) {
      validationErrors.NIF = "NIF es obligatorio";
    } else if (!REGEX_NIF.test(formData.NIF)) {
      validationErrors.NIF = "NIF invalido";
    }

    if (!formData.age) {
      validationErrors.age = "Edad es obligatorio";
    } else if (!REGEX_AGE.test(formData.age)) {
      validationErrors.age = "Edad solo puede contener números";
    }

    if (!formData.CIF) {
      validationErrors.CIF = "CIF de empresa es obligatorio";
    } else if (!REGEX_CIF.test(formData.CIF)) {
      validationErrors.CIF = "CIF de empresa es invalido";
    }

    if (!formData.company_name) {
      validationErrors.company_name = "Nombre de empresa es obligatorio";
    } else if (!REGEX_NAME_SURNAME.test(formData.company_name)) {
      validationErrors.company_name = "Nombre de empresa es invalido";
    }

    if (!formData.company_telephone) {
      validationErrors.company_telephone = "Telefono de empresa es obligatorio";
    } else if (!REGEX_PHONE_ES.test(formData.company_telephone)) {
      validationErrors.company_telephone = "Telefono de empresa es invalido";
    }
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}

export function validateUpdateFormEntryVisit(formData: FormDataEntryVisit) {
  const validationErrors: ValidationErrors = {};

  // Comunes
  if (!formData.name || !REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = !formData.name
      ? "Nombre de visita es obligatorio"
      : "Nombre de visita solo puede contener letras";
  }

  if (!formData.surname || !REGEX_NAME_SURNAME.test(formData.surname)) {
    validationErrors.surname = !formData.surname
      ? "Apellido de visita es obligatorio"
      : "Apellido de visita solo puede contener letras";
  }

  if (!formData.email || !REGEX_EMAIL.test(formData.email)) {
    validationErrors.email = !formData.email
      ? "Email es obligatorio"
      : "Email inválido";
  }

  if (!formData.date_entry) {
    validationErrors.date_entry = "Fecha de entrada es obligatoria";
  }

  const hasDateExit = !!formData.dateExitForm;
  const hasTimeExit = !!formData.timeExitForm;

  if (hasDateExit && !hasTimeExit) {
    validationErrors.timeExit = "Hora de salida es obligatoria";
  }

  if (hasTimeExit && !hasDateExit) {
    validationErrors.dateExit = "Fecha de salida es obligatoria";
  }

  // Según el tipo de visita
  if (formData.visit_type === "family") {
    if (
      !formData.student_name ||
      !REGEX_NAME_SURNAME.test(formData.student_name)
    ) {
      validationErrors.student_name = !formData.student_name
        ? "Nombre de estudiante es obligatorio"
        : "Nombre de estudiante solo puede contener letras";
    }

    if (
      !formData.student_surname ||
      !REGEX_NAME_SURNAME.test(formData.student_surname)
    ) {
      validationErrors.student_surname = !formData.student_surname
        ? "Apellido de estudiante es obligatorio"
        : "Apellido de estudiante solo puede contener letras";
    }

    if (!formData.student_course) {
      validationErrors.student_course = "Curso de estudiante es obligatorio";
    }

    if (!formData.motive_id) {
      validationErrors.student_course = "El motivo es obligatorio";
    }
  } else {
    // professional
    if (!formData.NIF || !REGEX_NIF.test(formData.NIF)) {
      validationErrors.NIF = !formData.NIF
        ? "NIF es obligatorio"
        : "NIF inválido";
    }

    if (!formData.age || !REGEX_AGE.test(formData.age)) {
      validationErrors.age = !formData.age
        ? "Edad es obligatoria"
        : "Edad inválida";
    }

    if (!formData.service_id) {
      validationErrors.service_id = "Servicio es obligatorio";
    }

    if (!formData.task) {
      validationErrors.task = "Tarea es obligatoria";
    }

    if (!formData.CIF || !REGEX_CIF.test(formData.CIF)) {
      validationErrors.CIF = !formData.CIF
        ? "CIF es obligatorio"
        : "CIF inválido";
    }

    if (!formData.company_name) {
      validationErrors.company_name = "Nombre de la empresa es obligatorio";
    }

    if (
      !formData.company_telephone ||
      !REGEX_PHONE_ES.test(formData.company_telephone)
    ) {
      validationErrors.company_telephone = !formData.company_telephone
        ? "Teléfono de empresa es obligatorio"
        : "Teléfono inválido";
    }
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}

export function validateVisitorFormData(formData: VisitorData) {
  const validationErrors: ValidationErrors = {};

  if (!formData.name || !REGEX_NAME_SURNAME.test(formData.name)) {
    validationErrors.name = !formData.name
      ? "Nombre de visita es obligatorio"
      : "Nombre de visita solo puede contener letras";
  }

  if (!formData.surname || !REGEX_NAME_SURNAME.test(formData.surname)) {
    validationErrors.surname = !formData.surname
      ? "Apellido de visita es obligatorio"
      : "Apellido de visita solo puede contener letras";
  }

  if (!formData.email || !REGEX_EMAIL.test(formData.email)) {
    validationErrors.email = !formData.email
      ? "Email es obligatorio"
      : "Email inválido";
  }

  if (formData.visit_type == "professional") {
    if (!formData.NIF || !REGEX_NIF.test(formData.NIF)) {
      validationErrors.NIF = !formData.NIF
        ? "NIF es obligatorio"
        : "NIF inválido";
    }

    if (!formData.age || !REGEX_AGE.test(formData.age)) {
      validationErrors.age = !formData.age
        ? "Edad es obligatoria"
        : "Edad inválida";
    }

    if (!formData.CIF || !REGEX_CIF.test(formData.CIF)) {
      validationErrors.CIF = !formData.CIF
        ? "CIF es obligatorio"
        : "CIF inválido";
    }

    if (formData.intent == "add") {
      if (!formData.company_name) {
        validationErrors.company_name = "Nombre de la empresa es obligatorio";
      }

      if (
        !formData.company_telephone ||
        !REGEX_PHONE_ES.test(formData.company_telephone)
      ) {
        validationErrors.company_telephone = !formData.company_telephone
          ? "Teléfono de empresa es obligatorio"
          : "Teléfono inválido";
      }
    }
  }

  return Object.keys(validationErrors).length > 0 ? validationErrors : null;
}
