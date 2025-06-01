import { User } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { VisitFormatted } from "~/types/visits.types";
import { useLoaderData } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface StudentDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
}

export default function StudentDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
}: StudentDataSectionProps) {
  const loaderData =
    useLoaderData<typeof import("./../../routes/_auth.visits").loader>();

  return (
    <div className="p-5 border rounded-lg w-full">
      <div className="flex gap-3 items-center mb-4">
        <User className="text-gray-600 w-5" />
        <p className="font-bold text-xl text-gray-600">
          Información de Estudiante
        </p>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <Label>Nombre</Label>
          <Input
            type="text"
            disabled={showMode && !editMode}
            value={visitData.student_name ? visitData.student_name : ""}
            onChange={(e) => handleChange("student_name", e.target.value)}
          ></Input>
        </div>
        <div className="space-y-1">
          <Label>Apellido</Label>
          <Input
            disabled={showMode && !editMode}
            value={visitData.student_surname ? visitData.student_surname : ""}
            onChange={(e) => handleChange("student_surname", e.target.value)}
          ></Input>
        </div>
        <div className="space-y-1">
          <Label>Curso</Label>
          {loaderData.courses.length > 0 && (
            <Select
              value={visitData.student_course ? visitData.student_course : ""}
              onValueChange={(cursoName) =>
                handleChange("student_course", cursoName)
              }
              disabled={showMode && !editMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el curso del estudiante" />
              </SelectTrigger>
              <SelectContent>
                {loaderData.courses.map((name: string) => (
                  <SelectItem key={name} value={name.toString()}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
    </div>
  );
}
