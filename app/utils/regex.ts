export const REGEX_NAME_SURNAME = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
export const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const REGEX_PASSWORD = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_]).{6,}$/;
export const REGEX_CIF = /^[A-HJUVNPQRSW]\d{7}[0-9A-J]$/i;
export const REGEX_NIF = /^\d{8}[A-HJ-NP-TV-Z]$/i;
export const REGEX_AGE = /^(?:1[01][0-9]|120|[1-9][0-9]?|0)$/;
export const REGEX_PHONE_ES = /^(?:\+34)?[6789]\d{8}$/;
