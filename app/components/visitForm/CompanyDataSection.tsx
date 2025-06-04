import { Building2 } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { VisitFormatted } from "~/types/visits.types";
import { cn } from "~/lib/utils";
import { FetcherWithComponents } from "@remix-run/react";

interface CompanyDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
  fetcherAddOrUpdate: FetcherWithComponents<any>;
}

export default function CompanyDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
  fetcherAddOrUpdate,
}: CompanyDataSectionProps) {
  const errors = fetcherAddOrUpdate.data?.clientSideValidationErrors || {};

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
          <Input
            disabled={showMode && !editMode}
            value={visitData.company_CIF ? visitData.company_CIF : ""}
            onChange={(e) => handleChange("company_CIF", e.target.value)}
            className={cn(
              "input",
              errors.companyCIF &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.companyCIF && (
              <p className="text-xs text-red-600 mt-1">{errors.companyCIF}</p>
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
              errors.companyName &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.companyName && (
              <p className="text-xs text-red-600 mt-1">{errors.companyName}</p>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label>Telefono</Label>
          <Input
            disabled={showMode && !editMode}
            value={
              visitData.company_telephone ? visitData.company_telephone : ""
            }
            onChange={(e) => handleChange("company_telephone", e.target.value)}
            className={cn(
              "input",
              errors.companyTelephone &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.companyTelephone && (
              <p className="text-xs text-red-600 mt-1">
                {errors.companyTelephone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
