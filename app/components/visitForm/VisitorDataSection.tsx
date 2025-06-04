import { User } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { VisitFormatted } from "~/types/visits.types";
import { cn } from "~/lib/utils";

interface VisitorDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
  errors: {};
}

export default function VisitorDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
  errors,
}: VisitorDataSectionProps) {
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
              <Input
                disabled={showMode && !editMode}
                value={visitData.NIF ? visitData.NIF : ""}
                onChange={(e) => handleChange("NIF", e.target.value)}
                name="NIF"
                className={cn(
                  "input",
                  errors.professionalNIF &&
                    "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                )}
              ></Input>
              <div className="min-h-[16px]">
                {errors.professionalNIF && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.professionalNIF}
                  </p>
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
                  errors.professionalAge &&
                    "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                )}
              ></Input>
              <div className="min-h-[16px]">
                {errors.professionalAge && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.professionalAge}
                  </p>
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
                errors.visitName &&
                  "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
              )}
            ></Input>
            <div className="min-h-[16px]">
              {errors.visitName && (
                <p className="text-xs text-red-600 mt-1">{errors.visitName}</p>
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
                errors.visitSurname &&
                  "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
              )}
            ></Input>
            <div className="min-h-[16px]">
              {errors.visitSurname && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.visitSurname}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            disabled={showMode && !editMode}
            value={visitData.visit_email}
            onChange={(e) => handleChange("visit_email", e.target.value)}
            name="visit_email"
            className={cn(
              "input",
              errors.visitEmail &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.visitEmail && (
              <p className="text-xs text-red-600 mt-1">{errors.visitEmail}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
