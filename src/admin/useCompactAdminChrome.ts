import { useEffect, useState } from "react";

/**
 * True when Admin Mode should use compact/mobile chrome.
 * Checks both the app Mobile view toggle and narrow viewports, because some
 * admin modals portal to document.body outside `.app-shell`.
 */
export function useCompactAdminChrome(): boolean {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    const view = document.querySelector(".app-shell")?.getAttribute("data-view");
    return view === "mobile" || window.matchMedia("(max-width: 720px)").matches;
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 720px)");
    const sync = () => {
      const view = document.querySelector(".app-shell")?.getAttribute("data-view");
      setCompact(view === "mobile" || mq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    const shell = document.querySelector(".app-shell");
    const observer = shell ? new MutationObserver(sync) : null;
    if (shell && observer) {
      observer.observe(shell, { attributes: true, attributeFilter: ["data-view"] });
    }
    return () => {
      mq.removeEventListener("change", sync);
      observer?.disconnect();
    };
  }, []);

  return compact;
}
