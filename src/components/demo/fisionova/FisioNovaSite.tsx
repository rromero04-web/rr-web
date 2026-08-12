import type { Locale } from "@/lib/i18n/config";
import { DemoTopBar } from "@/components/demo/shared/DemoTopBar";
import { FisioNovaHeader } from "./FisioNovaHeader";
import { FisioNovaHero } from "./FisioNovaHero";
import { TrustBar, Treatments, HowItWorks, About, Faq } from "./FisioNovaSections";
import { FisioNovaContactForm } from "./FisioNovaContactForm";
import { FisioNovaFooter } from "./FisioNovaFooter";

export function FisioNovaSite({ locale }: { locale: Locale }) {
  return (
    <div className="flex min-h-svh flex-col bg-[#FAF9F5] text-[#123832]">
      <DemoTopBar toneClassName="bg-[#123832] text-white" locale={locale} />
      <FisioNovaHeader locale={locale} />
      <main>
        <FisioNovaHero locale={locale} />
        <TrustBar locale={locale} />
        <Treatments locale={locale} />
        <HowItWorks locale={locale} />
        <About locale={locale} />
        <Faq locale={locale} />
        <FisioNovaContactForm locale={locale} />
      </main>
      <FisioNovaFooter locale={locale} />
    </div>
  );
}
