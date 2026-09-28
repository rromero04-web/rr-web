import type { Locale } from "@/lib/i18n/config";
import { DemoTopBar } from "@/components/demo/shared/DemoTopBar";
import { FisioNovaHeader } from "./FisioNovaHeader";
import { FisioNovaHero } from "./FisioNovaHero";
import { TrustBar, Treatments, HowItWorks, About, Faq } from "./FisioNovaSections";
import { FisioNovaContactForm } from "./FisioNovaContactForm";
import { FisioNovaFooter } from "./FisioNovaFooter";
import { fisioNovaFont } from "./font";

export function FisioNovaSite({ locale }: { locale: Locale }) {
  return (
    <div className={`${fisioNovaFont.className} flex min-h-svh flex-col bg-[#FBFCFA] text-[#0F4C45] [&_:focus-visible]:outline-[#1C9CC0]`}>
      <DemoTopBar toneClassName="bg-[#0A3A34] text-white" locale={locale} />
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
