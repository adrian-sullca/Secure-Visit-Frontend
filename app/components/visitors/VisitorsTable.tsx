import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Building,
  Check,
  Edit,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
} from "../ui/alert-dialog";
import {
  Form,
  useActionData,
  useFetcher,
  useLoaderData,
} from "@remix-run/react";
import { Service } from "~/types/services.types";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { cn } from "~/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { loader } from "~/routes/_admin.admin.dashboard.services";
import { Visit, VisitFormatted } from "~/types/visits.types";
import { AutoCompleteInput } from "../visitForm/AutoCompleteInput";
import { Company } from "~/types/companies.types";
interface FetcherEnableOrDisableData {
  success: boolean;
  message: string;
}

interface ActionData {
  success?: boolean;
  intent: string;
  message?: string;
  clientSideValidationErrors?: {
    name?: string;
    surname?: string;
    email?: string;
    NIF?: string;
    age?: string;
    CIF?: string;
    company_name?: string;
    company_telephone?: string;
  };
  serverValidationErrors?: {
    name?: string;
    surname?: string;
    email?: string;
    NIF?: string;
    age?: string;
    CIF?: string;
    company_name?: string;
    company_telephone?: string;
  };
}

export default function VisitorsTable() {
  const { visitors, companies } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    surname?: string;
    email?: string;
    NIF?: string;
    age?: string;
    CIF?: string;
    company_name?: string;
    company_telephone?: string;
  } | null>(null);
  const [selectedVisitor, setSelectedVisitor] = useState<Visit | null>(null);
  const fetcherEnableOrDisable = useFetcher<FetcherEnableOrDisableData>();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [visitType, setVisitType] = useState("family");
  const filteredVisitors = visitors.filter((visitor: Service) => {
    if (statusFilter === "active" && !visitor.enabled) return false;
    if (statusFilter === "inactive" && visitor.enabled) return false;

    if (
      searchTerm.trim() !== "" &&
      !visitor.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

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

  useEffect(() => {
    if (fetcherEnableOrDisable.data && fetcherEnableOrDisable.data.message) {
      if (fetcherEnableOrDisable.data.success) {
        toast.success(fetcherEnableOrDisable.data.message);
        setFormErrors(null);
      } else {
        toast.error(fetcherEnableOrDisable.data.message);
      }
    }
  }, [fetcherEnableOrDisable.data]);

  useEffect(() => {
    if (!actionData) return;

    if (actionData.success && actionData.message) {
      toast.success(actionData.message);
      setIsAddModalOpen(false);
      setSelectedVisitor(null);
    } else if (
      actionData.message &&
      (actionData.clientSideValidationErrors ||
        actionData.serverValidationErrors)
    ) {
      setFormErrors(
        actionData.clientSideValidationErrors ||
          actionData.serverValidationErrors
      );
      toast.error(actionData.message);
    }
  }, [actionData]);

  const [visitorData, setVisitorData] = useState({
    id: selectedVisitor?.id ?? "",
    visit_type: selectedVisitor?.visit_type ?? "",
    visit_name: selectedVisitor?.name ?? "",
    visit_surname: selectedVisitor?.surname ?? "",
    visit_email: selectedVisitor?.email ?? "",

    NIF: selectedVisitor?.professional_visit?.NIF ?? "",
    age: selectedVisitor?.professional_visit?.age ?? "",

    company_CIF: selectedVisitor?.professional_visit?.company.CIF ?? "",
    company_name: selectedVisitor?.professional_visit?.company.name ?? "",
    company_telephone:
      selectedVisitor?.professional_visit?.company.telephone ?? "",
  });

  const [CIF, setCIF] = useState("");

  const handleChange = (field: string, value: string) => {
    setVisitorData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-7xl mt-5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-left">Gestion de Visitantes</CardTitle>
            <CardDescription className="text-left">
              Gestiona los visitantes de la aplicación
            </CardDescription>
          </div>
          <div>
            <Dialog
              open={isAddModalOpen}
              onOpenChange={(isOpen) => {
                setIsAddModalOpen(isOpen);
                if (!isOpen) {
                  setFormErrors(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setIsAddModalOpen(true),
                      setFormErrors(null),
                      setVisitType("family");
                  }}
                >
                  <Plus />
                  <span className="ml-1">Añadir visitante</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">
                    Añadir Visitante
                  </DialogTitle>
                  <DialogDescription>Añade un Visitante</DialogDescription>
                </DialogHeader>
                <Form method="post">
                  <input type="hidden" name="intent" value="add" />
                  <div className="space-y-1 w-full">
                    <Label>Tipo de visita</Label>
                    <Select
                      onValueChange={(visitType) => setVisitType(visitType)}
                      value={visitType}
                      name="visit_type"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tipo de visita" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family">Visita familiar</SelectItem>
                        <SelectItem value="professional">
                          Visita profesional
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-0 md:flex-row md:gap-6 mt-5">
                    <div className="space-y-1">
                      <Label>Nombre</Label>
                      <Input
                        name="name"
                        className={cn(
                          "input",
                          formErrors?.name &&
                            "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      <div className="min-h-[16px]">
                        {formErrors?.name && (
                          <p className="text-xs text-red-600 mt-1">
                            {formErrors.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Apellido</Label>
                      <Input
                        name="surname"
                        className={cn(
                          "input",
                          formErrors?.surname &&
                            "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                      <div className="min-h-[16px]">
                        {formErrors?.surname && (
                          <p className="text-xs text-red-600 mt-1">
                            {formErrors.surname}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Email</Label>
                    <Input
                      name="email"
                      className={cn(
                        "input",
                        formErrors?.email &&
                          "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <div className="min-h-[16px]">
                      {formErrors?.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>
                  {visitType == "professional" && (
                    <>
                      <input
                        type="hidden"
                        name="CIF"
                        value={visitorData.company_CIF}
                      />
                      <div className="flex flex-col gap-0 md:flex-row md:gap-6">
                        <div className="space-y-1">
                          <Label>NIF</Label>
                          <Input
                            name="NIF"
                            onChange={(e) =>
                              handleChange("NIF", e.target.value)
                            }
                            className={cn(
                              "input",
                              formErrors?.NIF &&
                                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          <div className="min-h-[16px]">
                            {formErrors?.NIF && (
                              <p className="text-xs text-red-600 mt-1">
                                {formErrors.NIF}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Edad</Label>
                          <Input
                            name="age"
                            onChange={(e) =>
                              handleChange("age", e.target.value)
                            }
                            className={cn(
                              "input",
                              formErrors?.age &&
                                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          <div className="min-h-[16px]">
                            {formErrors?.age && (
                              <p className="text-xs text-red-600 mt-1">
                                {formErrors.age}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-0 md:flex-row md:gap-6">
                        <div className="space-y-1">
                          <Label>CIF</Label>
                          <AutoCompleteInput
                            allItems={companies}
                            searchKey="CIF"
                            placeholder="Autocompletado"
                            onSelect={(company: Company) => {
                              handleChange("company_CIF", company.CIF);
                              handleChange("company_name", company.name || "");
                              handleChange(
                                "company_telephone",
                                company.telephone || ""
                              );
                            }}
                            renderItem={(company: Company) =>
                              `${company?.CIF} — ${company.name}`
                            }
                            value={visitorData.company_CIF || ""}
                            // hasError={!!formErrors.CIF}
                            onChange={(value) =>
                              handleChange("company_CIF", value)
                            }
                          />
                          <div className="min-h-[16px]">
                            {formErrors?.CIF && (
                              <p className="text-xs text-red-600 mt-1">
                                {formErrors.CIF}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label>Nombre</Label>
                          <Input
                            name="company_name"
                            value={visitorData.company_name}
                            onChange={(e) =>
                              handleChange("company_name", e.target.value)
                            }
                            className={cn(
                              "input",
                              formErrors?.company_name &&
                                "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                            )}
                          />
                          <div className="min-h-[16px]">
                            {formErrors?.company_name && (
                              <p className="text-xs text-red-600 mt-1">
                                {formErrors.company_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Label>Telefono</Label>
                        <Input
                          name="company_telephone"
                          value={visitorData.company_telephone || ""}
                          onChange={(e) =>
                            handleChange("company_telephone", e.target.value)
                          }
                          className={cn(
                            "input",
                            formErrors?.company_telephone &&
                              "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                          )}
                        />
                        <div className="min-h-[16px]">
                          {formErrors?.company_telephone && (
                            <p className="text-xs text-red-600 mt-1">
                              {formErrors.company_telephone}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  <DialogFooter className="mt-2 flex gap-2 sm:gap-0">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Añadir</Button>
                  </DialogFooter>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        <div className="flex flex-col sm:flex-row gap-2 xsm:justify-between">
          <div className="flex gap-2 flex-col xsm:flex-row w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar visitantes por nombre..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as "all" | "active" | "inactive")
              }
            >
              <SelectTrigger className="sm:max-w-[162px]">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-md border overflow-hidden mt-6">
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[400px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="max-w-[160px]">Nombre</TableHead>
                  <TableHead className="max-w-[160px]">Apellido</TableHead>
                  <TableHead className="max-w-[160px]">Email</TableHead>
                  <TableHead className="">Tipo</TableHead>
                  <TableHead className="text-right w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVisitors.map((visitor: Visit) => (
                  <TableRow key={visitor.id} className="text-sm">
                    <TableCell className="max-w-[160px] truncate">
                      {visitor.name}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {visitor.surname}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {visitor.email}
                    </TableCell>
                    <TableCell className="">
                      {getTipoBadge(visitor.visit_type)}
                    </TableCell>
                    <TableCell className="text-right w-32">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedVisitor(visitor);
                            setVisitType(visitor.visit_type);
                            setCIF(
                              visitor.professional_visit?.company.CIF || ""
                            );
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <Dialog
        open={!!selectedVisitor}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedVisitor(null);
            setFormErrors(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedVisitor &&
                `Detalles del visitante "${selectedVisitor.name}"`}
            </DialogTitle>
            <DialogDescription>
              Actualiza los datos de un visitante
            </DialogDescription>
          </DialogHeader>
          {selectedVisitor && (
            <Form method="patch" className="text-black">
              <input type="hidden" name="intent" value="update" />
              <input
                type="hidden"
                name="visitor_id"
                value={selectedVisitor.id}
              />
              <input type="hidden" name="CIF" value={CIF} />
              <input type="hidden" name="visit_type" value={selectedVisitor.visit_type} />
              <div className="space-y-1 w-full">
                <Label>Tipo de visita</Label>
                <Select
                  onValueChange={(visitType) => setVisitType(visitType)}
                  defaultValue={selectedVisitor.visit_type}
                  disabled
                  name="visit_type"
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de visita" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family">Visita familiar</SelectItem>
                    <SelectItem value="professional">
                      Visita profesional
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-0 md:flex-row md:gap-6 mt-5">
                <div className="space-y-1">
                  <Label>Nombre</Label>
                  <Input
                    name="name"
                    className={cn(
                      "input",
                      formErrors?.name &&
                        "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                    )}
                    defaultValue={selectedVisitor.name}
                  />
                  <div className="min-h-[16px]">
                    {formErrors?.name && (
                      <p className="text-xs text-red-600 mt-1">
                        {formErrors.name}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Apellido</Label>
                  <Input
                    name="surname"
                    className={cn(
                      "input",
                      formErrors?.surname &&
                        "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                    )}
                    defaultValue={selectedVisitor.surname}
                  />
                  <div className="min-h-[16px]">
                    {formErrors?.surname && (
                      <p className="text-xs text-red-600 mt-1">
                        {formErrors.surname}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  name="email"
                  className={cn(
                    "input",
                    formErrors?.email &&
                      "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                  )}
                  defaultValue={selectedVisitor.email}
                />
                <div className="min-h-[16px]">
                  {formErrors?.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>
              {visitType == "professional" && (
                <>
                  <div className="flex flex-col gap-0 md:flex-row md:gap-6">
                    <div className="space-y-1">
                      <Label>NIF</Label>
                      <Input
                        name="NIF"
                        className={cn(
                          "input",
                          formErrors?.NIF &&
                            "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        )}
                        defaultValue={selectedVisitor.professional_visit?.NIF}
                      />
                      <div className="min-h-[16px]">
                        {formErrors?.NIF && (
                          <p className="text-xs text-red-600 mt-1">
                            {formErrors.NIF}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Edad</Label>
                      <Input
                        name="age"
                        className={cn(
                          "input",
                          formErrors?.age &&
                            "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                        )}
                        defaultValue={selectedVisitor.professional_visit?.age}
                      />
                      <div className="min-h-[16px]">
                        {formErrors?.age && (
                          <p className="text-xs text-red-600 mt-1">
                            {formErrors.age}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label>CIF</Label>
                    <AutoCompleteInput
                      allItems={companies}
                      searchKey="CIF"
                      placeholder="Autocompletado"
                      onSelect={(company: Company) => {
                        handleChange("company_CIF", company.CIF);
                        setCIF(company.CIF);
                      }}
                      renderItem={(company: Company) =>
                        `${company?.CIF} — ${company.name}`
                      }
                      value={
                        selectedVisitor.professional_visit?.company.CIF || ""
                      }
                      // hasError={!!formErrors.CIF}
                      onChange={(value) => handleChange("company_CIF", value)}
                    />
                    <div className="min-h-[16px]">
                      {formErrors?.CIF && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.CIF}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
              <DialogFooter className="mt-2 flex gap-2 sm:gap-0">
                <DialogClose asChild>
                  <Button variant="outline">Cancelar</Button>
                </DialogClose>
                <Button type="submit">Actualizar</Button>
              </DialogFooter>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}
