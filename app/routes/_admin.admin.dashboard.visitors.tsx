import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import ServicesTable from "~/components/services/ServicesTable";
import VisitorsTable from "~/components/visitors/VisitorsTable";
import { requireAuth } from "~/server/auth.server";
import { getAllCompanies } from "~/server/companies.server";
import {
  addService,
  disableServiceById,
  enableServiceById,
  getAllServices,
  updateService,
} from "~/server/services.server";
import {
  addVisitor,
  getAllVisitors,
  updateVisitor,
} from "~/server/visits.server";
import { ServiceFormData } from "~/types/services.types";
import { VisitorData } from "~/types/visits.types";
import { validateServiceFormData } from "~/validations/services.validations";
import { validateVisitorFormData } from "~/validations/visit.validations";

export const meta: MetaFunction = () => {
  return [
    { title: "Services Management" },
    { name: "description", content: "Gestion de servicios" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const resVisitors = await getAllVisitors(authToken);
  const resCompanies = await getAllCompanies(authToken);

  return json({
    visitors: resVisitors?.visitors,
    companies: resCompanies?.companies,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "update") {
    const visitorId = formData.get("visitor_id") as string;

    const visitorData: VisitorData = {
      intent: "update",
      visit_type: formData.get("visit_type") as string,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      NIF: formData.get("NIF") as string,
      age: formData.get("age") as string,
      CIF: formData.get("CIF") as string,
    };

    console.log(visitorData);

    const clientSideValidationErrors = validateVisitorFormData(visitorData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    const resUpdateVisitor = await updateVisitor(
      authToken,
      visitorData,
      visitorId
    );
    if (resUpdateVisitor?.success) {
      return json({
        success: true,
        message: resUpdateVisitor?.message,
      });
    } else {
      return json({
        success: false,
        message: resUpdateVisitor?.message,
        serverValidationErrors: resUpdateVisitor?.serverValidationErrors ?? {},
      });
    }
  } else if (intent == "add") {
    const visitorData: VisitorData = {
      intent: "add",
      visit_type: formData.get("visit_type") as string,
      name: formData.get("name") as string,
      surname: formData.get("surname") as string,
      email: formData.get("email") as string,
      NIF: formData.get("NIF") as string,
      age: formData.get("age") as string,
      CIF: formData.get("CIF") as string,
      company_name: formData.get("company_name") as string,
      company_telephone: formData.get("company_telephone") as string,
    };

    console.log(visitorData);

    const clientSideValidationErrors = validateVisitorFormData(visitorData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    const resAddVisitor = await addVisitor(authToken, visitorData);

    console.log(resAddVisitor);

    if (resAddVisitor?.success) {
      return json({
        success: true,
        message: resAddVisitor?.message,
      });
    } else {
      return json({
        success: false,
        message: resAddVisitor?.message,
        serverValidationErrors: resAddVisitor?.serverValidationErrors ?? {},
      });
    }
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};

export default function VisitorsManagementPage() {
  return (
    <div className="w-full flex justify-center">
      <VisitorsTable />
    </div>
  );
}
