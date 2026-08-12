import { Modal } from "@/components/demo/ui/Modal";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import type { Locale } from "@/lib/i18n/config";
import {
  INCIDENT_STATUS_LABEL,
  INCIDENT_STATUS_TONE,
  INCIDENT_TYPE_LABEL,
} from "@/lib/demo/labels";
import type { Incident, IncidentStatus } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: IncidentStatus[] = ["abierta", "en_proceso", "resuelta"];

const STRINGS: Record<
  Locale,
  { fallbackTitle: string; unassigned: string; status: string; currentStatus: string }
> = {
  es: {
    fallbackTitle: "Incidencia",
    unassigned: "Sin asignar",
    status: "Estado",
    currentStatus: "Estado actual:",
  },
  en: {
    fallbackTitle: "Incident",
    unassigned: "Unassigned",
    status: "Status",
    currentStatus: "Current status:",
  },
};

export function IncidentDetailModal({
  locale,
  incident,
  employeeName,
  onClose,
  onChangeStatus,
}: {
  locale: Locale;
  incident: Incident | null;
  employeeName: string | undefined;
  onClose: () => void;
  onChangeStatus: (status: IncidentStatus) => void;
}) {
  const strings = STRINGS[locale];
  return (
    <Modal
      open={Boolean(incident)}
      onClose={onClose}
      title={incident?.title ?? strings.fallbackTitle}
      widthClassName="max-w-lg"
      locale={locale}
    >
      {incident && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate">
            <span>{INCIDENT_TYPE_LABEL[locale][incident.type]}</span>
            <span>·</span>
            <span>{employeeName ?? strings.unassigned}</span>
            <span>·</span>
            <span>{incident.createdAt}</span>
          </div>

          <p className="text-sm leading-relaxed text-navy">{incident.description}</p>

          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              {strings.status}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onChangeStatus(status)}
                  aria-pressed={incident.status === status}
                  className={cn(
                    "border px-3 py-1.5 text-xs font-semibold transition-colors",
                    incident.status === status
                      ? "border-navy bg-navy text-cream"
                      : "border-line/70 text-slate hover:border-navy/30"
                  )}
                >
                  {INCIDENT_STATUS_LABEL[locale][status]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <StatusBadge tone={INCIDENT_STATUS_TONE[incident.status]}>
              {strings.currentStatus} {INCIDENT_STATUS_LABEL[locale][incident.status]}
            </StatusBadge>
          </div>
        </div>
      )}
    </Modal>
  );
}
