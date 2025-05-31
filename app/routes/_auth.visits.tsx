import {
  ActionFunction,
  data,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import VisitsTable from "~/components/visits/VisitsTable";
import { requireAuth } from "~/server/auth.server";
import { getAllMotives } from "~/server/motives.server";
import { getAllServices } from "~/server/service.server";
import { getAllVisits } from "~/server/visits.server";
import { VisitFilters } from "./../types/visits.types";
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
  return data({
    courses: courses,
    motives: resGetAllMotives?.motives,
    services: resGetAllServices?.services,
    visits: resGetAllVisits?.visits,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const authToken = await requireAuth(request);

  const perPage = formData.get("per_page") as string;
  const page = (formData.get("page") as string) || "1";

  // Filters
  const filters: VisitFilters = {
    page,
    perPage,
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

  return data({
    visits: result?.visits,
    meta: result?.meta,
  });
};

export default function AuthPage() {
  return (
    <div className="w-full flex justify-center">
      <VisitsTable />
    </div>
  );
}
