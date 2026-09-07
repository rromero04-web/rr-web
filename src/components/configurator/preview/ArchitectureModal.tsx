"use client";

import type { Locale } from "@/lib/i18n/config";
import { Modal } from "@/components/demo/ui/Modal";
import { TECHNOLOGY_INFO } from "@/lib/configurator/engine";
import { ARCHITECTURE_STRINGS } from "@/lib/configurator/strings";
import type { TechId } from "@/lib/configurator/types";

export function ArchitectureModal({
  open,
  onClose,
  technologies,
  locale,
}: {
  open: boolean;
  onClose: () => void;
  technologies: TechId[];
  locale: Locale;
}) {
  const t = ARCHITECTURE_STRINGS[locale];

  return (
    <Modal open={open} onClose={onClose} title={t.title} locale={locale} widthClassName="max-w-md">
      <p className="text-sm leading-relaxed text-slate">{t.intro}</p>
      <ul className="mt-4 flex flex-col gap-3">
        {technologies.map((id) => {
          const info = TECHNOLOGY_INFO[id];
          return (
            <li key={id} className="border border-line/70 p-3">
              <p className="text-sm font-bold text-navy">{info.label[locale]}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate">{info.description[locale]}</p>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
