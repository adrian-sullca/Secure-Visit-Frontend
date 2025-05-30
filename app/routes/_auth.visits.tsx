import { data, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import VisitsTable from "~/components/visits/VisitsTable";
import { requireAuth } from "~/server/auth.server";
import { getAllMotives } from "~/server/motives.server";
import { getAllServices } from "~/server/service.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Visits" },
    { name: "description", content: "Tabla de visitas" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const resGetAllMotives = await getAllMotives(authToken);
  const resGetAllServices = await getAllServices(authToken);
  const courses = ["1 ESO", "2 ESO", "3 ESO", "4 ESO"]; // TODO: Obtener de base de datos
  return data({
    courses: courses,
    motives: resGetAllMotives?.motives,
    services: resGetAllServices?.services,
  });
};

export default function AuthPage() {
  return (
    <div className="w-full flex justify-center">
      <VisitsTable />
    </div>
  );
}
