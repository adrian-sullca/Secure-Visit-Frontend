import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import MotivesTable from "~/components/motives/MotivesTable";
import { requireAuth } from "~/server/auth.server";
import {
  addMotive,
  disableMotiveById,
  enableMotiveById,
  getAllMotives,
  updateMotive,
} from "~/server/motives.server";
import { MotiveFormData } from "~/types/motives.types";
import { validateMotiveFormData } from "~/validations/motives.validations";

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

export const action: ActionFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const motiveId = formData.get("motive_id") as string;

  if (intent === "disable") {
    return await disableMotiveById(authToken, motiveId);
  } else if (intent === "enable") {
    return await enableMotiveById(authToken, motiveId);
  } else if (intent === "update") {
    const motiveData: MotiveFormData = {
      intent: intent,
      id: Number(formData.get("motive_id") || 0),
      name: String(formData.get("motive_name") || ""),
      enabled: formData.get("motive_enabled") === "1" ? true : false,
    };
    const clientSideValidationErrors = validateMotiveFormData(motiveData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await updateMotive(authToken, motiveData);
  } else if (intent == "add") {
    const motiveData: MotiveFormData = {
      intent: intent,
      name: String(formData.get("motive_name") || ""),
      enabled: true,
    };

    const clientSideValidationErrors = validateMotiveFormData(motiveData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await addMotive(authToken, motiveData);
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};

export default function MotivesManagementPage() {
  return (
    <div className="w-full flex justify-center">
      <MotivesTable />
    </div>
  );
}
