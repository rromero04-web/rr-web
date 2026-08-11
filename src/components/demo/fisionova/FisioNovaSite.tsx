import { DemoTopBar } from "@/components/demo/shared/DemoTopBar";
import { FisioNovaHeader } from "./FisioNovaHeader";
import { FisioNovaHero } from "./FisioNovaHero";
import { TrustBar, Treatments, HowItWorks, About, Faq } from "./FisioNovaSections";
import { FisioNovaContactForm } from "./FisioNovaContactForm";
import { FisioNovaFooter } from "./FisioNovaFooter";

export function FisioNovaSite() {
  return (
    <div className="flex min-h-svh flex-col bg-[#FAF9F5] text-[#123832]">
      <DemoTopBar toneClassName="bg-[#123832] text-white" />
      <FisioNovaHeader />
      <main>
        <FisioNovaHero />
        <TrustBar />
        <Treatments />
        <HowItWorks />
        <About />
        <Faq />
        <FisioNovaContactForm />
      </main>
      <FisioNovaFooter />
    </div>
  );
}
