import { Pencil, PencilOff } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Button } from "~/components/ui/button";
import GeneralVisitDataSection from "./GeneralVisitDataSection";
import VisitorDataSection from "./VisitorDataSection";
import CompanyDataSection from "./CompanyDataSection";
import { useRef, useState } from "react";
import { Visit, VisitFormatted } from "~/types/visits.types";
import { DialogDescription } from "@radix-ui/react-dialog";
import { FetcherWithComponents, Form, useLoaderData } from "@remix-run/react";
import StudentDataSection from "./StudentDataSection";
import { Company } from "~/types/companies.types";

interface AddOrUpdateVisitModalProps {
  allVisitors: Visit[];
  allCompanies: Company[];
  fetcherAddOrUpdate: FetcherWithComponents<any>;
  showMode: boolean;
  showModalAddOrUpdate: boolean;
  selectedVisit: VisitFormatted | null;
  handleCloseModal: () => void;
}

export default function AddOrUpdateVisitModal({
  allVisitors,
  allCompanies,
  fetcherAddOrUpdate,
  showMode,
  showModalAddOrUpdate,
  selectedVisit,
  handleCloseModal,
}: AddOrUpdateVisitModalProps) {
  const [editMode, setEditMode] = useState(false);
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

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const errors = fetcherAddOrUpdate.data?.clientSideValidationErrors || {};

  return (
    <Dialog
      open={showModalAddOrUpdate}
      onOpenChange={() => {
        handleCloseModal();
      }}
    >
      <fetcherAddOrUpdate.Form method="post">
        <div>
          <input
            type="text"
            name="intent"
            value={editMode ? "update" : "create"}
            hidden
          />
          <input type="hidden" name="id" value={visitData.id} />
          <input type="hidden" name="user_id" value={visitData.user_id} />
          <input
            type="hidden"
            name="date_entry_value"
            value={visitData.date_entry_value}
          />
          <input
            type="hidden"
            name="date_entry_formatted"
            value={visitData.date_entry_formatted}
          />
          <input type="hidden" name="time_entry" value={visitData.time_entry} />
          <input
            type="hidden"
            name="date_exit_value"
            value={visitData.date_exit_value}
          />
          <input
            type="hidden"
            name="date_exit_formatted"
            value={visitData.date_exit_formatted}
          />
          <input
            type="hidden"
            name="time_exit"
            value={visitData.time_exit ?? ""}
          />
          <input type="hidden" name="visit_type" value={visitData.visit_type} />
          <input type="hidden" name="visit_id" value={visitData.visit_id} />
          <input type="hidden" name="visit_name" value={visitData.visit_name} />
          <input
            type="hidden"
            name="visit_surname"
            value={visitData.visit_surname}
          />
          <input
            type="hidden"
            name="visit_email"
            value={visitData.visit_email}
          />

          <input
            type="hidden"
            name="student_name"
            value={visitData.student_name ?? ""}
          />
          <input
            type="hidden"
            name="student_surname"
            value={visitData.student_surname ?? ""}
          />
          <input
            type="hidden"
            name="student_course"
            value={visitData.student_course ?? ""}
          />
          <input
            type="hidden"
            name="motive_id"
            value={visitData.motive_id ?? ""}
          />
          <input
            type="hidden"
            name="motive_name"
            value={visitData.motive_name ?? ""}
          />
          <input
            type="hidden"
            name="custom_motive"
            value={visitData.custom_motive ?? ""}
          />

          <input type="hidden" name="NIF" value={visitData.NIF ?? ""} />
          <input type="hidden" name="age" value={visitData.age ?? ""} />
          <input
            type="hidden"
            name="service_id"
            value={visitData.service_id ?? ""}
          />
          <input
            type="hidden"
            name="service_name"
            value={visitData.service_name ?? ""}
          />
          <input type="hidden" name="task" value={visitData.task ?? ""} />

          <input
            type="hidden"
            name="company_id"
            value={visitData.company_id ?? ""}
          />
          <input
            type="hidden"
            name="company_CIF"
            value={visitData.company_CIF ?? ""}
          />
          <input
            type="hidden"
            name="company_name"
            value={visitData.company_name ?? ""}
          />
          <input
            type="hidden"
            name="company_telephone"
            value={visitData.company_telephone ?? ""}
          />
        </div>

        <button type="submit" ref={submitBtnRef} hidden>
          Enviar
        </button>
        <DialogContent className="max-w-5xl max-h-[95vh]">
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
          <ScrollArea className="px-3 max-h-[68vh] overflow-y-auto">
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
                  allVisitors={allVisitors}
                  showMode={showMode}
                  editMode={editMode}
                  visitData={visitData}
                  handleChange={handleChange}
                  errors={errors}
                />
                {visitData.visit_type == "family" && (
                  <StudentDataSection
                    showMode={showMode}
                    editMode={editMode}
                    visitData={visitData}
                    handleChange={handleChange}
                    fetcherAddOrUpdate={fetcherAddOrUpdate}
                  />
                )}
                {visitData.visit_type == "professional" && (
                  <CompanyDataSection
                    showMode={showMode}
                    editMode={editMode}
                    visitData={visitData}
                    handleChange={handleChange}
                    fetcherAddOrUpdate={fetcherAddOrUpdate}
                    allCompanies={allCompanies}
                  />
                )}
              </div>
            </div>
          </ScrollArea>
          <DialogFooter className="mt-1 px-3">
            {!showMode && (
              <Button onClick={() => submitBtnRef.current?.click()}>
                Añadir
              </Button>
            )}
            {editMode && (
              <Button onClick={() => submitBtnRef.current?.click()}>
                Actualizar
              </Button>
            )}
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  handleCloseModal();
                }}
              >
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </fetcherAddOrUpdate.Form>
    </Dialog>
  );
}
