import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const goTop = () => window.scrollTo({ top: 0, left: 0, behavior: reduce ? "auto" : "auto" });

    if (hash) {
      const id = decodeURIComponent(hash.replace(/^#/, ""));
      requestAnimationFrame(() => {
        const el = id ? document.getElementById(id) : null;
        if (el) {
          el.scrollIntoView({ block: "start", behavior: reduce ? "auto" : "smooth" });
          return;
        }
        goTop();
      });
      return;
    }

    goTop();
    const main = document.getElementById("house-main");
    if (main) main.focus({ preventScroll: true });
  }, [pathname, search, hash]);

  return null;
}
