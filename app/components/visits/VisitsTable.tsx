import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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
} from "~/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Badge } from "~/components/ui/badge";
import { format } from "date-fns";
import {
  Building,
  CalendarIcon,
  CheckCircle,
  Clock,
  Eye,
  LogOut,
  Minus,
  Users,
  X,
  Download,
  Funnel,
  Plus,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { VisitFormatted } from "~/types/visits.types";
import AddOrUpdateVisitModal from "~/components/visitForm/AddOrUpdateVisitModal";
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { exportToExcel, exportToPDF } from "./ExportData";

export default function VisitsTable() {
  const loaderData =
    useLoaderData<typeof import("./../../routes/_auth.visits").loader>();

  const [showFilters, setShowFilters] = useState(false);
  // Filters
  const [visitType, setVisitType] = useState("all");
  const [visitState, setVisitState] = useState("all");
  const [visitName, setVisitName] = useState("");
  const [visitSurname, setVisitSurname] = useState("");
  const [visitEmail, setVisitEmail] = useState("");
  const [visitDateEntry, setVisitDateEntry] = useState("");
  const [visitDateExit, setVisitDateExit] = useState("");
  const [visitTimeEntry, setVisitTimeEntry] = useState("");
  const [visitTimeExit, setVisitTimeExit] = useState("");
  // Family Visit Filters
  const [studentName, setStudentName] = useState("");
  const [studentSurname, setStudentSurname] = useState("");
  const [visitMotiveId, setVisitMotiveId] = useState("0");
  const [studentCourse, setStudentCourse] = useState("0");
  // Professional Visit Filters
  const [professionalNIF, setProfessionalNIF] = useState("");
  const [professionalServiceId, setProfessionalServiceId] = useState("0");
  const [professionalTask, setProfessionalTask] = useState("");
  const [companyCIF, setCompanyCIF] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyTelephone, setCompanyTelephone] = useState("");
  const [isPopoverDateEntryOpen, setIsPopoverDateEntryOpen] = useState(false);
  const [isPopoverDateExitOpen, setIsPopoverDateExitOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [showMode, setShowMode] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [showModalAddOrUpdate, setShowModalAddOrUpdate] = useState(false);

  const fetcher = useFetcher();

  const [fetcherKey, setFetcherKey] = useState("add-or-update-1");
  const fetcherAddOrUpdate = useFetcher({ key: fetcherKey });
  const fetcherMarkExit = useFetcher();

  const handleCloseModal = () => {
    setShowModalAddOrUpdate(false);
    setSelectedVisit(null);
    setFetcherKey(`add-or-update-${Date.now()}`);
  };

  const handlePageChange = (page: number) => {
    const form = document.getElementById("filters-form") as HTMLFormElement;
    const input = form.elements.namedItem("page") as HTMLInputElement;
    if (input) {
      input.value = page.toString();
    } else {
      const newInput = document.createElement("input");
      newInput.type = "hidden";
      newInput.name = "page";
      newInput.value = page.toString();
      form.appendChild(newInput);
    }
    fetcher.submit(form);
  };

  const calculateDuration = (timeEntry: string, timeExit: string | null) => {
    if (!timeExit) return "En curso";

    const today = new Date().toISOString().split("T")[0];

    const start = new Date(`${today}T${timeEntry}:00`);
    const end = new Date(`${today}T${timeExit}:00`);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return "Hora inválida";
    }

    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m`;
  };

  const getTipoBadge = (type: string) => {
    if (type === "family") {
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          <Users className="h-3 w-3 mr-1" />
          Familiar
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="text-green-600 border-green-600">
        <Building className="h-3 w-3 mr-1" />
        Profesional
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    if (status === "pending") {
      return (
        <Badge className="bg-green-500 hover:bg-green-600">
          <CheckCircle className="h-3 w-3 mr-1" />
          Activa
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="h-3 w-3 mr-1" />
        Finalizada
      </Badge>
    );
  };

  const handleFilterChange = (
    key: string,
    value: string,
    setState?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (key == "visitType" || key == "visitState") {
      handlePageChange(1);
    }
    // Actualiza el estado
    if (setState) setState(value);
    // Actualiza el input del formulario
    const form = document.getElementById("filters-form") as HTMLFormElement;
    const input = form.elements.namedItem(key) as HTMLInputElement;
    if (input) input.value = value;

    fetcher.submit(form);
  };

  const fetcherData = fetcher.data as
    | { visits: VisitFormatted; meta: any }
    | undefined;

  const visits = fetcherData?.visits || loaderData.visits;
  const meta = fetcherData?.meta || loaderData.meta;

  useEffect(() => {
    if (fetcherAddOrUpdate.data?.message) {
      if (fetcherAddOrUpdate.data.success) {
        toast.success(fetcherAddOrUpdate.data.message);
        setShowModalAddOrUpdate(false);
        const form = document.getElementById("filters-form") as HTMLFormElement;
        if (form) {
          const pageInput = form.elements.namedItem("page") as HTMLInputElement;
          if (pageInput) pageInput.value = "1";
          fetcher.submit(form);
        }
      } else {
        toast.error(fetcherAddOrUpdate.data.message);
      }
    }
  }, [fetcherAddOrUpdate.data]);

  useEffect(() => {
    if (fetcherMarkExit.data?.success) {
      toast.success(fetcherMarkExit.data.message);
      const form = document.getElementById("filters-form") as HTMLFormElement;
      if (form) {
        const pageInput = form.elements.namedItem("page") as HTMLInputElement;
        if (pageInput) pageInput.value = "1";
        fetcher.submit(form);
      }
    }
  }, [fetcherMarkExit.data]);

  return (
    <>
      <fetcher.Form id="filters-form" method="post">
        <input type="hidden" name="page" value={meta?.currentPage || 1} />
        <input type="hidden" name="visitType" value={visitType} />
        <input type="hidden" name="visitState" value={visitState} />
        <input type="hidden" name="visitName" value={visitName} />
        <input type="hidden" name="visitSurname" value={visitSurname} />
        <input type="hidden" name="visitEmail" value={visitEmail} />
        <input type="hidden" name="visitDateEntry" value={visitDateEntry} />
        <input type="hidden" name="visitDateExit" value={visitDateExit} />
        <input type="hidden" name="visitTimeEntry" value={visitTimeEntry} />
        <input type="hidden" name="visitTimeExit" value={visitTimeExit} />
        {/* Family Visit Filters */}
        <input type="hidden" name="studentName" value={studentName} />
        <input type="hidden" name="studentSurname" value={studentSurname} />
        <input type="hidden" name="studentCourse" value={studentCourse} />
        <input type="hidden" name="visitMotiveId" value={visitMotiveId} />
        {/* Professional Visit Filters */}
        <input type="hidden" name="professionalNIF" value={professionalNIF} />
        <input
          type="hidden"
          name="professionalServiceId"
          value={professionalServiceId}
        />
        <input type="hidden" name="professionalTask" value={professionalTask} />
        <input type="hidden" name="companyCIF" value={companyCIF} />
        <input type="hidden" name="companyName" value={companyName} />
        <input type="hidden" name="companyTelephone" value={companyTelephone} />
      </fetcher.Form>
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
              <Button
                onClick={() => {
                  setShowMode(false);
                  setShowModalAddOrUpdate(true);
                }}
              >
                <Plus />
                <span className="ml-1">Añadir visita</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="w-full">
          <div className="flex flex-col sm:flex-row gap-2 xsm:justify-between">
            <div className="flex gap-2 flex-col xsm:flex-row w-full">
              {/* Select for type of visit */}
              <Select
                value={visitType}
                onValueChange={(value) =>
                  handleFilterChange("visitType", value, setVisitType)
                }
              >
                <SelectTrigger className="sm:max-w-[185px]">
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
              <Select
                value={visitState}
                onValueChange={(value) =>
                  handleFilterChange("visitState", value, setVisitState)
                }
              >
                <SelectTrigger className="sm:max-w-[170px]">
                  <SelectValue placeholder="Tipo de visita" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activas</SelectItem>
                  <SelectItem value="finished">Finalizadas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 flex-col xsm:flex-row">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Download />
                    <span className="ml-1">Descargar</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => exportToPDF(visits, loaderData.user)}>Descargar PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportToExcel(visits, loaderData.user)}>Descargar EXCEL</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                className={`${showFilters ? "bg-[#f5f5f5]" : ""} w-full`}
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
                <Label className="text-gray-600">Nombre</Label>
                <Input
                  value={visitName}
                  onChange={(e) =>
                    handleFilterChange(
                      "visitName",
                      e.target.value,
                      setVisitName
                    )
                  }
                />
              </div>

              <div className="space-y-1">
                <Label className="text-gray-600">Apellido</Label>
                <Input
                  value={visitSurname}
                  onChange={(e) =>
                    handleFilterChange(
                      "visitSurname",
                      e.target.value,
                      setVisitSurname
                    )
                  }
                />
              </div>
              <div className="space-y-1">
                <Label className="text-gray-600">Email</Label>
                <Input
                  value={visitEmail}
                  onChange={(e) =>
                    handleFilterChange(
                      "visitEmail",
                      e.target.value,
                      setVisitEmail
                    )
                  }
                />
              </div>

              <div className="space-y-1">
                <Popover
                  open={isPopoverDateEntryOpen}
                  onOpenChange={setIsPopoverDateEntryOpen}
                >
                  <Label className="text-gray-600">F. Entrada</Label>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap group",
                        !visitDateEntry && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {visitDateEntry
                          ? format(new Date(visitDateEntry), "PPP")
                          : "Selecciona la fecha de salida"}
                      </span>
                      {visitDateEntry && (
                        <div
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisitDateEntry("");
                            handleFilterChange("visitDateEntry", "");
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
                        visitDateEntry ? new Date(visitDateEntry) : undefined
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
                          setVisitDateEntry(formattedDate);
                          handleFilterChange("visitDateEntry", formattedDate);
                          setIsPopoverDateEntryOpen(false);
                        } else {
                          setVisitDateEntry("");
                          handleFilterChange("visitDateEntry", "");
                          setIsPopoverDateEntryOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <Popover
                  open={isPopoverDateExitOpen}
                  onOpenChange={setIsPopoverDateExitOpen}
                >
                  <Label className="text-gray-600">F. Salida</Label>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full h-10 justify-start text-left font-normal overflow-hidden text-ellipsis whitespace-nowrap group",
                        !visitDateExit && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {visitDateExit
                          ? format(new Date(visitDateExit), "PPP")
                          : "Selecciona la fecha de salida"}
                      </span>
                      {visitDateExit && (
                        <div
                          className="ml-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setVisitDateExit("");
                            handleFilterChange("visitDateExit", "");
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
                        visitDateExit ? new Date(visitDateExit) : undefined
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
                          setVisitDateExit(formattedDate);
                          handleFilterChange("visitDateExit", formattedDate);
                          setIsPopoverDateExitOpen(false);
                        } else {
                          setVisitDateExit("");
                          handleFilterChange("visitDateExit", "");
                          setIsPopoverDateExitOpen(false);
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1">
                <Label className="text-gray-600">Hora Entrada</Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={visitTimeEntry}
                    onChange={(e) =>
                      handleFilterChange(
                        "visitTimeEntry",
                        e.target.value,
                        setVisitTimeEntry
                      )
                    }
                    className="w-full h-10"
                  />
                  {visitTimeEntry && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVisitTimeEntry("");
                        handleFilterChange("visitTimeEntry", "");
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-gray-600">Hora Salida</Label>
                <div className="relative">
                  <Input
                    type="time"
                    value={visitTimeExit}
                    onChange={(e) =>
                      handleFilterChange(
                        "visitTimeExit",
                        e.target.value,
                        setVisitTimeExit
                      )
                    }
                    className="w-full h-10"
                  />
                  {visitTimeExit && (
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVisitTimeExit("");
                        handleFilterChange("visitTimeExit", "");
                      }}
                    >
                      <X className="h-4 w-4 mr-2" />
                    </button>
                  )}
                </div>
              </div>

              {visitType == "family" && (
                <>
                  <div className="space-y-1">
                    <Label className="text-gray-600">
                      Nombre de Estudiante
                    </Label>
                    <Input
                      value={studentName}
                      onChange={(e) =>
                        handleFilterChange(
                          "studentName",
                          e.target.value,
                          setStudentName
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-600">
                      Apellido de Estudiante
                    </Label>
                    <Input
                      value={studentSurname}
                      onChange={(e) =>
                        handleFilterChange(
                          "studentSurname",
                          e.target.value,
                          setStudentSurname
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-600">Curso de Estudiante</Label>
                    <Select
                      value={studentCourse}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "studentCourse",
                          value,
                          setStudentCourse
                        )
                      }
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
                    <Label className="text-gray-600">Motivo de Visita</Label>
                    <Select
                      value={visitMotiveId}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "visitMotiveId",
                          value,
                          setVisitMotiveId
                        )
                      }
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
                    <Input
                      value={professionalNIF}
                      onChange={(e) =>
                        handleFilterChange(
                          "professionalNIF",
                          e.target.value,
                          setProfessionalNIF
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-gray-600">Servicio</Label>
                    <Select
                      value={professionalServiceId}
                      onValueChange={(value) =>
                        handleFilterChange(
                          "professionalServiceId",
                          value,
                          setProfessionalServiceId
                        )
                      }
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
                    <Input
                      value={professionalTask}
                      onChange={(e) =>
                        handleFilterChange(
                          "professionalTask",
                          e.target.value,
                          setProfessionalTask
                        )
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-gray-600">CIF de empresa</Label>
                    <Input
                      value={companyCIF}
                      onChange={(e) =>
                        handleFilterChange(
                          "companyCIF",
                          e.target.value,
                          setCompanyCIF
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-gray-600">Nombre de empresa</Label>
                    <Input
                      value={companyName}
                      onChange={(e) =>
                        handleFilterChange(
                          "companyName",
                          e.target.value,
                          setCompanyName
                        )
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-gray-600">Telefono de empresa</Label>
                    <Input
                      value={companyTelephone}
                      onChange={(e) =>
                        handleFilterChange(
                          "companyTelephone",
                          e.target.value,
                          setCompanyTelephone
                        )
                      }
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Visits Table */}
          <div className="rounded-md border overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <Table className="min-w-[1200px]">
                <TableHeader>
                  <TableRow>
                    {visitType == "professional" ? (
                      <TableHead className="w-[120px]">Profesional</TableHead>
                    ) : (
                      <TableHead className="w-[120px]">Visitante</TableHead>
                    )}
                    <TableHead className="w-[140px]">Email</TableHead>
                    <TableHead className="w-[120px]">Tipo</TableHead>
                    {visitType == "family" && (
                      <>
                        <TableHead className="w-[120px]">Alumno</TableHead>
                        <TableHead className="w-[120px]">Motivo</TableHead>
                      </>
                    )}

                    {visitType == "professional" && (
                      <>
                        <TableHead className="w-[120px]">Servicio</TableHead>
                        <TableHead className="w-[120px]">Tarea</TableHead>
                        <TableHead className="w-[120px]">Empresa</TableHead>
                      </>
                    )}
                    <TableHead className="w-[100px]">Entrada</TableHead>
                    <TableHead className="w-[100px]">Salida</TableHead>
                    <TableHead className="w-[100px]">Duración</TableHead>
                    <TableHead className="w-[100px]">Estado</TableHead>
                    <TableHead className="sticky right-0 bg-white border-l w-[160px] text-right shadow-lg">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visits.map((visit: VisitFormatted) => (
                    <TableRow key={visit.id}>
                      <TableCell className="w-[140px]">
                        <div>
                          <p className="font-medium">{visit.visit_name}</p>
                          <p className="font-medium">{visit.visit_surname}</p>
                          {visitType == "professional" && (
                            <p className="text-sm text-gray-500">{visit.NIF}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="w-[200px]">
                        <span className="text-sm text-blue-600 hover:underline cursor-pointer">
                          {visit.visit_email}
                        </span>
                      </TableCell>
                      <TableCell className="w-[120px]">
                        {getTipoBadge(visit.visit_type)}
                      </TableCell>
                      {visitType == "family" && (
                        <>
                          <TableCell className="w-[160px]">
                            <div>
                              <p className="font-medium">
                                {visit.student_name}
                              </p>
                              <p className="font-medium">
                                {visit.student_surname}
                              </p>
                              <p className="text-sm text-gray-500">
                                {visit.student_course}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="w-[150px]">
                            {visit.motive_name}
                          </TableCell>
                        </>
                      )}

                      {visitType == "professional" && (
                        <>
                          <TableCell className="w-[150px]">
                            {visit.service_name}
                          </TableCell>
                          <TableCell className="w-[150px]">
                            {visit.task}
                          </TableCell>
                          <TableCell className="w-[140px]">
                            <p className="font-medium">{visit.company_name}</p>
                            <p className="text-sm text-gray-900">
                              {visit.company_telephone}
                            </p>
                            <p className="text-sm text-gray-500">
                              {visit.company_CIF}
                            </p>
                          </TableCell>
                        </>
                      )}
                      <TableCell className="w-[140px]">
                        <p className="font-medium">
                          {visit.date_entry_formatted}
                        </p>
                        <p className="text-sm text-gray-500">
                          {visit.time_entry}
                        </p>
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <span className="text-sm font-medium">
                          {!visit.date_exit_formatted ? (
                            <Minus className="w-3" />
                          ) : (
                            <>
                              <p className="font-medium">
                                {visit.date_exit_formatted}
                              </p>
                              <p className="text-sm text-gray-500">
                                {visit.time_exit}
                              </p>
                            </>
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="w-[100px]">
                        <span className="text-sm font-medium">
                          {calculateDuration(visit.time_entry, visit.time_exit)}
                        </span>
                      </TableCell>
                      <TableCell className="w-[100px]">
                        {getStatusBadge(
                          visit.time_exit ? "finished" : "pending"
                        )}
                      </TableCell>
                      <TableCell className="sticky right-0 bg-white border-l w-[160px] text-right shadow-lg">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedVisit(visit);
                              setShowMode(true);
                              setShowModalAddOrUpdate(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {!visit.time_exit && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm">
                                  <LogOut className="h-4 w-4 mr-1" />
                                  Salida
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Confirmar Salida
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Confirmas que {visit.visit_name}{" "}
                                    {visit.visit_surname} está saliendo del
                                    centro?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>
                                    Cancelar
                                  </AlertDialogCancel>
                                  <AlertDialogAction asChild>
                                    <Button
                                      onClick={() => {
                                        fetcherMarkExit.submit(
                                          {
                                            intent: "mark-exit",
                                            entry_id: visit.id,
                                          },
                                          { method: "post" }
                                        );
                                      }}
                                    >
                                      Confirmar Salida
                                    </Button>
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (meta.currentPage > 1)
                      handlePageChange(meta.currentPage - 1);
                  }}
                  aria-disabled={meta.currentPage === 1}
                />
              </PaginationItem>
              {Array.from({ length: meta.lastPage }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink
                    href="#"
                    isActive={meta.currentPage === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (meta.currentPage < meta.lastPage)
                      handlePageChange(meta.currentPage + 1);
                  }}
                  aria-disabled={meta.currentPage === meta.lastPage}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
      {/* Modal Add or Update Visit */}
      {showModalAddOrUpdate && (
        <AddOrUpdateVisitModal
          fetcherAddOrUpdate={fetcherAddOrUpdate}
          showMode={showMode}
          showModalAddOrUpdate={showModalAddOrUpdate}
          selectedVisit={selectedVisit}
          handleCloseModal={handleCloseModal}
        />
      )}
    </>
  );
}
