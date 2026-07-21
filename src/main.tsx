import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { StoreProvider } from "./lib/store";
import { AccessGate } from "./components/AccessGate";
import "./lib/installPrompt";
// Self-hosted fonts, bundled by Vite — no Google Fonts at runtime, so the
// PWA renders its real typography offline and on every network.
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/figtree/wght.css";
import "@fontsource-variable/figtree/wght-italic.css";
import "@fontsource/caveat/500.css";
import "@fontsource/caveat/600.css";
import "./styles/theme.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AccessGate>
      <StoreProvider>
        <App />
      </StoreProvider>
    </AccessGate>
  </React.StrictMode>
);

// Offline-first PWA registration (production only)
if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
