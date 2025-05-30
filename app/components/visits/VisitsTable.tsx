import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./../ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./../ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./../ui/dropdown-menu";

import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { cn } from "./../../lib/utils";
import { Calendar } from "./../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./../ui/popover";

import { Button } from "~/components/ui/button";
import { Download, Funnel, Plus } from "lucide-react";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useLoaderData } from "@remix-run/react";

export default function VisitsTable() {
  const loaderData =
    useLoaderData<typeof import("./../../routes/_auth.visits").loader>();

  const [visitType, setVisitType] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [visitMotive, setVisitMotive] = useState("0");
  const [studentCourse, setStudentCourse] = useState("0");
  const [professionalService, setProfessionalService] = useState("0");

  const handleChangeVisitType = (value: string) => {
    setVisitType(value);
  };

  const handleChangeVisitMotive = (value: string) => {
    setVisitMotive(value);
  };

  const handleChangeStudentCourse = (value: string) => {
    setStudentCourse(value);
  };

  const handleChangeProfessionalService = (value: string) => {
    setProfessionalService(value);
  };

  const [date, setDate] = useState<Date>();

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-left">Registro de Visitas</CardTitle>
            <CardDescription className="text-left">
              Gestiona las entradas y salidas del centro
            </CardDescription>
          </div>
          <div>
            {/* Button to add a new visit */}
            <Button>
              <Plus />
              <span className="ml-1">Añadir visita</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col xsm:flex-row gap-2 xsm:justify-between">
          {/* Select para tipo de Visita */}
          <Select value={visitType} onValueChange={handleChangeVisitType}>
            <SelectTrigger className="max-w-[230px]">
              <SelectValue placeholder="Tipo de visita" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las visitas</SelectItem>
              <SelectItem value="family">Visitas familiares</SelectItem>
              <SelectItem value="professional">
                Visitas profesionales
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 flex-col xsm:flex-row">
            {/* TODO: EXPORTAR DATOS EN PDF O EXCEL */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Download />
                  <span className="ml-1">Descargar</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Descargar PDF</DropdownMenuItem>
                <DropdownMenuItem>Descargar EXCEL</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              className={`${showFilters ? "bg-[#f5f5f5]" : ""}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Funnel />
              <span className="ml-1">Filtros</span>
            </Button>
          </div>
        </div>
        {/* Filters */}
        {showFilters && (
          <div className="grid gap-y-2 gap-x-5 xsm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-4">
            <div className="space-y-1">
              <Popover>
                <Label className="text-gray-600">Fecha Entrada</Label>
                <PopoverTrigger asChild>
                  <div className="flex flex-col  w-full">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {date ? format(date, "PPP") : "Pick a date"}
                      </span>
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1">
              <Popover>
                <Label className="text-gray-600">Fecha Salida</Label>
                <PopoverTrigger asChild>
                  <div className="flex flex-col w-full">
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {date ? format(date, "PPP") : "Pick a date"}
                      </span>
                    </Button>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-1">
              <Label className="text-gray-600">Hora Entrada</Label>
              <Input type="time"></Input>
            </div>

            <div className="space-y-1">
              <Label className="text-gray-600">Hora Salida</Label>
              <Input type="time"></Input>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-600">Nombre</Label>
              <Input></Input>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-600">Apellido</Label>
              <Input></Input>
            </div>
            <div className="space-y-1">
              <Label className="text-gray-600">Email</Label>
              <Input></Input>
            </div>
            {visitType == "family" && (
              <>
                <div className="space-y-1">
                  <Label className="text-gray-600">Nombre de Estudiante</Label>
                  <Input></Input>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600">
                    Apellido de Estudiante
                  </Label>
                  <Input></Input>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600">Curso de Estudiante</Label>
                  <Select
                    value={studentCourse}
                    onValueChange={handleChangeStudentCourse}
                  >
                    <SelectTrigger className="max-w-[230px]">
                      <SelectValue placeholder="Tipo de visita" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos los cursos</SelectItem>
                      {loaderData.courses.map((item: string) => (
                        <SelectItem value={item}>{item}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600">Motive de Visita</Label>
                  <Select
                    value={visitMotive}
                    onValueChange={handleChangeVisitMotive}
                  >
                    <SelectTrigger className="max-w-[230px]">
                      <SelectValue placeholder="Selecciona un motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos los motivos</SelectItem>
                      {loaderData.motives.map(
                        ({ id, name }: { id: string; name: string }) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {visitType == "professional" && (
              <>
                <div className="space-y-1">
                  <Label className="text-gray-600">NIF de professional</Label>
                  <Input></Input>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-600">Edad de professional</Label>
                  <Input></Input>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-600">Servicio</Label>
                  <Select
                    value={professionalService}
                    onValueChange={handleChangeProfessionalService}
                  >
                    <SelectTrigger className="max-w-[230px]">
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Todos los servicios</SelectItem>
                      {loaderData.services.map(
                        ({ id, name }: { id: string; name: string }) => (
                          <SelectItem key={id} value={id}>
                            {name}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label className="text-gray-600">Tarea</Label>
                  <Input></Input>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600">Nombre de empresa</Label>
                  <Input></Input>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600">CIF de empresa</Label>
                  <Input></Input>
                </div>
                <div className="space-y-1">
                  <Label className="text-gray-600">Telefono de empresa</Label>
                  <Input></Input>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
