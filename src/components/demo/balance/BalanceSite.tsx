import { DemoTopBar } from "@/components/demo/shared/DemoTopBar";
import { BalanceHeader } from "./BalanceHeader";
import { BalanceHero } from "./BalanceHero";
import { SituationSelector } from "./SituationSelector";
import { Problems, Services, Comparison, Process, Faq } from "./BalanceSections";
import { BalanceContactWizard } from "./BalanceContactWizard";
import { BalanceFooter } from "./BalanceFooter";
import { MobileStickyCta } from "./MobileStickyCta";

export function BalanceSite() {
  return (
    <div className="flex min-h-svh flex-col bg-white text-[#16233A]">
      <DemoTopBar toneClassName="bg-[#16233A] text-white" />
      <BalanceHeader />
      <main>
        <BalanceHero />
        <SituationSelector />
        <Problems />
        <Services />
        <Comparison />
        <Process />
        <Faq />
        <BalanceContactWizard />
      </main>
      <BalanceFooter />
      <MobileStickyCta />
    </div>
  );
}
