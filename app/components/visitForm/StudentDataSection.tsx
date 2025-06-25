import { User } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { VisitFormatted } from "~/types/visits.types";
import { FetcherWithComponents, useLoaderData } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "~/lib/utils";

interface StudentDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
  fetcherAddOrUpdate: FetcherWithComponents<any>;
}

export default function StudentDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
  fetcherAddOrUpdate,
}: StudentDataSectionProps) {
  const loaderData =
    useLoaderData<typeof import("./../../routes/_auth.visits").loader>();

  const errors =
    fetcherAddOrUpdate.data?.clientSideValidationErrors ||
    fetcherAddOrUpdate.data?.serverValidationErrors ||
    {};

  return (
    <div className="p-5 border rounded-lg w-full">
      <div className="flex gap-3 items-center mb-4">
        <User className="text-gray-600 w-5" />
        <p className="font-bold text-xl text-gray-600">
          Información de Estudiante
        </p>
      </div>
      <div>
        <div className="space-y-1">
          <Label>Nombre</Label>
          <Input
            type="text"
            disabled={showMode && !editMode}
            value={visitData.student_name ? visitData.student_name : ""}
            onChange={(e) => handleChange("student_name", e.target.value)}
            name="student_name"
            className={cn(
              "input",
              errors.student_name &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.student_name && (
              <p className="text-xs text-red-600 mt-1">{errors.student_name}</p>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <Label>Apellido</Label>
          <Input
            disabled={showMode && !editMode}
            value={visitData.student_surname ? visitData.student_surname : ""}
            onChange={(e) => handleChange("student_surname", e.target.value)}
            name="student_surname"
            className={cn(
              "input",
              errors.student_surname &&
                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
            )}
          ></Input>
          <div className="min-h-[16px]">
            {errors.student_surname && (
              <p className="text-xs text-red-600 mt-1">
                {errors.student_surname}
              </p>
            )}
          </div>
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
              name="student_course"
            >
              <SelectTrigger
                className={cn(
                  "input",
                  errors.student_course &&
                    "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                )}
              >
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
          <div className="min-h-[16px]">
            {errors.student_course && (
              <p className="text-xs text-red-600 mt-1">
                {errors.student_course}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
