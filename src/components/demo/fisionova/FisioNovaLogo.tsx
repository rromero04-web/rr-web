export function FisioNovaLogo({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const textColor = variant === "dark" ? "text-white" : "text-[#123832]";
  const accentColor = variant === "dark" ? "text-[#8FD6BE]" : "text-[#0E6E64]";

  return (
    <span className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <svg width="30" height="30" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M6 30C6 18 14 8 26 8c2 0 4 .3 6 1-3 1-5 3-6 6-1 4 1 8 5 10-4 3-9 4-14 2-6-2-10-8-11-14C5 22 5 26 6 30Z"
          fill="#0E6E64"
        />
        <circle cx="27.5" cy="14.5" r="3" fill="#8FD6BE" />
      </svg>
      <span className={`text-lg font-bold tracking-tight ${textColor}`}>
        Fisio<span className={accentColor}>Nova</span>
      </span>
    </span>
  );
}
