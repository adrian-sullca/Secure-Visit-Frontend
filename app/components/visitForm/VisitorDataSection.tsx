import { User } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Visit, VisitFormatted } from "~/types/visits.types";
import { cn } from "~/lib/utils";
import { AutoCompleteInput } from "./AutoCompleteInput";
import { FetcherWithComponents } from "@remix-run/react";

interface VisitorDataSectionProps {
  allVisitors: Visit[];
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
  fetcherAddOrUpdate: FetcherWithComponents<any>;
}

export default function VisitorDataSection({
  allVisitors,
  showMode,
  editMode,
  visitData,
  handleChange,
  fetcherAddOrUpdate,
}: VisitorDataSectionProps) {
  const errors =
    fetcherAddOrUpdate.data?.clientSideValidationErrors ||
    fetcherAddOrUpdate.data?.serverValidationErrors ||
    {};

  return (
    <div className="p-5 border rounded-lg w-full">
      <div className="flex gap-3 items-center mb-4">
        <User className="text-gray-600 w-5" />
        <p className="font-bold text-xl text-gray-600">
          {visitData.visit_type == "family"
            ? "Información de Visitante"
            : "Información de Profesional"}
        </p>
      </div>
      <div>
        {visitData.visit_type == "professional" && (
          <div className="flex justify-between gap-x-4">
            <div className="space-y-1 w-full">
              <Label>NIF</Label>
              <AutoCompleteInput
                allItems={allVisitors}
                searchKey="professional_visit.company.NIF"
                placeholder="Autocompletado"
                onSelect={(visitor: Visit) => {
                  handleChange("visit_email", visitor.email);
                  handleChange("visit_name", visitor.name || "");
                  handleChange("visit_surname", visitor.surname || "");
                  handleChange("visit_type", visitor.visit_type || "");
                  handleChange(
                    "age",
                    String(visitor.professional_visit?.age) || ""
                  );
                  handleChange("NIF", visitor.professional_visit?.NIF || "");
                  handleChange(
                    "company_CIF",
                    visitor.professional_visit?.company.CIF || ""
                  );
                  handleChange(
                    "company_name",
                    visitor.professional_visit?.company.name || ""
                  );
                  handleChange(
                    "company_telephone",
                    visitor.professional_visit?.company.telephone || ""
                  );
                }}
                renderItem={(visitor: Visit) =>
                  `${visitor.professional_visit?.NIF} — ${visitor.name}`
                }
                value={visitData.NIF || ""}
                disabled={showMode && !editMode}
                hasError={!!errors.NIF}
                onChange={(value) => handleChange("NIF", value)}
              />
              <div className="min-h-[16px]">
                {errors.NIF && (
                  <p className="text-xs text-red-600 mt-1">{errors.NIF}</p>
                )}
              </div>
            </div>
            <div className="space-y-1 w-full">
              <Label>Edad</Label>
              <Input
                disabled={showMode && !editMode}
                value={visitData.age ? visitData.age : ""}
                onChange={(e) => handleChange("age", e.target.value)}
                name="age"
                className={cn(
                  "input",
                  errors.age &&
                    "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                )}
              ></Input>
              <div className="min-h-[16px]">
                {errors.age && (
                  <p className="text-xs text-red-600 mt-1">{errors.age}</p>
                )}
              </div>
            </div>
          </div>
        )}
        <div
          className={`flex justify-between gap-x-4 ${
            visitData.visit_type == "family" ? "flex-col" : ""
          }`}
        >
          <div className="space-y-1 w-full">
            <Label>Nombre</Label>
            <Input
              disabled={showMode && !editMode}
              value={visitData.visit_name}
              onChange={(e) => handleChange("visit_name", e.target.value)}
              name="visit_name"
              className={cn(
                "input",
                errors.name &&
                  "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
              )}
            ></Input>
            <div className="min-h-[16px]">
              {errors.name && (
                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
              )}
            </div>
          </div>
          <div className="space-y-1 w-full">
            <Label>Apellido</Label>
            <Input
              disabled={showMode && !editMode}
              value={visitData.visit_surname}
              onChange={(e) => handleChange("visit_surname", e.target.value)}
              name="visit_surname"
              className={cn(
                "input",
                errors.surname &&
                  "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
              )}
            ></Input>
            <div className="min-h-[16px]">
              {errors.surname && (
                <p className="text-xs text-red-600 mt-1">{errors.surname}</p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <AutoCompleteInput
            allItems={allVisitors}
            searchKey="email"
            placeholder="Autocompletado"
            onSelect={(visitor: Visit) => {
              handleChange("visit_email", visitor.email);
              handleChange("visit_name", visitor.name || "");
              handleChange("visit_surname", visitor.surname || "");
              handleChange("visit_type", visitor.visit_type || "");
              handleChange("age", visitor.professional_visit?.age || "");
              handleChange("NIF", visitor.professional_visit?.NIF || "");
              handleChange(
                "company_CIF",
                visitor.professional_visit?.company.CIF || ""
              );
              handleChange(
                "company_name",
                visitor.professional_visit?.company.name || ""
              );
              handleChange(
                "company_telephone",
                visitor.professional_visit?.company.telephone || ""
              );
            }}
            renderItem={(visitor: Visit) =>
              `${visitor.email} — ${visitor.name}`
            }
            value={visitData.visit_email || ""}
            disabled={showMode && !editMode}
            hasError={!!errors.email}
            onChange={(value) => handleChange("visit_email", value)}
          />
          <div className="min-h-[16px]">
            {errors.email && (
              <p className="text-xs text-red-600 mt-1">{errors.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
