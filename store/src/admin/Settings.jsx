import { useEffect, useState } from "react";
import { api } from "../api.js";

export default function Settings({ token }) {
  const [megaNav, setMegaNav] = useState(false);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.adminSettings(token).then((row) => setMegaNav(Boolean(row.megaNav))).catch(() => {});
  }, [token]);

  const save = async (next) => {
    setBusy(true);
    setSaved(false);
    try {
      const row = await api.saveSettings(token, { megaNav: next });
      setMegaNav(Boolean(row.megaNav));
      setSaved(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2>Site</h2>
      <p className="muted">Public chrome. The storefront reads this on load. Mega menus stay off until you turn them on.</p>
      <label className="desk-check">
        <input
          type="checkbox"
          checked={megaNav}
          disabled={busy}
          onChange={(e) => save(e.target.checked)}
        />
        <span>Enable mega menus on the main navigation</span>
      </label>
      <p className="muted">
        Default bar: Shop, Stages, Beauty, Atelier, House — each a single link. Discovery, Woods, Home scent and Custom stay in the footer and on collection pages.
      </p>
      {saved && <p className="muted">Saved. Refresh the public site to see the change.</p>}
    </div>
  );
}
