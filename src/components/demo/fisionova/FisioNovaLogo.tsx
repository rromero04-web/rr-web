export function FisioNovaLogo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const ink = variant === "dark" ? "#FFFFFF" : "#0F4C45";

  return (
    <span className={`inline-flex items-center gap-2.5 ${className ?? ""}`}>
      {/* Isotipo: un arco de movimiento con su articulación, como el goniómetro del hero. */}
      <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
        <path d="M5 24a11 11 0 0 1 22 0" fill="none" stroke="#1C9CC0" strokeWidth="4" strokeLinecap="round" />
        <path d="M16 24 8.5 13" stroke={ink} strokeWidth="3" strokeLinecap="round" />
        <circle cx="16" cy="24" r="3.5" fill={ink} />
      </svg>
      <span className="text-xl font-bold tracking-[-0.01em]" style={{ color: ink }}>
        FisioNova
      </span>
    </span>
  );
}
