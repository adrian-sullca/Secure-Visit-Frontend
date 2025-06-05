import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
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
import { useLoaderData } from "@remix-run/react";
import { loader } from "~/routes/_admin.admin.motives";
import { Motive } from "~/types/visits.types";
import { Input } from "../ui/input";

export default function MotivesTable() {
  const { motives } = useLoaderData<typeof loader>();
  console.log(motives);
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
            <Button>
              <Plus />
              <span className="ml-1">Añadir motivo</span>
            </Button>
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
              />
            </div>
            <Select>
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
                {motives.map((motive: Motive) => (
                  <TableRow key={motive.id} className="text-sm">
                    <TableCell className="w-16">{motive.id}</TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {motive.name}
                    </TableCell>
                    <TableCell className="w-28">
                      {motive.enabled ? (
                        <span className="text-green-600 font-semibold">
                          Activo
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Inactivo
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right w-32">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                {`¿Eliminar el motivo ${motive.name} ? `}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                ¿Estás seguro de eliminar este motivo? Se
                                deshabilitara y no sera visible para los
                                usuarios.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction>Eliminar</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
