import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Check, Edit, Plus, Search, Trash2 } from "lucide-react";
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
import { User } from "~/types/user.types";
import { action } from "~/routes/_guest.auth";
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
    CIF?: string;
    name?: string;
    telephone?: string;
    enabled?: boolean;
  };
  serverSideValidationErrors?: {
    CIF?: string;
    telephone?: string;
  };
}

export default function CompaniesTable() {
  const { companies } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    CIF?: string;
    name?: string;
    telephone?: string;
    enabled?: boolean;
  } | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const fetcherEnableOrDisable = useFetcher<FetcherEnableOrDisableData>();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter((company: Company) => {
    if (statusFilter === "active" && !company.enabled) return false;
    if (statusFilter === "inactive" && company.enabled) return false;

    if (
      searchTerm.trim() !== "" &&
      !company.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const getStatusBadge = (status: boolean) => {
    if (status == true) {
      return <Badge className="bg-green-500 hover:bg-green-600">Activo</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
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
      setSelectedCompany(null);
    } else if (actionData.message && actionData.clientSideValidationErrors) {
      setFormErrors(actionData.clientSideValidationErrors);
      toast.error(actionData.message);
    } else if (actionData.message && actionData.serverSideValidationErrors) {
      setFormErrors(actionData.serverSideValidationErrors);
      toast.error(actionData.message);
    }
  }, [actionData]);

  return (
    <Card className="w-full max-w-7xl mt-5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-left">
              Gestion de Empresas de Profesionales
            </CardTitle>
            <CardDescription className="text-left">
              Gestiona las empresas de la aplicación
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
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus />
                  <span className="ml-1">Añadir empresa</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">Añadir empresa</DialogTitle>
                  <DialogDescription>
                    Añade una empresa para las visitas profesionales
                  </DialogDescription>
                </DialogHeader>
                <Form method="post">
                  <input type="hidden" name="intent" value="add" />
                  <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input
                      name="company_name"
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
                    <Label>CIF</Label>
                    <Input
                      name="company_CIF"
                      className={cn(
                        "input",
                        formErrors?.CIF &&
                          "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <div className="min-h-[16px]">
                      {formErrors?.CIF && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Telefono</Label>
                    <Input
                      name="company_telephone"
                      className={cn(
                        "input",
                        formErrors?.telephone &&
                          "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <div className="min-h-[16px]">
                      {formErrors?.telephone && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.telephone}
                        </p>
                      )}
                    </div>
                  </div>
                  <DialogFooter className="mt-2 flex gap-2 sm:gap-0">
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
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
                placeholder="Buscar empresas por nombre..."
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
                  <TableHead className="w-16">Id</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>CIF</TableHead>
                  <TableHead>Telefono</TableHead>
                  <TableHead className="w-28">Estado</TableHead>
                  <TableHead className="text-right w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company: Company) => (
                  <TableRow key={company.id} className="text-sm">
                    <TableCell className="w-16">{company.id}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {company.name}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {company.CIF}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {company.telephone}
                    </TableCell>
                    <TableCell className="w-28">
                      {getStatusBadge(company.enabled)}
                    </TableCell>
                    <TableCell className="text-right w-32">
                      <div className="flex justify-end space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {company.enabled ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}{" "}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {company.enabled
                                  ? `¿Deshabilitar la empresa "${company.name}"?`
                                  : `¿Habilitar la empresa "${company.name}"?`}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {company.enabled
                                  ? "¿Estás seguro de deshabilitar esta empresa? Se deshabilitará y no sera visible para las visitas profesionales."
                                  : "¿Estás seguro de habilitar esta empresa?."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <fetcherEnableOrDisable.Form method="post">
                                <input
                                  type="hidden"
                                  name="company_id"
                                  value={company.id}
                                />
                                <input
                                  type="hidden"
                                  name="intent"
                                  value={company.enabled ? "disable" : "enable"}
                                />
                                <AlertDialogAction
                                  type="submit"
                                  disabled={
                                    fetcherEnableOrDisable.state ===
                                    "submitting"
                                  }
                                >
                                  {fetcherEnableOrDisable.state === "submitting"
                                    ? company.enabled
                                      ? "Deshabilitando..."
                                      : "Habilitando..."
                                    : company.enabled
                                    ? "Deshabilitar"
                                    : "Habilitar"}
                                </AlertDialogAction>
                              </fetcherEnableOrDisable.Form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCompany(company);
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
        open={!!selectedCompany}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedCompany(null);
            setFormErrors(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedCompany &&
                `Detalles de la empresa "${selectedCompany.name}"`}
            </DialogTitle>
            <DialogDescription>
              Actualiza los datos de la empresa
            </DialogDescription>
          </DialogHeader>
          {selectedCompany && (
            <Form method="patch" className="text-black">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="company_id" value={selectedCompany.id} />
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                  name="company_name"
                  defaultValue={selectedCompany.name}
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
                <Label>CIF</Label>
                <Input
                  name="company_CIF"
                  defaultValue={selectedCompany.CIF}
                  className={cn(
                    "input",
                    formErrors?.CIF &&
                      "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                  )}
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
                <Label>Telefono</Label>
                <Input
                  name="company_telephone"
                  defaultValue={selectedCompany.telephone}
                  className={cn(
                    "input",
                    formErrors?.telephone &&
                      "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <div className="min-h-[16px]">
                  {formErrors?.telephone && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.telephone}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Select
                  defaultValue={selectedCompany.enabled ? "1" : "0"}
                  name="company_enabled"
                >
                  <SelectTrigger
                    className={cn(
                      "input",
                      formErrors?.enabled &&
                        "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Activo</SelectItem>
                    <SelectItem value="0">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
                <div className="min-h-[16px]">
                  {formErrors?.enabled && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.enabled}
                    </p>
                  )}
                </div>
              </div>
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
