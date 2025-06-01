import { User } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { VisitFormatted } from "~/types/visits.types";

interface VisitorDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
}

export default function VisitorDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
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
      <div className="space-y-3">
        {visitData.visit_type == "professional" && (
          <div className="flex justify-between gap-4">
            <div className="space-y-1 w-full">
              <Label>NIF</Label>
              <Input
                disabled={showMode && !editMode}
                value={visitData.NIF ? visitData.NIF : ""}
                onChange={(e) => handleChange("NIF", e.target.value)}
              ></Input>
            </div>
            <div className="space-y-1 w-full">
              <Label>Edad</Label>
              <Input
                disabled={showMode && !editMode}
                value={visitData.age ? visitData.age : ""}
                onChange={(e) => handleChange("age", e.target.value)}
              ></Input>
            </div>
          </div>
        )}
        <div
          className={`flex justify-between gap-x-4 ${
            visitData.visit_type == "family" ? "flex-col space-y-3" : ""
          }`}
        >
          <div className="space-y-1 w-full">
            <Label>Nombre</Label>
            <Input
              disabled={showMode && !editMode}
              value={visitData.visit_name}
              onChange={(e) => handleChange("visit_name", e.target.value)}
            ></Input>
          </div>
          <div className="space-y-1 w-full">
            <Label>Apellido</Label>
            <Input
              disabled={showMode && !editMode}
              value={visitData.visit_surname}
              onChange={(e) => handleChange("visit_surname", e.target.value)}
            ></Input>
          </div>
        </div>
        <div className="space-y-1">
          <Label>Email</Label>
          <Input
            disabled={showMode && !editMode}
            value={visitData.visit_email}
            onChange={(e) => handleChange("visit_email", e.target.value)}
          ></Input>
        </div>
      </div>
    </div>
  );
}
