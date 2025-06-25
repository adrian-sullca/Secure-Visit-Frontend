import {
  ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import VisitsTable from "~/components/visits/VisitsTable";
import { getUserByToken, requireAuth } from "~/server/auth.server";
import { getAllCompanies } from "~/server/companies.server";
import { getAllMotives } from "~/server/motives.server";
import { getAllServices } from "~/server/services.server";
import {
  createEntryVisit,
  deleteEntryVisit,
  getAllVisitors,
  getAllVisits,
  markExitVisit,
  updateVisitAndEntry,
} from "~/server/visits.server";
import {
  FormDataEntryVisit,
  FormDataFamilyVisit,
  FormDataProfessionalVisit,
  VisitFilters,
} from "~/types/visits.types";
import {
  validateFormDataEntryVisit,
  validateUpdateFormEntryVisit,
} from "~/validations/visit.validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Visits" },
    { name: "description", content: "Tabla de visitas" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const user = await getUserByToken(request);
  const resGetAllVisitors = await getAllVisitors(authToken);
  const resGetAllCompanies = await getAllCompanies(authToken);
  // Obtiene todas las entradas y salidas
  const resGetAllVisits = await getAllVisits(authToken);
  const resGetAllMotives = await getAllMotives(authToken);
  const resGetAllServices = await getAllServices(authToken);
  const courses = ["1 ESO", "2 ESO", "3 ESO", "4 ESO"]; // TODO: Obtener de base de datos

  return json({
    user: user,
    courses: courses,
    motives: resGetAllMotives?.motives,
    services: resGetAllServices?.services,
    visits: resGetAllVisits?.visits,
    visitors: resGetAllVisitors?.visitors,
    companies: resGetAllCompanies?.companies,
    meta: resGetAllVisits?.meta,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const authToken = await requireAuth(request);

  const intent = formData.get("intent");

  if (intent === "mark-exit") {
    const entryIdRaw = formData.get("entry_id");
    const entryId =
      typeof entryIdRaw === "string" && entryIdRaw !== ""
        ? Number(entryIdRaw)
        : null;
    if (entryId === null || isNaN(entryId)) {
      // TODO: MOSTRAR TOAST DE ERROR
      throw new Error("ID de entrada no válido");
    }

    await markExitVisit(authToken, entryId);

    return json({ success: true, message: "Salida marcada con exito" });
  }

  if (intent === "create") {
    const visitType = formData.get("visit_type");

    const formDataAddEntryVisit: FormDataEntryVisit = {
      visit_type: visitType as string,

      name: formData.get("visit_name") as string,
      surname: formData.get("visit_surname") as string,
      email: formData.get("visit_email") as string,

      student_name: formData.get("student_name") as string,
      student_surname: formData.get("student_surname") as string,
      student_course: formData.get("student_course") as string,
      motive_id: formData.get("motive_id") as string,
      custom_motive: formData.get("custom_motive") as string,

      NIF: formData.get("NIF") as string,
      age: formData.get("age") as string,
      service_id: formData.get("service_id") as string,
      task: formData.get("task") as string,

      CIF: formData.get("company_CIF") as string,
      company_name: formData.get("company_name") as string,
      company_telephone: formData.get("company_telephone") as string,
    };

    const clientSideValidationErrors = validateFormDataEntryVisit(
      formDataAddEntryVisit
    );

    if (clientSideValidationErrors)
      return json({
        success: false,
        clientSideValidationErrors,
        message: "Corrige los errores del formulario",
      });

    const resCreateEntryVisit = await createEntryVisit(
      authToken,
      formDataAddEntryVisit
    );
    console.log("respuestsa", resCreateEntryVisit);
    if (resCreateEntryVisit?.success) {
      return json({ success: true, message: resCreateEntryVisit.message });
    } else {
      return json({
        success: false,
        message: resCreateEntryVisit?.message,
        serverValidationErrors: toCamelCaseErrors(
          resCreateEntryVisit?.serverValidationErrors ?? {}
        ),
      });
    }
  } else if (intent === "update") {
    const entryId = formData.get("id") as string;
    const visitType = formData.get("visit_type");

    const date_entry_formatted =
      formData.get("date_entry_value") + " " + formData.get("time_entry");
    const date_exit_formatted =
      formData.get("date_exit_value") + " " + formData.get("time_exit");

    const entryVisitFormData: FormDataEntryVisit = {
      dateEntryForm: formData.get("date_entry_value") as string,
      timeEntryForm: formData.get("time_entry") as string,
      dateExitForm: formData.get("date_exit_value") as string,
      timeExitForm: formData.get("time_exit") as string,

      visit_type: visitType as string,
      visit_id: formData.get("visit_id") as string,
      date_entry: date_entry_formatted as string,
      date_exit: date_exit_formatted as string,
      name: formData.get("visit_name") as string,
      surname: formData.get("visit_surname") as string,
      email: formData.get("visit_email") as string,
      family_visit_id: "",
      student_name: "",
      student_surname: "",
      student_course: "",
      motive_id: "",
      custom_motive: "",
      company_id: "",
      NIF: "",
      age: "",
      service_id: "",
      task: "",
      CIF: "",
      company_name: "",
      company_telephone: "",
    };

    if (visitType == "family") {
      entryVisitFormData.family_visit_id = formData.get(
        "family_visit_id"
      ) as string;
      entryVisitFormData.student_name = formData.get("student_name") as string;
      entryVisitFormData.student_surname = formData.get(
        "student_surname"
      ) as string;
      entryVisitFormData.student_course = formData.get(
        "student_course"
      ) as string;
      entryVisitFormData.motive_id = formData.get("motive_id") as string;
      entryVisitFormData.custom_motive = formData.get(
        "custom_motive"
      ) as string;
    } else {
      entryVisitFormData.company_id = formData.get("company_id") as string;
      entryVisitFormData.NIF = formData.get("NIF") as string;
      entryVisitFormData.age = formData.get("age") as string;
      entryVisitFormData.service_id = formData.get("service_id") as string;
      entryVisitFormData.task = formData.get("task") as string;
      entryVisitFormData.CIF = formData.get("company_CIF") as string;
      entryVisitFormData.company_name = formData.get("company_name") as string;
      entryVisitFormData.company_telephone = formData.get(
        "company_telephone"
      ) as string;
    }

    const clientSideValidationErrors =
      validateUpdateFormEntryVisit(entryVisitFormData);

    console.log("clien side validation Errors", clientSideValidationErrors);

    if (clientSideValidationErrors)
      return json({
        success: false,
        clientSideValidationErrors,
        message: "Corrige los errores del formulario",
      });

    const updateEntryVisitData = await updateVisitAndEntry(
      authToken,
      entryId,
      entryVisitFormData
    );
    if (updateEntryVisitData?.success) {
      return json({ success: true, message: updateEntryVisitData.message });
    } else {
      return json({
        success: false,
        message: updateEntryVisitData?.message,
        serverValidationErrors: toCamelCaseErrors(
          updateEntryVisitData?.serverValidationErrors ?? {}
        ),
      });
    }
  } else if (intent == "delete") {
    const entryId = formData.get("entry_id") as string;

    const deleteEntry = await deleteEntryVisit(authToken, entryId);
    console.log(deleteEntry);
    return json({
      success: deleteEntry?.success,
      message: deleteEntry?.message,
    });
  } else {
    const perPage = formData.get("per_page") as string;
    const page = (formData.get("page") as string) || "1";

    // Filters
    const filters: VisitFilters = {
      page,
      perPage,
      visitState: formData.get("visitState") as string,
      visitType: formData.get("visitType") as string,
      visitName: formData.get("visitName") as string,
      visitSurname: formData.get("visitSurname") as string,
      visitEmail: formData.get("visitEmail") as string,
      visitDateEntry: formData.get("visitDateEntry") as string,
      visitDateExit: formData.get("visitDateExit") as string,
      visitTimeEntry: formData.get("visitTimeEntry") as string,
      visitTimeExit: formData.get("visitTimeExit") as string,

      // Family Visit Filters
      studentName: formData.get("studentName") as string,
      studentSurname: formData.get("studentSurname") as string,
      studentCourse: formData.get("studentCourse") as string,
      motiveId: formData.get("visitMotiveId") as string,

      // Professional Visit Filters
      professionalNIF: formData.get("professionalNIF") as string,
      serviceId: formData.get("professionalServiceId") as string,
      task: formData.get("professionalTask") as string,
      companyCIF: formData.get("companyCIF") as string,
      companyName: formData.get("companyName") as string,
      companyTelephone: formData.get("companyTelephone") as string,
    };

    const result = await getAllVisits(authToken, filters);

    return json({
      visits: result?.visits,
      meta: result?.meta,
    });
  }
};

export default function AuthPage() {
  return (
    <div className="w-full flex justify-center">
      <VisitsTable />
    </div>
  );
}

function toCamelCaseErrors(
  errors: Record<string, string>
): Record<string, string> {
  const camelCased: Record<string, string> = {};
  for (const key in errors) {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
      letter.toUpperCase()
    );
    camelCased[camelKey] = errors[key];
  }
  return camelCased;
}
