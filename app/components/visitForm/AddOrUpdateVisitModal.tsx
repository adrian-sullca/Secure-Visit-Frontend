import { Pencil, PencilOff } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import GeneralVisitDataSection from "./GeneralVisitDataSection";
import VisitorDataSection from "./VisitorDataSection";
import CompanyDataSection from "./CompanyDataSection";
import { useEffect, useState } from "react";
import { VisitFormatted } from "~/types/visits.types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useLoaderData } from "@remix-run/react";
import StudentDataSection from "./StudentDataSection";

interface AddOrUpdateVisitModalProps {
  showMode: boolean;
  showModalAddOrUpdate: boolean;
  setShowModalAddOrUpdate: (value: boolean) => void;
  selectedVisit: VisitFormatted | null;
  setSelectedVisit: (visit: VisitFormatted | null) => void;
}

export default function AddOrUpdateVisitModal({
  showMode,
  showModalAddOrUpdate,
  setShowModalAddOrUpdate,
  selectedVisit,
  setSelectedVisit,
}: AddOrUpdateVisitModalProps) {
  const loaderData =
    useLoaderData<typeof import("./../../routes/_auth.visits").loader>();

  const [editMode, setEditMode] = useState(false);
  console.log(selectedVisit);
  const [visitData, setVisitData] = useState<VisitFormatted>({
    id: selectedVisit?.id ?? "",
    user_id: selectedVisit?.user_id ?? "",
    date_entry_value: selectedVisit?.date_entry_value ?? "",
    date_entry_formatted: selectedVisit?.date_entry_formatted ?? "",
    time_entry: selectedVisit?.time_entry ?? "",
    date_exit_value: selectedVisit?.date_exit_value ?? "",
    date_exit_formatted: selectedVisit?.date_exit_formatted ?? "",
    time_exit: selectedVisit?.time_exit ?? "",
    visit_type: selectedVisit?.visit_type ?? "family",
    visit_id: selectedVisit?.visit_id ?? "",
    visit_name: selectedVisit?.visit_name ?? "",
    visit_surname: selectedVisit?.visit_surname ?? "",
    visit_email: selectedVisit?.visit_email ?? "",

    student_name: selectedVisit?.student_name ?? "",
    student_surname: selectedVisit?.student_surname ?? "",
    student_course: selectedVisit?.student_course ?? "",
    motive_id: selectedVisit?.motive_id ?? "1",
    motive_name: selectedVisit?.motive_name ?? "",
    custom_motive: selectedVisit?.custom_motive ?? "",

    NIF: selectedVisit?.NIF ?? "",
    age: selectedVisit?.age ?? "",
    service_id: selectedVisit?.service_id ?? "1",
    service_name: selectedVisit?.service_name ?? "",
    task: selectedVisit?.task ?? "",

    company_id: selectedVisit?.company_id ?? "",
    company_CIF: selectedVisit?.company_CIF ?? "",
    company_name: selectedVisit?.company_name ?? "",
    company_telephone: selectedVisit?.company_telephone ?? "",
  });

  const handleChange = (field: string, value: string) => {
    setVisitData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={showModalAddOrUpdate}
      onOpenChange={() => {
        setSelectedVisit(null);
        setShowModalAddOrUpdate(false);
      }}
    >
      <DialogContent className="max-w-5xl">
        <DialogHeader className="px-3">
          <div className="flex gap-3 items-center">
            <DialogTitle className="text-xl">
              {showMode ? "Detalles de Visita" : "Registrar Entrada"}
            </DialogTitle>
            {showMode ? (
              editMode === false ? (
                <Pencil
                  onClick={() => setEditMode(!editMode)}
                  className="w-5 h-5 cursor-pointer"
                />
              ) : (
                <PencilOff
                  onClick={() => setEditMode(!editMode)}
                  className="w-5 h-5 cursor-pointer text-custom-blue"
                />
              )
            ) : null}
          </div>
          <DialogDescription className="text-gray-600 text-left">
            {showMode ? "Detalles de Visita" : "Registra una nueva entrada"}
          </DialogDescription>
        </DialogHeader>
        {/* <ScrollArea className={`px-3 ${showMode ? "h-[670px]" : "h-[590px]"}`}> */}
        <ScrollArea className="px-3 h-[480px]">
          <div className="space-y-5">
            {/* General Visit Data */}
            <div>
              <GeneralVisitDataSection
                showMode={showMode}
                editMode={editMode}
                visitData={visitData}
                handleChange={handleChange}
              />
            </div>
            <div className="md:flex justify-between gap-5 space-y-5 md:space-y-0">
              {/* Visitor Data */}
              <VisitorDataSection
                showMode={showMode}
                editMode={editMode}
                visitData={visitData}
                handleChange={handleChange}
              />
              {visitData.visit_type == "family" && (
                <StudentDataSection
                  showMode={showMode}
                  editMode={editMode}
                  visitData={visitData}
                  handleChange={handleChange}
                />
              )}
              {visitData.visit_type == "professional" && (
                <CompanyDataSection
                  showMode={showMode}
                  editMode={editMode}
                  visitData={visitData}
                  handleChange={handleChange}
                />
              )}
            </div>
          </div>
        </ScrollArea>
        <DialogFooter className="mt-1 px-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedVisit(null);
              }}
            >
              Cerrar
            </Button>
          </DialogClose>
          {editMode && <Button type="submit">Actualizar</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
