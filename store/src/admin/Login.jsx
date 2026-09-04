import { useState } from "react";
import { api } from "../api.js";
import { brandSrc } from "../lib/brand.js";

export default function Login({ onAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="desk-gate">
      <div className="desk-gate-still">
        <img src={brandSrc("marahil-cons-box-lid.png")} alt="" />
        <div className="desk-gate-still-copy">
          <p className="kicker">Private desk</p>
          <p>Abu Dhabi · Unlisted</p>
        </div>
      </div>
      <div className="desk-gate-panel">
        <p className="kicker">House of MARAHIL</p>
        <div className="brand-name">MARAHIL</div>
        <div className="brand-ar">مراحل</div>
        <h1>Sign in to the desk</h1>
        <p className="lede desk-gate-lede">
          Catalog, categories, trade samples, and house cost live here. The public site never sees original price.
        </p>
        <form
          className="desk-gate-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setErr("");
            try {
              const { token } = await api.login(username, password);
              onAuth(token);
            } catch (ex) {
              setErr(ex.message || "Invalid login");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label className="desk-field">
            <span>Username</span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </label>
          <label className="desk-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>
          {err && <p className="notice">{err}</p>}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "Signing in…" : "Enter the desk"}
          </button>
        </form>
        <a className="desk-gate-back" href="/">
          ← Public house
        </a>
      </div>
    </div>
  );
}
