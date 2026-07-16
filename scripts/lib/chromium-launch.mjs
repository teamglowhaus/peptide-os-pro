// Resolves Chromium launch options that work both in this project's sandbox
// (which pins a specific Chromium revision at /opt/pw-browsers/chromium,
// per the environment's own setup notes — the installed browser can drift
// out of sync with whatever revision the playwright-core npm version
// expects) and on a normal machine (a buyer or contributor running
// `npx playwright install` and expecting Playwright to just find its own
// browser with no special configuration).
//
// Override with PLAYWRIGHT_CHROMIUM_PATH if your setup needs something else.
import { existsSync } from "fs";

export function chromiumLaunchOptions() {
  const override = process.env.PLAYWRIGHT_CHROMIUM_PATH;
  if (override) return { executablePath: override };
  const sandboxPath = "/opt/pw-browsers/chromium";
  if (existsSync(sandboxPath)) return { executablePath: sandboxPath };
  return {}; // let Playwright resolve its own installed browser
}
