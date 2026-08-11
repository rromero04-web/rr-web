export function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" }) {
  return (
    <span
      aria-hidden="true"
      className={
        size === "sm"
          ? "inline-flex h-8 w-8 shrink-0 items-center justify-center border border-navy/15 bg-navy/5 text-xs font-bold text-navy"
          : "inline-flex h-11 w-11 shrink-0 items-center justify-center border border-navy/15 bg-navy/5 text-sm font-bold text-navy"
      }
    >
      {initials}
    </span>
  );
}
