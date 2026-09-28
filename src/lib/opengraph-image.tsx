import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Raúl Romero, webs y aplicaciones para negocios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Mismo lenguaje que el hero: titular condensado a todo el ancho sobre crema.
// Satori necesita fuentes estáticas, por eso se usan instancias TTF de
// Instrument Sans guardadas en src/assets/fonts.
export default async function Image() {
  const [logoData, display, text] = await Promise.all([
    readFile(join(process.cwd(), "public/brand/logo-mark.png")),
    readFile(join(process.cwd(), "src/assets/fonts/InstrumentSans-CondensedSemiBold.ttf")),
    readFile(join(process.cwd(), "src/assets/fonts/InstrumentSans-Regular.ttf")),
  ]);
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px 56px",
          background: "#F8F6F1",
          color: "#081B2E",
          fontFamily: "Instrument Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontFamily: "Instrument Sans Condensed",
            fontSize: 112,
            fontWeight: 600,
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Webs y aplicaciones</span>
          <span>que hacen avanzar</span>
          <span>tu negocio.</span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: "2px solid #D9D4C8",
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logoSrc} width={48} height={40} alt="" />
            <span>Raúl Romero</span>
          </div>
          <span style={{ color: "#506079" }}>raulromero.es</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Sans Condensed", data: display, weight: 600, style: "normal" },
        { name: "Instrument Sans", data: text, weight: 400, style: "normal" },
      ],
    }
  );
}
