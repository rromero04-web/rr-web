import type { Locale } from "@/lib/i18n/config";
import { NAV_STRINGS, STEP_META, STEP_ORDER } from "@/lib/configurator/strings";
import type { StepId } from "@/lib/configurator/types";

export function StepHeader({ step, locale }: { step: StepId; locale: Locale }) {
  const meta = STEP_META[step][locale];
  const index = STEP_ORDER.indexOf(step);

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.14em] text-cobalt uppercase">
        {NAV_STRINGS[locale].stepOf(index + 1, STEP_ORDER.length)}
      </p>
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">
        {meta.title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate">{meta.subtitle}</p>
    </div>
  );
}
