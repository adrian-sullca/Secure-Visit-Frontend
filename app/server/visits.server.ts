import {
  Visits,
  VisitFilters,
  FormDataEntryVisit,
  VisitorData,
} from "~/types/visits.types";
import axiosInstance from "~/config/axios.config";
import { isAxiosError } from "axios";
import { ValidationErrors } from "~/types/general.types";

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
    console.log("aquiii", response.data.data[0]);
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

export async function createEntryVisit(
  authToken: string,
  entryVisitData: FormDataEntryVisit
) {
  try {
    const response = await axiosInstance.post("/entry", entryVisitData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    if (response.status == 201) {
      return {
        success: true,
        message: "Entrada creada correctamente",
      };
    }
  } catch (error) {
    if (isAxiosError(error)) {
      console.log("aqui2");
      console.log(error.response);
      if (error.response?.data?.errors) {
        const backendErrors = error.response?.data?.errors;

        const serverValidationErrors: ValidationErrors = {};
        if (backendErrors) {
          for (const key in backendErrors) {
            if (Array.isArray(backendErrors[key])) {
              serverValidationErrors[key] = backendErrors[key][0];
            } else {
              serverValidationErrors[key] = backendErrors[key];
            }
          }
        }

        console.log("Errores de validación: ", serverValidationErrors);
        return {
          success: false,
          message: "Error al crear entrada",
          serverValidationErrors,
        };
      }
    } else {
      return {
        success: false,
        message: "Error inesperado",
      };
    }
  }
}

export async function updateVisitAndEntry(
  authToken: string,
  entryId: string,
  entryVisitData: FormDataEntryVisit
) {
  try {
    const response = await axiosInstance.patch(
      `/entry/${entryId}`,
      entryVisitData,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status == 200) {
      return {
        success: true,
        message: "Visita actualizada con éxito",
      };
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data?.errors) {
        console.error("Errores de validación:", error.response.data.errors);
        const backendErrors = error.response?.data?.errors;

        const serverValidationErrors: ValidationErrors = {};
        if (backendErrors) {
          for (const key in backendErrors) {
            if (Array.isArray(backendErrors[key])) {
              serverValidationErrors[key] = backendErrors[key][0];
            } else {
              serverValidationErrors[key] = backendErrors[key];
            }
          }
        }

        console.log("serverV", serverValidationErrors);
        return {
          success: false,
          message:
            error.response?.data?.message || "Error al actualizar la visita",
          serverValidationErrors,
        };
      }
    } else {
      console.error("Error inesperado:", error);
      return {
        success: false,
        message: "Error al actualizar la visita de familia",
      };
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
    console.log(response.data);
    if (response.status == 201) {
      console.log(response.data);
    }
  } catch (error) {
    console.log(error);
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
      family_visit_id: family?.id ?? null,
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

export async function getAllVisitors(authToken: string) {
  try {
    const response = await axiosInstance.get("/visits", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) {
      return {
        success: true,
        visitors: response.data.visitors,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
    };
  }
}

export async function deleteEntryVisit(authToken: string, entryId: string) {
  try {
    const response = await axiosInstance.delete(`/entry/${entryId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status == 204) {
      return {
        success: true,
        message: "Entrada eliminada correctamente",
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Error al eliminar entrada",
    };
  }
}

export async function addVisitor(authToken: string, visitorData: VisitorData) {
  try {
    const response = await axiosInstance.post("/visitor", visitorData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status == 200) {
      return {
        success: true,
        message: "Visitante creado con éxito",
      };
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response?.data?.errors;

        const serverValidationErrors: ValidationErrors = {};
        if (backendErrors) {
          for (const key in backendErrors) {
            if (Array.isArray(backendErrors[key])) {
              serverValidationErrors[key] = backendErrors[key][0];
            } else {
              serverValidationErrors[key] = backendErrors[key];
            }
          }
        }

        console.log("serverV", serverValidationErrors);
        return {
          success: false,
          message:
            error.response?.data?.message || "Error al crear el visitante",
          serverValidationErrors,
        };
      }
    } else {
      console.error("Error inesperado:", error);
      return {
        success: false,
        message: "Error al crear el visitante",
      };
    }
  }
}

export async function updateVisitor(
  authToken: string,
  visitorData: VisitorData,
  visitorId: string
) {
  try {
    const response = await axiosInstance.patch(`/visitor/${visitorId}`, visitorData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status == 200) {
      return {
        success: true,
        message: "Visitante actualizado con éxito",
      };
    }
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.data?.errors) {
        const backendErrors = error.response?.data?.errors;

        const serverValidationErrors: ValidationErrors = {};
        if (backendErrors) {
          for (const key in backendErrors) {
            if (Array.isArray(backendErrors[key])) {
              serverValidationErrors[key] = backendErrors[key][0];
            } else {
              serverValidationErrors[key] = backendErrors[key];
            }
          }
        }

        console.log("serverV", serverValidationErrors);
        return {
          success: false,
          message:
            error.response?.data?.message || "Error al actualizar el visitante",
          serverValidationErrors,
        };
      }
    } else {
      console.error("Error inesperado:", error);
      return {
        success: false,
        message: "Error al actualizar el visitante",
      };
    }
  }
}
