export function MobileStickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-[#16233A]/10 bg-white/95 p-3 backdrop-blur md:hidden">
      <a
        href="#valoracion"
        className="flex items-center justify-center bg-[#2F8F5B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#26744A]"
      >
        Solicitar valoración inicial
      </a>
    </div>
  );
}
