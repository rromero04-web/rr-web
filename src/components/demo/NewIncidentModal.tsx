"use client";

import { useId, useState } from "react";
import { Modal } from "@/components/demo/ui/Modal";
import type { Locale } from "@/lib/i18n/config";
import { INCIDENT_TYPE_LABEL } from "@/lib/demo/labels";
import type { Employee, Incident, IncidentType } from "@/lib/demo/types";

const TYPES: IncidentType[] = ["material", "equipo", "turno", "otro"];

const STRINGS: Record<
  Locale,
  {
    title: string;
    fieldTitle: string;
    titlePlaceholder: string;
    employee: string;
    type: string;
    description: string;
    descriptionPlaceholder: string;
    submit: string;
  }
> = {
  es: {
    title: "Nueva incidencia",
    fieldTitle: "Título",
    titlePlaceholder: "p. ej. Falta material en almacén",
    employee: "Empleado",
    type: "Tipo",
    description: "Descripción",
    descriptionPlaceholder: "Describe brevemente la incidencia.",
    submit: "Crear incidencia",
  },
  en: {
    title: "New incident",
    fieldTitle: "Title",
    titlePlaceholder: "e.g. Missing supplies in the warehouse",
    employee: "Employee",
    type: "Type",
    description: "Description",
    descriptionPlaceholder: "Briefly describe the incident.",
    submit: "Create incident",
  },
};

export function NewIncidentModal({
  locale,
  open,
  employees,
  onClose,
  onCreate,
}: {
  locale: Locale;
  open: boolean;
  employees: Employee[];
  onClose: () => void;
  onCreate: (incident: Omit<Incident, "id" | "createdAt">) => void;
}) {
  const formId = useId();
  const strings = STRINGS[locale];
  const [title, setTitle] = useState("");
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [type, setType] = useState<IncidentType>("otro");
  const [description, setDescription] = useState("");

  function reset() {
    setTitle("");
    setEmployeeId(employees[0]?.id ?? "");
    setType("otro");
    setDescription("");
  }

  return (
    <Modal
      open={open}
      onClose={() => {
        onClose();
        reset();
      }}
      title={strings.title}
      widthClassName="max-w-md"
      locale={locale}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!title.trim() || !description.trim()) return;
          onCreate({
            title: title.trim(),
            employeeId,
            type,
            status: "abierta",
            description: description.trim(),
          });
          onClose();
          reset();
        }}
        className="space-y-4"
      >
        <div>
          <label htmlFor={`${formId}-title`} className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
            {strings.fieldTitle}
          </label>
          <input
            id={`${formId}-title`}
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="mt-1.5 w-full border border-navy/20 bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-cobalt"
            placeholder={strings.titlePlaceholder}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${formId}-employee`} className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.employee}
            </label>
            <select
              id={`${formId}-employee`}
              value={employeeId}
              onChange={(event) => setEmployeeId(event.target.value)}
              className="mt-1.5 w-full border border-navy/20 bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-cobalt"
            >
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${formId}-type`} className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.type}
            </label>
            <select
              id={`${formId}-type`}
              value={type}
              onChange={(event) => setType(event.target.value as IncidentType)}
              className="mt-1.5 w-full border border-navy/20 bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-cobalt"
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {INCIDENT_TYPE_LABEL[locale][t]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-description`} className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
            {strings.description}
          </label>
          <textarea
            id={`${formId}-description`}
            required
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="mt-1.5 w-full resize-none border border-navy/20 bg-cream px-3 py-2 text-sm text-navy outline-none focus:border-cobalt"
            placeholder={strings.descriptionPlaceholder}
          />
        </div>

        <button
          type="submit"
          className="w-full border border-navy bg-navy px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cobalt hover:border-cobalt"
        >
          {strings.submit}
        </button>
      </form>
    </Modal>
  );
}
