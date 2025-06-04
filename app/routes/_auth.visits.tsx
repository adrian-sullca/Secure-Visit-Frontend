import {
  ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import VisitsTable from "~/components/visits/VisitsTable";
import { requireAuth } from "~/server/auth.server";
import { getAllMotives } from "~/server/motives.server";
import { getAllServices } from "~/server/service.server";
import {
  createFamilyVisit,
  createProfessionalVisit,
  getAllVisits,
  markExitVisit,
} from "~/server/visits.server";
import {
  FormDataAddFamilyVisit,
  FormDataAddProfessionalVisit,
  VisitFilters,
} from "~/types/visits.types";
import {
  validateFormAddFamilyVisit,
  validateFormAddProfessionalVisit,
} from "~/validations/visit.validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Visits" },
    { name: "description", content: "Tabla de visitas" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const resGetAllVisits = await getAllVisits(authToken);
  const resGetAllMotives = await getAllMotives(authToken);
  const resGetAllServices = await getAllServices(authToken);
  const courses = ["1 ESO", "2 ESO", "3 ESO", "4 ESO"]; // TODO: Obtener de base de datos
  console.log("data formateada", resGetAllVisits?.visits);
  return json({
    courses: courses,
    motives: resGetAllMotives?.motives,
    services: resGetAllServices?.services,
    visits: resGetAllVisits?.visits,
    meta: resGetAllVisits?.meta,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const authToken = await requireAuth(request);

  const intent = formData.get("intent");
  console.log("intneto", intent);
  if (intent === "mark-exit") {
    const entryIdRaw = formData.get("entry_id");
    const entryId =
      typeof entryIdRaw === "string" && entryIdRaw !== ""
        ? Number(entryIdRaw)
        : null;
    console.log(entryId);
    if (entryId === null || isNaN(entryId)) {
      // TODO: MOSTRAR TOAST DE ERROR
      throw new Error("ID de entrada no válido");
    }

    await markExitVisit(authToken, entryId);

    return json({ success: true, message: "Salida marcada con exito" });
  }

  if (intent === "create") {
    const visitType = formData.get("visit_type");
    if (visitType == "family") {
      const formDataAddFamilyVisit: FormDataAddFamilyVisit = {
        visitType: formData.get("visit_type") as string,
        motiveId: formData.get("motive_id") as string,
        motiveDescription: formData.get("custom_motive") as string,
        visitName: formData.get("visit_name") as string,
        visitSurname: formData.get("visit_surname") as string,
        visitEmail: formData.get("visit_email") as string,
        studentName: formData.get("student_name") as string,
        studentSurname: formData.get("student_surname") as string,
        studentCourse: formData.get("student_course") as string,
      };
      const clientSideValidationErrors = validateFormAddFamilyVisit(
        formDataAddFamilyVisit
      );

      if (clientSideValidationErrors)
        return json({
          success: false,
          clientSideValidationErrors,
          message: "Corrige los errores del formulario",
        });

      await createFamilyVisit(authToken, formDataAddFamilyVisit);
      // TODO : MOSTRAR ERRORES DE SERVIDOR
      return json({ success: true, message: "Visita familiar registrada" });
    }

    if (visitType == "professional") {
      const formDataAddProfessionalVisit: FormDataAddProfessionalVisit = {
        visitType: formData.get("visit_type") as string,
        serviceId: formData.get("service_id") as string,
        taskDescription: formData.get("task") as string,
        professionalNIF: formData.get("NIF") as string,
        professionalAge: formData.get("age") as string,
        visitName: formData.get("visit_name") as string,
        visitSurname: formData.get("visit_surname") as string,
        visitEmail: formData.get("visit_email") as string,
        companyCIF: formData.get("company_CIF") as string,
        companyName: formData.get("company_name") as string,
        companyTelephone: formData.get("company_telephone") as string,
      };

      const clientSideValidationErrors = validateFormAddProfessionalVisit(
        formDataAddProfessionalVisit
      );

      if (clientSideValidationErrors)
        return json({
          success: false,
          clientSideValidationErrors,
          message: "Corrige los errores del formulario",
        });

      await createProfessionalVisit(authToken, formDataAddProfessionalVisit);
      // TODO : MOSTRAR ERRORES DE SERVIDOR
      return json({ success: true, message: "Visita Profesional registrada" });
    }

    return null;
  } else if (intent === "update") {
    const visitName = formData.get("visit_name");
    console.log("visit name update", visitName);
    return null;
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
