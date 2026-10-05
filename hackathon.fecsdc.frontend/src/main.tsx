import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ─── Tab Visibility: pause CSS keyframe animations when tab is hidden ──────────
// CSS selector `html[data-tab-hidden="true"]` targets animate-marquee / hero-float.
function syncTabHidden() {
  document.documentElement.dataset.tabHidden = document.hidden ? "true" : "false";
}
syncTabHidden();
document.addEventListener("visibilitychange", syncTabHidden);

// ─── Backend warm-up: fire a silent GET on idle to avoid Render.com cold start ─
// Uses requestIdleCallback (3s budget) so it never blocks first paint.
if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL;
    if (apiBase) {
      fetch(`${apiBase}/health`, { method: "GET", mode: "no-cors" }).catch(() => {});
    }
  }, { timeout: 3000 });
}

createRoot(document.getElementById('root')!).render(
  <App />
)
