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
    email?: string;
    password?: string;
    admin?: boolean;
    enabled?: string;
  };
  serverSideValidationErrors?: {
    email?: string;
  }
}

export default function UsersTable() {
  const { users } = useLoaderData<typeof loader>();
  const actionData = useActionData<ActionData>();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    admin?: boolean;
    enabled?: string;
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const fetcherEnableOrDisable = useFetcher<FetcherEnableOrDisableData>();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter((user: User) => {
    if (statusFilter === "active" && !user.enabled) return false;
    if (statusFilter === "inactive" && user.enabled) return false;

    if (
      searchTerm.trim() !== "" &&
      !user.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;

    return true;
  });

  const getRolBadge = (status: boolean) => {
    if (status == true) {
      return <Badge className="bg-green-500 hover:bg-green-600">Admin</Badge>;
    }
    return <Badge variant="secondary">No admin</Badge>;
  };

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
      setSelectedUser(null);
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
            <CardTitle className="text-left">Gestion de Usuarios</CardTitle>
            <CardDescription className="text-left">
              Gestiona los usuarios de la aplicación
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
                  <span className="ml-1">Añadir usuario</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-xl">Añadir usuario</DialogTitle>
                  <DialogDescription>
                    Añade un usuario para controlar las visitas
                  </DialogDescription>
                </DialogHeader>
                <Form method="post">
                  <input type="hidden" name="intent" value="add" />
                  <div className="space-y-1">
                    <Label>Nombre</Label>
                    <Input
                      name="user_name"
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
                    <Label>Email</Label>
                    <Input
                      name="user_email"
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
                    <Label>Contraseña</Label>
                    <Input
                      name="user_password"
                      type="password"
                      className={cn(
                        "input",
                        formErrors?.password &&
                          "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                      )}
                    />
                    <div className="min-h-[16px]">
                      {formErrors?.password && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.password}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Rol</Label>
                    <Select defaultValue="0" name="user_admin">
                      <SelectTrigger
                        className={cn(
                          "input",
                          formErrors?.admin &&
                            "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Admin</SelectItem>
                        <SelectItem value="0">No admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="min-h-[16px]">
                      {formErrors?.admin && (
                        <p className="text-xs text-red-600 mt-1">
                          {formErrors.admin}
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
                placeholder="Buscar usuarios por nombre o email..."
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
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="w-28">Estado</TableHead>
                  <TableHead className="text-right w-32">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user: User) => (
                  <TableRow key={user.id} className="text-sm">
                    <TableCell className="w-16">{user.id}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {user.name}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {user.email}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {getRolBadge(user.admin)}
                    </TableCell>
                    <TableCell className="w-28">
                      {getStatusBadge(user.enabled)}
                    </TableCell>
                    <TableCell className="text-right w-32">
                      <div className="flex justify-end space-x-2">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              {user.enabled ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}{" "}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {user.enabled
                                  ? `¿Deshabilitar el usuario "${user.name}"?`
                                  : `¿Habilitar el usuario "${user.name}"?`}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                {user.enabled
                                  ? "¿Estás seguro de deshabilitar este usuario? Se deshabilitará y no podra iniciar sesión."
                                  : "¿Estás seguro de habilitar este usuario? Se habilitará y podra controlar las visitas."}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <fetcherEnableOrDisable.Form method="post">
                                <input
                                  type="hidden"
                                  name="user_id"
                                  value={user.id}
                                />
                                <input
                                  type="hidden"
                                  name="intent"
                                  value={user.enabled ? "disable" : "enable"}
                                />
                                <AlertDialogAction
                                  type="submit"
                                  disabled={
                                    fetcherEnableOrDisable.state ===
                                    "submitting"
                                  }
                                >
                                  {fetcherEnableOrDisable.state === "submitting"
                                    ? user.enabled
                                      ? "Deshabilitando..."
                                      : "Habilitando..."
                                    : user.enabled
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
                            setSelectedUser(user);
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
        open={!!selectedUser}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedUser(null);
            setFormErrors(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedUser && `Detalles del usuario "${selectedUser.name}"`}
            </DialogTitle>
            <DialogDescription>Actualiza el usuario</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Form method="patch" className="text-black">
              <input type="hidden" name="intent" value="update" />
              <input type="hidden" name="user_id" value={selectedUser.id} />
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                  name="user_name"
                  defaultValue={selectedUser.name}
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
                <Label>Email</Label>
                <Input
                  name="user_email"
                  defaultValue={selectedUser.email}
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
              <div className="space-y-1">
                <Label>Nueva contraseña (Opcional)</Label>
                <Input
                  name="user_password"
                  className={cn(
                    "input",
                    formErrors?.password &&
                      "border-red-500 focus:border-red-500 focus-visible:ring-red-500"
                  )}
                />
                <div className="min-h-[16px]">
                  {formErrors?.password && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.password}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Rol</Label>
                <Select
                  defaultValue={selectedUser.admin ? "1" : "0"}
                  name="user_admin"
                >
                  <SelectTrigger
                    className={cn(
                      "input",
                      formErrors?.admin &&
                        "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    )}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Admin</SelectItem>
                    <SelectItem value="0">No admin</SelectItem>
                  </SelectContent>
                </Select>
                <div className="min-h-[16px]">
                  {formErrors?.admin && (
                    <p className="text-xs text-red-600 mt-1">
                      {formErrors.admin}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Estado</Label>
                <Select
                  defaultValue={selectedUser.enabled ? "1" : "0"}
                  name="user_enabled"
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
