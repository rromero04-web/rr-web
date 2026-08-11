import { cn } from "@/lib/utils";

type Tone = "success" | "alert" | "neutral" | "cobalt";

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-success-soft text-success",
  alert: "bg-alert-soft text-alert",
  neutral: "bg-navy/5 text-slate",
  cobalt: "bg-cobalt/10 text-cobalt",
};

export function StatusBadge({
  tone,
  children,
}: {
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        TONE_CLASSES[tone]
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "success" && "bg-success",
          tone === "alert" && "bg-alert",
          tone === "neutral" && "bg-slate",
          tone === "cobalt" && "bg-cobalt"
        )}
      />
      {children}
    </span>
  );
}
