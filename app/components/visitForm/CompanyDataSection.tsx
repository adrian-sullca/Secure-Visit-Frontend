import { Building2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { VisitFormatted } from "~/types/visits.types";

interface CompanyDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
}

export default function CompanyDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
}: CompanyDataSectionProps) {
  return (
    <div className="p-5 border rounded-lg w-full">
      <div className="flex gap-3 items-center mb-4">
        <Building2 className="text-gray-600 w-5" />
        <p className="font-bold text-xl text-gray-600">
          Información de Empresa
        </p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label>CIF</Label>
          <Input
            disabled={showMode && !editMode}
            value={visitData.company_CIF ? visitData.company_CIF : ""}
            onChange={(e) => handleChange("company_CIF", e.target.value)}
          ></Input>
        </div>
        <div className="space-y-1">
          <Label>Nombre</Label>
          <Input
            type="text"
            disabled={showMode && !editMode}
            value={visitData.company_name ? visitData.company_name : ""}
            onChange={(e) => handleChange("company_name", e.target.value)}
          ></Input>
        </div>
        <div className="space-y-1">
          <Label>Telefono</Label>
          <Input
            disabled={showMode && !editMode}
            value={
              visitData.company_telephone ? visitData.company_telephone : ""
            }
            onChange={(e) => handleChange("company_telephone", e.target.value)}
          ></Input>
        </div>
      </div>
    </div>
  );
}
