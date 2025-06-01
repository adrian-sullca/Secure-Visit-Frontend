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

export interface Motive {
  id: number;
  name: string;
}

export interface Service {
  id: number;
  name: string;
}

export interface Company {
  id: number;
  CIF: string;
  name: string;
  telephone: string;
  created_at: string;
  updated_at: string;
}
export interface ProfessionalVisit {
  id: number;
  visit_id: number;
  company_id: number;
  NIF: string;
  age: number;
  service: Service;
  task: string;
  created_at: string;
  updated_at: string;
  company: Company;
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

  // Datos de visitas familiares
  student_name: string | null;
  student_surname: string | null;
  student_course: string | null;
  motive_id: string | number | null;
  motive_name: string | null;
  custom_motive: string | null;

  // Datos de visitas profesionales
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
