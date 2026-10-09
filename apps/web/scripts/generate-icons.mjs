// Renders the PWA/home-screen PNG icons from the app's SVG mark with the local Chromium.
// Run: node scripts/generate-icons.mjs  (outputs are committed; re-run only when the mark changes)
import { chromium } from "@playwright/test";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ?? "/opt/pw-browsers/chromium";
const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url), "utf8");
// Mark without the rounded background, for the maskable (full-bleed) variant.
const mark = svg.replace(/<rect[^>]*\/>/, "");

const targets = [
  { file: "public/icons/icon-192.png", size: 192, html: (s) => `<div style="width:${s}px;height:${s}px">${svg}</div>`, transparent: true },
  { file: "public/icons/icon-512.png", size: 512, html: (s) => `<div style="width:${s}px;height:${s}px">${svg}</div>`, transparent: true },
  // Maskable: solid background to the edges, mark inside the 80% safe zone.
  {
    file: "public/icons/icon-maskable-512.png",
    size: 512,
    html: (s) => `<div style="width:${s}px;height:${s}px;background:#101827;display:flex;align-items:center;justify-content:center"><div style="width:${s * 0.62}px;height:${s * 0.62}px">${mark}</div></div>`,
  },
  // iOS home screen (no transparency; iOS rounds the corners itself).
  {
    file: "src/app/apple-icon.png",
    size: 180,
    html: (s) => `<div style="width:${s}px;height:${s}px;background:#101827;display:flex;align-items:center;justify-content:center"><div style="width:${s * 0.8}px;height:${s * 0.8}px">${mark}</div></div>`,
  },
];

const browser = await chromium.launch(existsSync(executablePath) ? { executablePath } : {});
for (const t of targets) {
  const page = await browser.newPage({ viewport: { width: t.size, height: t.size } });
  await page.setContent(`<!doctype html><style>html,body{margin:0;background:transparent}svg{width:100%;height:100%;display:block}</style>${t.html(t.size)}`);
  await page.screenshot({ path: new URL(`../${t.file}`, import.meta.url).pathname, omitBackground: Boolean(t.transparent) });
  await page.close();
}
await browser.close();
console.warn(`Generated ${targets.length} icons`);
