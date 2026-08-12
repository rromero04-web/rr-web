"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, localizePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  variant = "desktop",
}: {
  locale: Locale;
  variant?: "desktop" | "mobile";
}) {
  const pathname = usePathname() ?? "/";

  return (
    <nav
      aria-label={locale === "es" ? "Selector de idioma" : "Language selector"}
      className={cn(
        "inline-flex items-center border border-navy/15 text-xs font-semibold",
        variant === "mobile" && "w-full"
      )}
    >
      {LOCALES.map((loc, index) => {
        const href = localizePath(pathname, loc);
        const isActive = loc === locale;
        return (
          <Link
            key={loc}
            href={href}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "px-3 py-2 tracking-wide uppercase transition-colors",
              variant === "mobile" && "flex-1 text-center",
              index === 0 && "border-r border-navy/15",
              isActive
                ? "bg-navy text-cream"
                : "text-navy/60 hover:bg-navy/5 hover:text-navy"
            )}
          >
            {loc}
          </Link>
        );
      })}
    </nav>
  );
}
