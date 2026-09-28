import { Public_Sans } from "next/font/google";

// Tipografía de Balance Asesores: neutra y de tono institucional, con cifras
// tabulares para que fechas e importes se alineen como en un libro contable.
export const balanceFont = Public_Sans({
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
