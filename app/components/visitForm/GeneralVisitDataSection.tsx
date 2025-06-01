import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";
import { CalendarIcon, X } from "lucide-react";
import { Motive, VisitFormatted } from "~/types/visits.types";
import { useLoaderData } from "@remix-run/react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { cn } from "~/lib/utils";
import { Calendar } from "../ui/calendar";
import { useState } from "react";

interface GeneralVisitDataSectionProps {
  showMode: boolean;
  editMode: boolean;
  visitData: VisitFormatted;
  handleChange: (field: string, value: string) => void;
}

export default function GeneralVisitDataSection({
  showMode,
  editMode,
  visitData,
  handleChange,
}: GeneralVisitDataSectionProps) {
  const loaderData =
    useLoaderData<typeof import("./../../routes/_auth.visits").loader>();

  const [isPopoverDateEntryOpen, setIsPopoverDateEntryOpen] = useState(false);
  const [isPopoverDateExitOpen, setIsPopoverDateExitOpen] = useState(false);

  return (
    <div className="p-5 border rounded-lg">
      <div className="flex gap-3 items-center mb-4">
        <CalendarIcon className="text-gray-600 w-5" />
        <p className="font-bold text-xl text-gray-600">Información de Visita</p>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between gap-4">
          <div className="space-y-1 w-full">
            <Label>Tipo de visita</Label>
            <Select
              disabled={showMode && !editMode}
              value={visitData.visit_type}
              onValueChange={(visitType) =>
                handleChange("visit_type", visitType)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Tipo de visita" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family">Visita familiar</SelectItem>
                <SelectItem value="professional">Visita profesional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 w-full">
            <Label>
              {visitData.visit_type == "family" ? "Motivo" : "Servicio"}
            </Label>
            {visitData.visit_type == "family" &&
              loaderData.motives.length > 0 && (
                <Select
                  value={
                    visitData.motive_id ? visitData.motive_id.toString() : "1"
                  }
                  onValueChange={(motiveId) =>
                    handleChange("motive_id", motiveId.toString())
                  }
                  disabled={showMode && !editMode}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un Motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {loaderData.motives.map(
                      ({ id, name }: { id: string; name: string }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
            {visitData.visit_type == "professional" &&
              loaderData.services.length > 0 && (
                <Select
                  disabled={showMode && !editMode}
                  value={
                    visitData.service_id ? visitData.service_id.toString() : "1"
                  }
                  onValueChange={(serviceId) =>
                    handleChange("service_id", serviceId.toString())
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    {loaderData.services.map(
                      ({ id, name }: { id: string; name: string }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              )}
          </div>
        </div>
        {showMode && (
          <div className="flex justify-between gap-x-4 space-y-3 md:space-y-0">
            <div className="space-y-1 w-full">
              {editMode ? (
                <Popover
                  open={isPopoverDateEntryOpen}
                  onOpenChange={setIsPopoverDateEntryOpen}
                >
                  <Label>F. Entrada</Label>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap group",
                        !visitData.date_entry_value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {visitData.date_entry_value
                          ? format(new Date(visitData.date_entry_value), "PPP")
                          : "Selecciona la fecha de entrada"}
                      </span>
                      {visitData.date_entry_value && (
                        <div
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChange("date_entry_value", "");
                            setIsPopoverDateEntryOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        visitData.date_entry_value
                          ? new Date(visitData.date_entry_value)
                          : undefined
                      }
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          const formattedDate = `${selectedDate.getFullYear()}-${(
                            selectedDate.getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${selectedDate
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`;
                          handleChange("date_entry_value", formattedDate);
                          setIsPopoverDateEntryOpen(false);
                        } else {
                          handleChange("date_entry_value", "");
                          setIsPopoverDateEntryOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Label>Entrada</Label>
                  <Input
                    readOnly
                    disabled={showMode && !editMode}
                    defaultValue={
                      editMode
                        ? ""
                        : `${visitData.date_entry_formatted} - ${visitData.time_entry}`
                    }
                  />
                </>
              )}
            </div>
            <div className="space-y-1 w-full">
              {editMode ? (
                <Popover
                  open={isPopoverDateExitOpen}
                  onOpenChange={setIsPopoverDateExitOpen}
                >
                  <Label>F. Entrada</Label>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap group",
                        !visitData.date_exit_value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {visitData.date_exit_value
                          ? format(new Date(visitData.date_exit_value), "PPP")
                          : "Selecciona la fecha de entrada"}
                      </span>
                      {visitData.date_exit_value && (
                        <div
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChange("date_exit_value", "");
                            setIsPopoverDateExitOpen(false);
                          }}
                        >
                          <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        </div>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        visitData.date_exit_value
                          ? new Date(visitData.date_exit_value)
                          : undefined
                      }
                      onSelect={(selectedDate) => {
                        if (selectedDate) {
                          const formattedDate = `${selectedDate.getFullYear()}-${(
                            selectedDate.getMonth() + 1
                          )
                            .toString()
                            .padStart(2, "0")}-${selectedDate
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`;
                          handleChange("date_exit_value", formattedDate);
                          setIsPopoverDateExitOpen(false);
                        } else {
                          handleChange("date_exit_value", "");
                          setIsPopoverDateExitOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Label>Salida</Label>
                  <Input
                    readOnly
                    disabled={showMode && !editMode}
                    defaultValue={
                      editMode
                        ? ""
                        : `${visitData.date_exit_formatted} - ${visitData.time_exit}`
                    }
                  />
                </>
              )}
            </div>
          </div>
        )}
        {editMode && (
          <div className="flex justify-between gap-4">
            <div className="space-y-1 w-full">
              <Label>Hora entrada</Label>
              <Input
                type="time"
                disabled={showMode && !editMode}
                value={visitData.time_entry}
                onChange={(e) => handleChange("time_entry", e.target.value)}
              />
            </div>
            <div className="space-y-1 w-full">
              <Label>Hora salida</Label>
              <Input
                type="time"
                disabled={showMode && !editMode}
                value={visitData.time_exit ?? ""}
                onChange={(e) => handleChange("time_exit", e.target.value)}
              ></Input>
            </div>
          </div>
        )}
        <div className="space-y-1">
          <Label>
            {visitData.visit_type == "family"
              ? "Descripcion de motivo"
              : "Descripcion de tarea"}
          </Label>
          {visitData.visit_type == "family" ? (
            <Textarea
              disabled={showMode && !editMode}
              value={visitData.custom_motive ?? ""}
              onChange={(e) => handleChange("custom_motive", e.target.value)}
              placeholder={
                visitData.custom_motive == "" && editMode == true
                  ? "Describe el motivo..."
                  : "Sin descripción"
              }
            />
          ) : (
            <Textarea
              disabled={showMode && !editMode}
              value={visitData.task ?? ""}
              onChange={(e) => handleChange("task", e.target.value)}
              placeholder={
                visitData?.task == "" && editMode == true
                  ? "Describe la tarea a realizar..."
                  : "Sin descripción"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
