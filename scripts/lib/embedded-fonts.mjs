// Base64-embedded @font-face CSS for every asset-generation script.
//
// Why: these scripts run headless in environments where Google Fonts may be
// unreachable or flaky. When the stylesheet fails, Chromium silently falls
// back to DejaVu/Liberation — and that fallback SHIPPED once, in a delivery
// PDF whose "Fraunces" headers were actually Liberation Serif. Embedding the
// fonts from the pinned npm packages makes every render deterministic.
//
// Families registered (matching the Google Fonts names the templates use):
//   'Fraunces'       — variable, wght 100-900 + italic (opsz included)
//   'Figtree'        — variable, wght 300-900 + italic
//   'Caveat'         — 500, 600
//   'JetBrains Mono' — 400, 700
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

function pkgFile(pkg, file) {
  const root = dirname(require.resolve(`${pkg}/package.json`));
  return readFileSync(join(root, "files", file)).toString("base64");
}

function face({ family, style = "normal", weight, data }) {
  return `@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  src: url(data:font/woff2;base64,${data}) format('woff2');
}`;
}

export const EMBEDDED_FONT_CSS = [
  face({ family: "Fraunces", weight: "100 900", data: pkgFile("@fontsource-variable/fraunces", "fraunces-latin-full-normal.woff2") }),
  face({ family: "Fraunces", style: "italic", weight: "100 900", data: pkgFile("@fontsource-variable/fraunces", "fraunces-latin-full-italic.woff2") }),
  face({ family: "Figtree", weight: "300 900", data: pkgFile("@fontsource-variable/figtree", "figtree-latin-wght-normal.woff2") }),
  face({ family: "Figtree", style: "italic", weight: "300 900", data: pkgFile("@fontsource-variable/figtree", "figtree-latin-wght-italic.woff2") }),
  face({ family: "Caveat", weight: "500", data: pkgFile("@fontsource/caveat", "caveat-latin-500-normal.woff2") }),
  face({ family: "Caveat", weight: "600", data: pkgFile("@fontsource/caveat", "caveat-latin-600-normal.woff2") }),
  face({ family: "JetBrains Mono", weight: "400", data: pkgFile("@fontsource/jetbrains-mono", "jetbrains-mono-latin-400-normal.woff2") }),
  face({ family: "JetBrains Mono", weight: "700", data: pkgFile("@fontsource/jetbrains-mono", "jetbrains-mono-latin-700-normal.woff2") }),
].join("\n");
