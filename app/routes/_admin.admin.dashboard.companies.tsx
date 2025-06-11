import {
  ActionFunction,
  json,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import CompaniesTable from "~/components/companies/CompaniesTable";
import { requireAuth } from "~/server/auth.server";
import { addCompany, disableCompanyById, enableCompanyById, getAllCompanies, updateCompany } from "~/server/companies.server";
import { CompanyFormData } from "~/types/companies.types";
import { validateCompanyFormData } from "~/validations/companies.validation";

export const meta: MetaFunction = () => {
  return [
    { title: "Companies Management" },
    { name: "description", content: "Gestion de empresas de los profesionales" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const authToken = await requireAuth(request);
  const resCompanies = await getAllCompanies(authToken);
  return json({ companies: resCompanies?.companies });
};

export const action: ActionFunction = async ({ request }) => {
  const authToken = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");
  const companyId = formData.get("company_id") as string;

  if (intent === "disable") {
    return await disableCompanyById(authToken, companyId);
  } else if (intent === "enable") {
    return await enableCompanyById(authToken, companyId);
  } else if (intent === "update") {
    const companyData: CompanyFormData = {
      intent: intent,
      id: Number(formData.get("company_id") || 0),
      CIF: String(formData.get("company_CIF") || ""),
      name: String(formData.get("company_name") || ""),
      telephone: String(formData.get("company_telephone") || ""),
      enabled: formData.get("company_enabled") === "1" ? true : false,
    };

    const clientSideValidationErrors = validateCompanyFormData(companyData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await updateCompany(authToken, companyData);
  } else if (intent == "add") {
    const companyData: CompanyFormData = {
      intent: intent,
      id: Number(formData.get("company_id") || 0),
      CIF: String(formData.get("company_CIF") || ""),
      name: String(formData.get("company_name") || ""),
      telephone: String(formData.get("company_telephone") || ""),
      enabled: true,
    };

    const clientSideValidationErrors = validateCompanyFormData(companyData);

    if (clientSideValidationErrors) {
      return json({
        success: false,
        intent,
        message: "Corrige los errores del formulario",
        clientSideValidationErrors,
      });
    }

    return await addCompany(authToken, companyData);
  }

  return json({ error: "Acción no válida" }, { status: 400 });
};

export default function CompaniesManagementPage() {
  return (
    <div className="w-full flex justify-center">
      <CompaniesTable />
    </div>
  );
}
