import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import MotivesTable from "~/components/motives/MotivesTable";
import { requireAuth } from "~/server/auth.server";
import { getAllMotives } from "~/server/motives.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Motives Management" },
    { name: "description", content: "Gestion de motivos" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const resMotives = await getAllMotives(authToken);
  return json({ motives: resMotives?.motives });
};

export default function MotivesManagementPage() {
  return (
    <div className="w-full flex justify-center">
      <MotivesTable />
    </div>
  );
}
