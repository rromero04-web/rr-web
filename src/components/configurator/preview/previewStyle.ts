import type { ContrastLevel, Density } from "@/lib/configurator/types";

const CONTRAST_ALPHA: Record<ContrastLevel, string> = {
  suave: "18",
  medio: "2b",
  alto: "42",
};

export function softAccent(color: string, contrast: ContrastLevel): string {
  return `${color}${CONTRAST_ALPHA[contrast]}`;
}

export function densityGap(density: Density): string {
  return { comoda: "gap-4", equilibrada: "gap-3", compacta: "gap-2" }[density];
}

export function densityCardPadding(density: Density): string {
  return { comoda: "p-5", equilibrada: "p-4", compacta: "p-3" }[density];
}

export function densityRowPadding(density: Density): string {
  return { comoda: "px-4 py-3.5", equilibrada: "px-3.5 py-2.5", compacta: "px-3 py-1.5" }[density];
}

export function densitySectionSpacing(density: Density): string {
  return { comoda: "py-8", equilibrada: "py-6", compacta: "py-4" }[density];
}
