import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function Checkout() {
  const { t, lines, subtotal, vat, total, giftCredit, applyGift, appliedGift, placeOrder, payments, client } = useStore();
  const nav = useNavigate();
  const [giftInput, setGiftInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setField] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "Abu Dhabi",
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const set = (k) => (e) => setField((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    if (!client) return;
    setField((f) => ({
      ...f,
      name: client.name || f.name,
      email: client.email || f.email,
      phone: client.phone || f.phone,
      address: client.address || f.address,
      city: client.city || f.city,
    }));
  }, [client]);

  if (!lines.length) {
    return (
      <section className="section">
        <p>{t.empty}</p>
        <Link to="/">{t.continue}</Link>
      </section>
    );
  }

  return (
    <section className="section split">
      <form
        className="form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            const order = await placeOrder(form);
            nav(`/order/${order.id}`);
          } finally {
            setBusy(false);
          }
        }}
      >
        <h2>{t.checkout}</h2>
        <div className="notice">{t.payBanner}</div>
        {client ? (
          <p className="muted">
            {t.checkoutAs} {client.name} · <Link to="/account">{t.account}</Link>
          </p>
        ) : (
          <p className="muted">
            <Link to="/account">{t.createAccount}</Link> {t.checkoutSave}
          </p>
        )}
        <input required placeholder={t.name} value={form.name} onChange={set("name")} />
        <input required type="email" placeholder={t.email} value={form.email} onChange={set("email")} />
        <input required placeholder={t.phone} value={form.phone} onChange={set("phone")} />
        <input required placeholder={t.address} value={form.address} onChange={set("address")} />
        <input required placeholder={t.city} value={form.city} onChange={set("city")} />
        <h3>{t.cardPay}</h3>
        <p className="muted">Gateway: {payments.provider}. enabled = {String(payments.enabled)}</p>
        <input placeholder={t.cardName} value={form.cardName} onChange={set("cardName")} autoComplete="off" />
        <input placeholder={t.cardNumber} value={form.cardNumber} onChange={set("cardNumber")} autoComplete="off" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <input placeholder={t.expiry} value={form.expiry} onChange={set("expiry")} autoComplete="off" />
          <input placeholder={t.cvc} value={form.cvc} onChange={set("cvc")} autoComplete="off" />
        </div>
        <h3>{t.gift}</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={giftInput} onChange={(e) => setGiftInput(e.target.value)} placeholder="MARAHIL-XXXX" />
          <button type="button" className="btn ghost" onClick={() => applyGift(giftInput)}>{t.apply}</button>
        </div>
        {appliedGift && <p className="muted">{appliedGift.code} · AED {appliedGift.remaining} left</p>}
        <button className="btn" type="submit" disabled={busy}>
          {busy ? "…" : t.place}
        </button>
      </form>
      <div className="totals">
        <div className="line"><span>{t.subtotal}</span><span>AED {subtotal.toLocaleString()}</span></div>
        {giftCredit > 0 && <div className="line"><span>{t.gift}</span><span>− AED {giftCredit.toLocaleString()}</span></div>}
        <div className="line"><span>{t.vat}</span><span>AED {vat.toFixed(2)}</span></div>
        <div className="line"><strong>{t.total}</strong><strong>AED {total.toFixed(2)}</strong></div>
        <p className="muted">{t.vatNote}</p>
        <p className="muted">{t.shipping}</p>
      </div>
    </section>
  );
}
