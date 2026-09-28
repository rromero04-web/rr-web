"use client";

import { useEffect, useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import { NAV_STRINGS, STEP_META, STEP_ORDER } from "@/lib/configurator/strings";
import type { StepId } from "@/lib/configurator/types";

export function StepHeader({ step, locale }: { step: StepId; locale: Locale }) {
  const meta = STEP_META[step][locale];
  const index = STEP_ORDER.indexOf(step);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    heading.focus({ preventScroll: true });
    // Each step remounts after the previous panel exits. Bring its title back
    // into view instead of leaving mobile visitors halfway down the next step.
    if (heading.getBoundingClientRect().top < 100 || heading.getBoundingClientRect().bottom > window.innerHeight) {
      heading.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [step]);

  return (
    <div>
      <p className="text-sm text-slate">
        {NAV_STRINGS[locale].stepOf(index + 1, STEP_ORDER.length)}
      </p>
      <h2 ref={headingRef} tabIndex={-1} className="rr-display rr-step-title mt-2">
        {meta.title}
      </h2>
      <p className="mt-3 max-w-[34em] text-base leading-relaxed text-slate">{meta.subtitle}</p>
    </div>
  );
}
