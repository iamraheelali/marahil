import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { canCancel, lineLabel, lineName } from "../lib/orders.js";

function AuthForms() {
  const { t, lang, registerClient, signInClient } = useStore();
  const [mode, setMode] = useState("login");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city: "Abu Dhabi",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="section account">
      <div className="kicker">{t.account}</div>
      <h2>{mode === "login" ? t.signIn : t.createAccount}</h2>
      <p className="lede">
        {lang === "ar"
          ? "سجّلوا ملفاً للبيت لرؤية الطلبات. لا يمكن إلغاء طلب دخل في التجهيز."
          : "A house profile keeps your orders. Cancel is only possible before the atelier starts processing."}
      </p>
      <div className="chips" style={{ marginBottom: 20 }}>
        <button type="button" className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>
          {t.signIn}
        </button>
        <button type="button" className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>
          {t.createAccount}
        </button>
      </div>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr("");
          try {
            if (mode === "login") await signInClient(form.email, form.password);
            else await registerClient(form);
          } catch (ex) {
            setErr(ex.message);
          }
        }}
      >
        {mode === "register" && <input required placeholder={t.name} value={form.name} onChange={set("name")} />}
        <input required type="email" placeholder={t.email} value={form.email} onChange={set("email")} autoComplete="email" />
        <input
          required
          type="password"
          placeholder={t.password}
          value={form.password}
          onChange={set("password")}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          minLength={8}
        />
        {mode === "register" && (
          <>
            <input placeholder={t.phone} value={form.phone} onChange={set("phone")} />
            <input placeholder={t.address} value={form.address} onChange={set("address")} />
            <input placeholder={t.city} value={form.city} onChange={set("city")} />
          </>
        )}
        {err && <p className="notice">{err}</p>}
        <button className="btn" type="submit">
          {mode === "login" ? t.signIn : t.createAccount}
        </button>
      </form>
      <p className="muted" style={{ marginTop: 24 }}>
        {t.testHint}
      </p>
    </section>
  );
}

function statusLabel(status, t) {
  return t.orderStatus?.[status] || status;
}

export default function Account() {
  const { t, lang, client, clientOrders, saveProfile, signOutClient, refreshClient } = useStore();
  const [form, setForm] = useState(client || {});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    refreshClient();
  }, []);

  useEffect(() => {
    if (client) setForm(client);
  }, [client]);

  if (!client) return <AuthForms />;

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="section account">
      <div className="account-head">
        <div>
          <div className="kicker">{t.account}</div>
          <h2>{client.name}</h2>
          <p className="muted">{client.email}</p>
        </div>
        <button type="button" className="btn ghost" onClick={signOutClient}>
          {t.signOut}
        </button>
      </div>
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          await saveProfile({ name: form.name, phone: form.phone, address: form.address, city: form.city });
          setMsg(t.profileSaved);
        }}
      >
        <h3>{t.profile}</h3>
        <input required placeholder={t.name} value={form.name || ""} onChange={set("name")} />
        <input placeholder={t.phone} value={form.phone || ""} onChange={set("phone")} />
        <input placeholder={t.address} value={form.address || ""} onChange={set("address")} />
        <input placeholder={t.city} value={form.city || ""} onChange={set("city")} />
        {msg && <p className="notice">{msg}</p>}
        <button className="btn" type="submit">
          {t.saveProfile}
        </button>
      </form>
      <h3 style={{ marginTop: 48 }}>{t.orderHistory}</h3>
      {!clientOrders.length && <p className="muted">{t.noOrders}</p>}
      <div className="account-orders">
        {clientOrders.map((o) => (
          <article key={o.id} className="account-order">
            <div className="account-order-top">
              <Link to={`/order/${o.id}`}>
                <strong>{o.id}</strong>
              </Link>
              <span className={`order-status is-${o.status}`}>{statusLabel(o.status, t)}</span>
            </div>
            <p className="muted">
              {new Date(o.at).toLocaleDateString(lang === "ar" ? "ar-AE" : "en-AE")} · AED {Number(o.total).toFixed(2)}
            </p>
            <ul>
              {(o.lines || []).map((l) => (
                <li key={l.customId || l.productId + l.sizeId}>
                  {lineName(l, lang)} · {lineLabel(l)} × {l.qty}
                </li>
              ))}
            </ul>
            {canCancel(o) ? (
              <Link className="lang" to={`/order/${o.id}`}>
                {t.viewCancel}
              </Link>
            ) : (
              <p className="muted">{o.status === "cancelled" ? t.orderCancelled : t.cannotCancel}</p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
