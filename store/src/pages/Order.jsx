import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { canCancel, lineLabel, lineName } from "../lib/orders.js";

export default function Order() {
  const { id } = useParams();
  const { getOrder, t, lang, client, cancelOrder, refreshClient } = useStore();
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const order = getOrder(id);
  if (!order) {
    return (
      <section className="section">
        <p>{t.noOrder}</p>
        <p className="muted">{t.signInForOrder}</p>
        <Link to="/account">{t.account}</Link>
        {" · "}
        <Link to="/">{t.continue}</Link>
      </section>
    );
  }
  const mine = client && order.clientId === client.id;
  const showCancel = mine && canCancel(order);

  return (
    <section className="section">
      <p className="kicker">{t.orderHistory}</p>
      <h2>{order.status === "received" ? t.placed : t.orderStatus[order.status] || t.placed}</h2>
      <p className="muted">
        {order.id} · <span className={`order-status is-${order.status}`}>{t.orderStatus[order.status] || order.status}</span>
      </p>
      <p>
        {order.customer.name} · {order.customer.email}
        <br />
        {order.customer.address}, {order.customer.city}
      </p>
      <ul>
        {order.lines.map((l) => (
          <li key={l.customId || l.productId + l.sizeId}>
            {lineName(l, lang)} — {lineLabel(l)} × {l.qty}
            {l.custom?.name ? ` (${l.custom.name})` : ""}
            {l.custom?.reference ? ` — ${l.custom.reference.slice(0, 60)}` : ""}
          </li>
        ))}
      </ul>
      <p>
        <strong>AED {Number(order.total).toFixed(2)}</strong> — {t.total}
      </p>
      <p className="muted">
        {t.subtotal}: AED {Number(order.subtotal).toLocaleString()}
        {order.giftCredit ? ` · ${t.gift} − AED ${Number(order.giftCredit).toLocaleString()}` : ""} · {t.vat}: AED{" "}
        {Number(order.vat).toFixed(2)}
      </p>
      <p className="muted">{t.payBanner}</p>
      {order.issuedGifts?.length > 0 && (
        <div className="notice">Gift codes: {order.issuedGifts.map((g) => g.code).join(", ")}</div>
      )}
      {showCancel && (
        <p>
          <button
            type="button"
            className="btn ghost"
            disabled={busy}
            onClick={async () => {
              if (!window.confirm(t.confirmCancel)) return;
              setBusy(true);
              setErr("");
              try {
                await cancelOrder(order.id);
                refreshClient();
              } catch (ex) {
                setErr(ex.message);
              } finally {
                setBusy(false);
              }
            }}
          >
            {t.cancelOrder}
          </button>
        </p>
      )}
      {mine && !canCancel(order) && order.status !== "cancelled" && (
        <p className="muted">{t.cannotCancel}</p>
      )}
      {err && <p className="notice">{err}</p>}
      <div className="btn-row">
        {client && (
          <Link className="btn ghost" to="/account">
            {t.account}
          </Link>
        )}
        <Link className="btn" to="/">
          {t.continue}
        </Link>
      </div>
    </section>
  );
}
