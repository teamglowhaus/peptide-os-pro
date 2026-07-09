import { useEffect, useState } from "react";

/* Captures the browser's real "Add to Home Screen" prompt so Settings can
   offer a genuine one-tap Install button instead of only manual steps.
   Only Chrome/Edge (Android + desktop) fire this event — Safari (iOS) and
   Firefox never do, so those platforms always fall back to the manual
   per-browser instructions already shown alongside this button. Registered
   as a module-level listener (imported once in main.tsx) so the event is
   caught no matter which page the app happens to load on first. */

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const AVAILABILITY_EVENT = "biohacker:install-availability-changed";

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e as BeforeInstallPromptEvent;
  window.dispatchEvent(new Event(AVAILABILITY_EVENT));
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
  window.dispatchEvent(new Event(AVAILABILITY_EVENT));
});

export function useInstallAvailable(): boolean {
  const [available, setAvailable] = useState(deferredPrompt !== null);
  useEffect(() => {
    const onChange = () => setAvailable(deferredPrompt !== null);
    window.addEventListener(AVAILABILITY_EVENT, onChange);
    return () => window.removeEventListener(AVAILABILITY_EVENT, onChange);
  }, []);
  return available;
}

/** Triggers the real browser install dialog. Returns null if no prompt is
 * currently available (already installed, or this browser never offers one). */
export async function promptInstall(): Promise<"accepted" | "dismissed" | null> {
  if (!deferredPrompt) return null;
  await deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  window.dispatchEvent(new Event(AVAILABILITY_EVENT));
  return outcome;
}
