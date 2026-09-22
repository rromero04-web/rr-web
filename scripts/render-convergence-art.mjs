import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const destination = new URL("../public/labs/convergence/", import.meta.url);
await mkdir(destination, { recursive: true });

const random = (n, k) => {
  const v = Math.sin(n * k + k * 17.23) * 43758.5453;
  return v - Math.floor(v);
};

function image(height) {
  const warm = Array.from({ length: 680 }, (_, i) => {
    const angle = random(i, 13.17) * Math.PI * 2;
    const radius = Math.sqrt(random(i, 4.37)) * 185;
    const x = 628 + Math.cos(angle) * radius * 1.3;
    const y = 292 + Math.sin(angle) * radius * .85;
    const r = .5 + random(i, 2.87) * 2.1;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="${i % 4 ? "#d39761" : "#fff1cb"}" opacity="${(.17 + random(i, 7.1) * .67).toFixed(2)}"/>`;
  }).join("");
  const frames = Array.from({ length: 8 }, (_, i) => {
    const s = 115 + i * 16;
    return `<rect x="${832 - s}" y="${314 - s * .77}" width="${s * 2}" height="${s * 1.54}" fill="none" stroke="#dfd1f1" stroke-width="${i % 3 === 0 ? 2 : 1}" opacity="${(.2 + i * .045).toFixed(2)}" transform="rotate(${i * 3 - 12} 832 314)"/>`;
  }).join("");
  const network = Array.from({ length: 17 }, (_, i) => {
    const a = i * 2.399, b = (i + 5) * 2.399;
    const r = 68 + i % 4 * 22, rb = 68 + (i + 5) % 4 * 22;
    const x = 1043 + Math.cos(a) * r, y = 302 + Math.sin(a) * r;
    const x2 = 1043 + Math.cos(b) * rb, y2 = 302 + Math.sin(b) * rb;
    return `<path d="M${x.toFixed(1)} ${y.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="#a7dfed" stroke-width="1" opacity=".52"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 4 === 0 ? 5 : 3}" fill="#d7f5f8" opacity=".8"/>`;
  }).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}">
    <defs><radialGradient id="back"><stop stop-color="#273039"/><stop offset=".58" stop-color="#12151e"/><stop offset="1" stop-color="#090b0f"/></radialGradient><radialGradient id="warm"><stop stop-color="#b9804f" stop-opacity=".29"/><stop offset="1" stop-color="#b9804f" stop-opacity="0"/></radialGradient><linearGradient id="fade"><stop stop-color="#080a0e"/><stop offset="1" stop-color="#080a0e" stop-opacity="0"/></linearGradient></defs>
    <rect width="1200" height="${height}" fill="url(#back)"/><ellipse cx="632" cy="300" rx="365" ry="230" fill="url(#warm)"/>
    <g>${warm}</g><g>${frames}</g><g>${network}</g>
    <circle cx="890" cy="313" r="18" fill="#f5f2eb" opacity=".94"/><circle cx="890" cy="313" r="48" fill="none" stroke="#f5f2eb" stroke-width="2" opacity=".64"/><circle cx="890" cy="313" r="91" fill="none" stroke="#f5f2eb" stroke-width="1" opacity=".28"/>
    <rect x="0" y="0" width="650" height="${height}" fill="url(#fade)"/>
    <text x="68" y="70" font-family="monospace" font-size="15" letter-spacing="4" fill="#c7bcb1">RAÚL ROMERO / LAB 001</text>
    <line x1="68" y1="91" x2="1132" y2="91" stroke="#b7b1aa" opacity=".28"/>
    <text x="68" y="${height - 210}" font-family="monospace" font-size="17" letter-spacing="5" fill="#dfb189">ATTENTION × FORM × BEHAVIOR</text>
    <text x="60" y="${height - 104}" font-family="Arial,Helvetica,sans-serif" font-size="91" font-weight="700" letter-spacing="-6" fill="#f7f4ec">CONVERGENCE</text>
    <text x="68" y="${height - 52}" font-family="Arial,Helvetica,sans-serif" font-size="22" fill="#b4b5b4">Three disciplines. One working system.</text>
  </svg>`;
}

await Promise.all([
  sharp(Buffer.from(image(750))).png().toFile(fileURLToPath(new URL("poster.png", destination))),
  sharp(Buffer.from(image(630))).png().toFile(fileURLToPath(new URL("opengraph.png", destination))),
]);
