import { DemoTopBar } from "@/components/demo/shared/DemoTopBar";
import { BalanceHeader } from "./BalanceHeader";
import { BalanceHero } from "./BalanceHero";
import { SituationSelector } from "./SituationSelector";
import { Problems, Services, Comparison, Process, Faq } from "./BalanceSections";
import { BalanceContactWizard } from "./BalanceContactWizard";
import { BalanceFooter } from "./BalanceFooter";
import { MobileStickyCta } from "./MobileStickyCta";
import type { Locale } from "@/lib/i18n/config";
import { balanceFont } from "./font";

export function BalanceSite({ locale }: { locale: Locale }) {
  return (
    <div className={`${balanceFont.className} flex min-h-svh flex-col bg-white text-[#14213D] [&_:focus-visible]:outline-[#1F6F4A]`}>
      <DemoTopBar toneClassName="bg-[#14213D] text-white" locale={locale} />
      <BalanceHeader locale={locale} />
      <main>
        <BalanceHero locale={locale} />
        <SituationSelector locale={locale} />
        <Problems locale={locale} />
        <Services locale={locale} />
        <Comparison locale={locale} />
        <Process locale={locale} />
        <Faq locale={locale} />
        <BalanceContactWizard locale={locale} />
      </main>
      <BalanceFooter locale={locale} />
      <MobileStickyCta locale={locale} />
    </div>
  );
}
