import { Company } from "./companies.types";
import { Motive } from "./motives.types";
import { Service } from "./services.types";

export interface FamilyVisit {
  id: number;
  visit_id: number;
  student_name: string;
  student_surname: string;
  student_course: string;
  motive: Motive;
  custom_motive: string;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalVisit {
  id: number;
  visit_id: number;
  company_id: number;
  NIF: string;
  age: number;
  created_at: string;
  updated_at: string;
  company: Company;
}

export interface ProfessionalService {
  id: number;
  entry_exit_id: number;
  professional_id: number;
  service_id: number;
  task: string;
  created_at: string;
  updated_at: string;
  service: Service;
}

export interface Visit {
  id: number;
  name: string;
  surname: string;
  email: string;
  created_at: string;
  updated_at: string;
  family_visit?: FamilyVisit;
  professional_visit?: ProfessionalVisit;
}

export interface Visits {
  id: number;
  user_id: number;
  visit_id: number;
  visit_type: string;
  date_entry: string;
  date_exit: string;
  created_at: string;
  updated_at: string;
  visit: Visit;
  professional_service?: ProfessionalService;
}

export interface VisitFormatted {
  id: string | number;
  user_id: string | number;
  visit_id: string | number;
  visit_type: string;

  date_entry_value: string;
  date_entry_formatted: string;
  time_entry: string;

  date_exit_value: string;
  date_exit_formatted: string;
  time_exit: string | null;

  visit_name: string;
  visit_surname: string;
  visit_email: string;

  student_name: string | null;
  student_surname: string | null;
  student_course: string | null;
  motive_id: string | number | null;
  motive_name: string | null;
  custom_motive: string | null;

  company_id: string | number | null;
  NIF: string | null;
  age: string | number | null;
  service_id: string | number | null;
  service_name: string | null;
  task: string | null;

  company_CIF: string | null;
  company_name: string | null;
  company_telephone: string | null;
}

export interface VisitFilters {
  // Pagination
  page: string;
  perPage: string;

  // General Visit Filters
  visitState: string;
  visitType: string;
  visitName: string;
  visitSurname: string;
  visitEmail: string;
  visitDateEntry: string;
  visitDateExit: string;
  visitTimeEntry: string;
  visitTimeExit: string;

  // Family Visit Filters
  studentName: string;
  studentSurname: string;
  studentCourse: string;
  motiveId: string;

  // Professional Visit Filters
  professionalNIF: string;
  serviceId: string;
  task: string;
  companyCIF: string;
  companyName: string;
  companyTelephone: string;
}

export interface FormDataAddFamilyVisit {
  visitType: string;
  motiveId: string;
  motiveDescription: string;
  visitName: string;
  visitSurname: string;
  visitEmail: string;
  studentName: string;
  studentSurname: string;
  studentCourse: string;
}

export interface FormDataAddProfessionalVisit {
  visitType: string;
  serviceId: string;
  taskDescription: string;
  professionalNIF: string;
  professionalAge: string;
  visitName: string;
  visitSurname: string;
  visitEmail: string;
  companyCIF: string;
  companyName: string;
  companyTelephone: string;
}
