"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { SITUATIONS, type SituationId } from "./content";
import { cn } from "@/lib/utils";

export function SituationSelector() {
  const [selected, setSelected] = useState<SituationId | null>(null);
  const active = SITUATIONS.find((s) => s.id === selected);

  return (
    <section className="border-b border-[#16233A]/10 bg-white py-16">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <h2 className="text-center text-2xl font-extrabold tracking-tight text-[#16233A] sm:text-3xl">
          ¿Cuál describe mejor tu situación?
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {SITUATIONS.map((situation) => {
            const isActive = situation.id === selected;
            return (
              <button
                key={situation.id}
                type="button"
                onClick={() => setSelected(situation.id)}
                aria-pressed={isActive}
                className={cn(
                  "border px-4 py-3.5 text-left text-sm font-semibold transition-colors",
                  isActive
                    ? "border-[#2F8F5B] bg-[#2F8F5B]/10 text-[#16233A]"
                    : "border-[#16233A]/15 text-[#16233A] hover:border-[#2F8F5B]/50"
                )}
              >
                {situation.label}
              </button>
            );
          })}
        </div>

        {active && (
          <div className="mt-6 flex flex-col items-start gap-4 border border-[#2F8F5B]/30 bg-[#2F8F5B]/5 p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-relaxed text-[#16233A]">{active.message}</p>
            <a
              href="#valoracion"
              className="inline-flex shrink-0 items-center gap-2 bg-[#2F8F5B] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
            >
              Solicitar valoración
              <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
