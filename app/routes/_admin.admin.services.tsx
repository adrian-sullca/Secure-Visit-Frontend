import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import ServicesTable from "~/components/services/ServicesTable";
import { requireAuth } from "~/server/auth.server";
import {
  addService,
  disableServiceById,
  enableServiceById,
  getAllServices,
  updateService,
} from "~/server/services.server";
import { ServiceFormData } from "~/types/services.types";
import { validateServiceFormData } from "~/validations/services.validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Services Management" },
    { name: "description", content: "Gestion de servicios" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const resServices = await getAllServices(authToken);
  return json({ services: resServices?.services });
};

export const action: ActionFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const serviceId = formData.get("service_id") as string;

  if (intent === "disable") {
    return await disableServiceById(authToken, serviceId);
  } else if (intent === "enable") {
    return await enableServiceById(authToken, serviceId);
  } else if (intent === "update") {
    const serviceData: ServiceFormData = {
      intent: intent,
      id: Number(formData.get("service_id") || 0),
      name: String(formData.get("service_name") || ""),
      enabled: formData.get("service_enabled") === "1" ? true : false,
    };
    const clientSideValidationErrors = validateServiceFormData(serviceData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await updateService(authToken, serviceData);
  } else if (intent == "add") {
    const serviceData: ServiceFormData = {
      intent: intent,
      name: String(formData.get("service_name") || ""),
      enabled: true,
    };

    const clientSideValidationErrors = validateServiceFormData(serviceData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await addService(authToken, serviceData);
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};

export default function ServicesManagementPage() {
  return (
    <div className="w-full flex justify-center">
      <ServicesTable />
    </div>
  );
}
