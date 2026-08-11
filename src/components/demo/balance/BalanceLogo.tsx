export function BalanceLogo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const textColor = variant === "dark" ? "text-white" : "text-[#16233A]";
  const accentColor = variant === "dark" ? "text-[#3FAE73]" : "text-[#2F8F5B]";

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg width="28" height="28" viewBox="0 0 40 40" aria-hidden="true">
        <rect x="6" y="22" width="6" height="12" fill="#16233A" />
        <rect x="17" y="14" width="6" height="20" fill="#16233A" />
        <rect x="28" y="6" width="6" height="28" fill="#2F8F5B" />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${textColor}`}>
        Balance<span className={accentColor}>Asesores</span>
      </span>
    </span>
  );
}
