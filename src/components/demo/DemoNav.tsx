"use client";

import { DEMO_NAV_ITEMS, type DemoSection } from "@/lib/demo/nav";
import { DEMO_COMPANY_NAME } from "@/lib/demo/types";
import { cn } from "@/lib/utils";

interface DemoNavProps {
  active: DemoSection;
  onChange: (section: DemoSection) => void;
}

export function DemoSidebar({ active, onChange }: DemoNavProps) {
  return (
    <nav
      aria-label="Secciones de la demo"
      className="hidden w-60 shrink-0 flex-col border-r border-cream/10 bg-navy py-6 text-cream md:flex"
    >
      <div className="px-6 pb-6">
        <p className="text-xs font-semibold tracking-[0.14em] text-cream/40 uppercase">
          Panel interno
        </p>
        <p className="mt-1 text-base font-bold">{DEMO_COMPANY_NAME}</p>
      </div>
      <ul className="flex flex-1 flex-col gap-1 px-3">
        {DEMO_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-medium transition-colors",
                  isActive
                    ? "bg-cream/10 text-cream"
                    : "text-cream/60 hover:bg-cream/5 hover:text-cream"
                )}
              >
                <Icon size={18} aria-hidden="true" className={isActive ? "text-cobalt-soft" : ""} />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function DemoMobileTabs({ active, onChange }: DemoNavProps) {
  return (
    <nav
      aria-label="Secciones de la demo"
      className="border-b border-line/70 bg-cream md:hidden"
    >
      <ul className="flex gap-1 overflow-x-auto px-3 py-2">
        {DEMO_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = item.id === active;
          return (
            <li key={item.id} className="shrink-0">
              <button
                type="button"
                onClick={() => onChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex items-center gap-1.5 whitespace-nowrap border px-3 py-2 text-xs font-semibold transition-colors",
                  isActive
                    ? "border-navy bg-navy text-cream"
                    : "border-line/70 text-slate"
                )}
              >
                <Icon size={14} aria-hidden="true" />
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
