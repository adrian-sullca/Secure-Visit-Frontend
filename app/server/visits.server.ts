import {
  Visits,
  VisitFilters,
  FormDataAddFamilyVisit,
  FormDataAddProfessionalVisit,
} from "~/types/visits.types";
import axiosInstance from "~/config/axios.config";
import { isAxiosError } from "axios";

export async function getAllVisits(authToken: string, filters?: VisitFilters) {
  try {
    const params = new URLSearchParams();

    params.set("per_page", filters?.perPage || "10");
    params.set("page", filters?.page || "1");

    const filterMappings = {
      visitState: "visit_state",
      visitType: "visit_type",
      visitName: "visit_name",
      visitSurname: "visit_surname",
      visitEmail: "visit_email",
      visitDateEntry: "date_entry",
      visitDateExit: "date_exit",
      visitTimeEntry: "time_entry",
      visitTimeExit: "time_exit",
      // Family Visit Filters
      studentName: "student_name",
      studentSurname: "student_surname",
      studentCourse: "student_course",
      motiveId: "motive_id",

      // Professional Visit Filters
      professionalNIF: "professional_NIF",
      serviceId: "service_id",
      task: "task",
      companyCIF: "company_CIF",
      companyName: "company_name",
      companyTelephone: "company_telephone",
    };

    if (filters) {
      for (const [formKey, apiKey] of Object.entries(filterMappings)) {
        const value = filters[formKey as keyof typeof filters];
        if (value && value !== "all" && value !== "0") {
          params.set(apiKey, value.toString());
        }
      }
    }

    const response = await axiosInstance.get(
      `/entry-exits?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return {
        meta: {
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total,
          perPage: response.data.per_page,
        },
        visits: formatVisitData(response.data.data),
      };
    }
  } catch (error) {
    console.log(error);
  }
}

export async function createFamilyVisit(
  authToken: string,
  familyVisit: FormDataAddFamilyVisit
) {
  try {
    const familyVisitMap = {
      visit_type: "family",
      name: familyVisit.visitName,
      surname: familyVisit.visitSurname,
      email: familyVisit.visitEmail,
      student_name: familyVisit.studentName,
      student_surname: familyVisit.studentSurname,
      student_course: familyVisit.studentCourse,
      motive_id: familyVisit.motiveId,
      custom_motive: familyVisit.motiveDescription,
    };

    const response = await axiosInstance.post("/entry", familyVisitMap, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status == 201) {
      console.log(response.data);
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Mensaje del backend:", error.response?.data?.message);

      if (error.response?.data?.errors) {
        console.error("Errores de validación:", error.response.data.errors);
      }
    } else {
      console.error("Error desconocido:", error);
    }
  }
}

export async function createProfessionalVisit(
  authToken: string,
  professionalVisit: FormDataAddProfessionalVisit
) {
  try {
    const professionalVisitMap = {
      visit_type: "professional",
      name: professionalVisit.visitName,
      surname: professionalVisit.visitSurname,
      email: professionalVisit.visitEmail,
      NIF: professionalVisit.professionalNIF,
      age: professionalVisit.professionalAge,
      task: professionalVisit.taskDescription,
      service_id: professionalVisit.serviceId,
      CIF: professionalVisit.companyCIF,
      company_name: professionalVisit.companyName,
      company_telephone: professionalVisit.companyTelephone,
    };

    const response = await axiosInstance.post("/entry", professionalVisitMap, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status == 201) {
      console.log(response.data);
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.error("Mensaje del backend:", error.response?.data?.message);

      if (error.response?.data?.errors) {
        console.error("Errores de validación:", error.response.data.errors);
      }
    } else {
      console.error("Error desconocido:", error);
    }
  }
}

export async function markExitVisit(authToken: string, entryId: number) {
  try {
    const response = await axiosInstance.post(
      `/exit/${entryId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status == 201) {
      console.log(response.data);
    }
  } catch (error) {
    console.error(error);
  }
}

function formatVisitData(visits: Visits[]) {
  return visits.map((visit) => {
    const [dateEntryValue, timeEntryRaw] = visit.date_entry?.split(" ") ?? [
      null,
      null,
    ];
    const [dateExitValue, timeExitRaw] = visit.date_exit?.split(" ") ?? [
      null,
      null,
    ];

    const formatDateToSpanish = (dateStr: string | null) => {
      if (!dateStr) return null;
      const [year, month, day] = dateStr.split("-");
      return `${day}/${month}/${year}`;
    };

    const family = visit.visit?.family_visit;
    const professional = visit.visit?.professional_visit;
    const company = professional?.company;
    const professionalService = visit.professional_service;

    return {
      id: visit.id,
      user_id: visit.user_id,
      visit_id: visit.visit_id,
      visit_type: visit.visit_type,

      date_entry_value: dateEntryValue,
      date_entry_formatted: formatDateToSpanish(dateEntryValue),
      time_entry: timeEntryRaw?.slice(0, 5) ?? null,

      date_exit_value: dateExitValue,
      date_exit_formatted: formatDateToSpanish(dateExitValue),
      time_exit: timeExitRaw?.slice(0, 5) ?? null,

      visit_name: visit.visit?.name ?? "",
      visit_surname: visit.visit?.surname ?? "",
      visit_email: visit.visit?.email ?? "",

      // Family Visit Data
      student_name: family?.student_name ?? null,
      student_surname: family?.student_surname ?? null,
      student_course: family?.student_course ?? null,
      motive_id: family?.motive?.id ?? null,
      motive_name: family?.motive?.name ?? null,
      custom_motive: family?.custom_motive ?? null,

      // Professional Visit Data
      company_id: professional?.company_id ?? null,
      NIF: professional?.NIF ?? null,
      age: professional?.age ?? null,

      // Professional Service Data (nuevo)
      service_id: professionalService?.service_id ?? null,
      service_name: professionalService?.service?.name ?? null,
      task: professionalService?.task ?? null,

      // Company Data
      company_CIF: company?.CIF ?? null,
      company_name: company?.name ?? null,
      company_telephone: company?.telephone ?? null,
    };
  });
}
