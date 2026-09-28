export function BalanceLogo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const ink = variant === "dark" ? "#FFFFFF" : "#14213D";
  const green = variant === "dark" ? "#7FC4A0" : "#1F6F4A";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {/* Isotipo: una balanza de dos platillos en equilibrio, trazada como un asiento contable. */}
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 5v22M8 27h16" stroke={ink} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M5 10h22" stroke={green} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M5 10 2 18h6L5 10ZM27 10l-3 8h6l-3-8Z" fill={green} />
      </svg>
      <span className="text-lg font-bold tracking-[-0.01em]" style={{ color: ink }}>
        Balance <span className="font-normal">Asesores</span>
      </span>
    </span>
  );
}
