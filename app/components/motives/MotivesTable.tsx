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
import { Motive } from "~/types/visits.types";
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
import { loader } from "~/routes/_admin.admin.motives";
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
    enabled?: string;
  };
}

export default function MotivesTable() {
  const { motives } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  const [isAddModalOpen, setIsAddMoalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    enabled?: string;
  } | null>(null);
  const [selectedMotive, setSelectedMotive] = useState<Motive | null>(null);
  const fetcherEnableOrDisable = useFetcher<FetcherEnableOrDisableData>();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMotives = motives.filter((motive: Motive) => {
    if (statusFilter === "active" && !motive.enabled) return false;
    if (statusFilter === "inactive" && motive.enabled) return false;

    if (
      searchTerm.trim() !== "" &&
      !motive.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const getStatusBadge = (status: boolean) => {
    if (status == true) {
      return <Badge className="bg-green-500 hover:bg-green-600">Activa</Badge>;
    }
    return <Badge variant="secondary">Inactivo</Badge>;
  };

  useEffect(() => {
    if (fetcherEnableOrDisable.data && fetcherEnableOrDisable.data.message) {
      if (fetcherEnableOrDisable.data.success) {
        toast.success(fetcherEnableOrDisable.data.message);
      } else {
        toast.error(fetcherEnableOrDisable.data.message);
      }
    }
  }, [fetcherEnableOrDisable.data]);

  useEffect(() => {
    if (!actionData) return;

    if (actionData.success && actionData.message) {
      toast.success(actionData.message);
      setIsAddMoalOpen(false);
      setSelectedMotive(null);
    } else if (actionData.message && actionData.clientSideValidationErrors) {
      setFormErrors(actionData.clientSideValidationErrors);
      toast.error(actionData.message);
    }
  }, [actionData]);

  return (
    <Card className="w-full max-w-7xl mt-5">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-left">Motivos</CardTitle>
            <CardDescription className="text-left">
              Gestiona los motivos de la aplicación
            </CardDescription>
          </div>
          <div>
            <Dialog
              open={isAddModalOpen}
              onOpenChange={(isOpen) => {
                setIsAddMoalOpen(isOpen);
                if (!isOpen) {
                  setFormErrors(null);
                }
              }}
            >
              <DialogTrigger asChild>
                <Button onClick={() => setIsAddMoalOpen(true)}>
                  <Plus />
                  <span className="ml-1">Añadir motivo</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">Añadir motivo</DialogTitle>
                  <DialogDescription>
                    Añade un motivo para las visitas familiares
                  </DialogDescription>
                </DialogHeader>
                <Form method="post">
                  <input type="hidden" name="intent" value="add" />
                  <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input
                      name="motive_name"
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
                placeholder="Buscar motivos..."
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
              <SelectTrigger className="sm:max-w-[155px]">
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
                  <TableHead className="max-w-[160px]">Nombre</TableHead>
                  <TableHead className="w-28">Estado</TableHead>
                  <TableHead className="text-right w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMotives.map((motive: Motive) => (
                  <TableRow key={motive.id} className="text-sm">
                    <TableCell className="w-16">{motive.id}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {motive.name}
                    </TableCell>
                    <TableCell className="w-28">
                      {getStatusBadge(motive.enabled)}
                    </TableCell>
                    <TableCell className="text-right w-32">
                      <div className="flex justify-end space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {motive.enabled ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}{" "}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {motive.enabled
                                  ? `¿Eliminar el motivo "${motive.name}"?`
                                  : `¿Habilitar el motivo "${motive.name}"?`}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {motive.enabled
                                  ? "¿Estás seguro de eliminar este motivo? Se deshabilitará y no será visible para los usuarios."
                                  : "¿Estás seguro de habilitar este motivo? Se habilitará y será visible para los usuarios."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <fetcherEnableOrDisable.Form method="post">
                                <input
                                  type="hidden"
                                  name="motive_id"
                                  value={motive.id}
                                />
                                <input
                                  type="hidden"
                                  name="intent"
                                  value={motive.enabled ? "disable" : "enable"}
                                />
                                <AlertDialogAction
                                  type="submit"
                                  disabled={
                                    fetcherEnableOrDisable.state ===
                                    "submitting"
                                  }
                                >
                                  {fetcherEnableOrDisable.state === "submitting"
                                    ? motive.enabled
                                      ? "Deshabilitando..."
                                      : "Habilitando..."
                                    : motive.enabled
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
                            setSelectedMotive(motive);
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
        open={!!selectedMotive}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedMotive(null);
            setFormErrors(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedMotive && `Detalles del motivo "${selectedMotive.name}"`}
            </DialogTitle>
            <DialogDescription>Actualiza un motivo</DialogDescription>
          </DialogHeader>
          {selectedMotive && (
            <Form method="patch" className="text-black">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="motive_id" value={selectedMotive.id} />
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                  name="motive_name"
                  defaultValue={selectedMotive.name}
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
                <Label>Estado</Label>
                <Select
                  defaultValue={selectedMotive.enabled ? "1" : "0"}
                  name="motive_enabled"
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
