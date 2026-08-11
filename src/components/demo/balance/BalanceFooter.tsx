import { BalanceLogo } from "./BalanceLogo";

export function BalanceFooter() {
  return (
    <footer className="bg-[#16233A] py-10 text-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pb-16 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:pb-10">
        <BalanceLogo variant="dark" />
        <p className="max-w-sm text-xs leading-relaxed text-white/60">
          Esta es una demostración ficticia. Ningún dato introducido se
          envía, almacena ni utiliza para prestar un servicio.
        </p>
      </div>
    </footer>
  );
}
