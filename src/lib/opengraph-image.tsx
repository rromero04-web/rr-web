import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Raúl Romero — Webs y aplicaciones para negocios";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/brand/logo-mark.png")
  );
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#F8F6F1",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={95} height={80} alt="" />
        <div
          style={{
            marginTop: 48,
            fontSize: 56,
            fontWeight: 800,
            color: "#081B2E",
            maxWidth: 900,
            lineHeight: 1.15,
            display: "flex",
          }}
        >
          Webs y aplicaciones que hacen avanzar tu negocio.
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#5B6B82",
            display: "flex",
          }}
        >
          Raúl Romero — Web & Growth
        </div>
      </div>
    ),
    { ...size }
  );
}
