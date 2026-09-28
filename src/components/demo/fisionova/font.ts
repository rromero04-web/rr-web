import { Atkinson_Hyperlegible_Next } from "next/font/google";

// Tipografía de FisioNova: diseñada para máxima legibilidad, pensada para
// pacientes de cualquier edad (y leída a menudo con dolor o con prisa).
export const fisioNovaFont = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
