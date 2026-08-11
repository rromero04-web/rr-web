import { Modal } from "@/components/demo/ui/Modal";
import { StatusBadge } from "@/components/demo/ui/StatusBadge";
import {
  INCIDENT_STATUS_LABEL,
  INCIDENT_STATUS_TONE,
  INCIDENT_TYPE_LABEL,
} from "@/lib/demo/labels";
import type { Incident, IncidentStatus } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: IncidentStatus[] = ["abierta", "en_proceso", "resuelta"];

export function IncidentDetailModal({
  incident,
  employeeName,
  onClose,
  onChangeStatus,
}: {
  incident: Incident | null;
  employeeName: string | undefined;
  onClose: () => void;
  onChangeStatus: (status: IncidentStatus) => void;
}) {
  return (
    <Modal
      open={Boolean(incident)}
      onClose={onClose}
      title={incident?.title ?? "Incidencia"}
      widthClassName="max-w-lg"
    >
      {incident && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate">
            <span>{INCIDENT_TYPE_LABEL[incident.type]}</span>
            <span>·</span>
            <span>{employeeName ?? "Sin asignar"}</span>
            <span>·</span>
            <span>{incident.createdAt}</span>
          </div>

          <p className="text-sm leading-relaxed text-navy">{incident.description}</p>

          <div>
            <p className="text-xs font-semibold tracking-[0.1em] text-slate uppercase">
              Estado
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
                  {INCIDENT_STATUS_LABEL[status]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <StatusBadge tone={INCIDENT_STATUS_TONE[incident.status]}>
              Estado actual: {INCIDENT_STATUS_LABEL[incident.status]}
            </StatusBadge>
          </div>
        </div>
      )}
    </Modal>
  );
}
