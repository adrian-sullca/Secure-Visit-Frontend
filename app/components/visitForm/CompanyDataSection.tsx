import { Building2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { VisitFormatted } from "~/types/visits.types";
import { cn } from "~/lib/utils";
import { FetcherWithComponents } from "@remix-run/react";
import { AutoCompleteInput } from "./AutoCompleteInput";
import { Company } from "~/types/companies.types";

interface CompanyDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
  fetcherAddOrUpdate: FetcherWithComponents<any>;
  allCompanies: Company[];
}

export default function CompanyDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
  fetcherAddOrUpdate,
  allCompanies,
}: CompanyDataSectionProps) {
  const errors =
    fetcherAddOrUpdate.data?.clientSideValidationErrors ||
    fetcherAddOrUpdate.data?.serverValidationErrors ||
    {};

  return (
    <div className="p-5 border rounded-lg w-full">
      <div className="flex gap-3 items-center mb-4">
        <Building2 className="text-gray-600 w-5" />
        <p className="font-bold text-xl text-gray-600">
          Información de Empresa
        </p>
      </div>
      <div>
        <div className="space-y-1">
          <Label>CIF</Label>
          <AutoCompleteInput
            allItems={allCompanies}
            searchKey="CIF"
            placeholder="Autocompletado"
            onSelect={(company: Company) => {
              handleChange("company_CIF", company.CIF);
              handleChange("company_name", company.name || "");
              handleChange("company_telephone", company.telephone || "");
            }}
            renderItem={(company: Company) =>
              `${company?.CIF} — ${company.name}`
            }
            value={visitData.company_CIF || ""}
            disabled={showMode && !editMode}
            hasError={!!errors.CIF}
            onChange={(value) => handleChange("company_CIF", value)}
          />
          <div className="min-h-[16px]">
            {errors.CIF && (
              <p className="text-xs text-red-600 mt-1">{errors.CIF}</p>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label>Nombre</Label>
          <Input
            type="text"
            disabled={showMode && !editMode}
            value={visitData.company_name ? visitData.company_name : ""}
            onChange={(e) => handleChange("company_name", e.target.value)}
            className={cn(
              "input",
              errors.company_name &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.company_name && (
              <p className="text-xs text-red-600 mt-1">{errors.company_name}</p>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label>Telefono</Label>
          <AutoCompleteInput
            allItems={allCompanies}
            searchKey="telephone"
            placeholder="Autocompletado"
            onSelect={(company: Company) => {
              handleChange("company_CIF", company.CIF);
              handleChange("company_name", company.name || "");
              handleChange("company_telephone", company.telephone || "");
            }}
            renderItem={(company: Company) =>
              `${company?.CIF} — ${company.name}`
            }
            value={visitData.company_telephone || ""}
            disabled={showMode && !editMode}
            hasError={!!errors.company_telephone}
            onChange={(value) => handleChange("company_telephone", value)}
          />
          <div className="min-h-[16px]">
            {errors.company_telephone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.company_telephone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
