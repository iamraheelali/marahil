import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function Cart() {
  const { t, lang, lines, remove, subtotal, vat, total, giftCredit } = useStore();
  if (!lines.length) {
    return (
      <section className="section">
        <h2>{t.bag}</h2>
        <p>{t.empty}</p>
        <Link className="btn" to="/the-marahil">{t.continue}</Link>
      </section>
    );
  }
  return (
    <section className="section split">
      <div>
        <h2>{t.bag}</h2>
        {lines.map((l) => (
          <div key={l.customId || l.productId + l.sizeId} className="line" style={{ borderBottom: "1px solid rgba(26,22,20,.1)", padding: "14px 0" }}>
            <div>
              <strong>{l.custom?.name ? `${l.product.name[lang]} — ${l.custom.name}` : l.product.name[lang]}</strong>
              <div className="muted">{l.size.label} × {l.qty}</div>
              {l.custom && (
                <div className="muted">
                  {l.custom.path === "inspired" ? (lang === "ar" ? "مستوحى" : "Inspired brief") : (lang === "ar" ? "أصلي" : "Original brief")}
                  {l.custom.family ? ` · ${l.custom.family}` : ""}
                  {l.custom.reference ? ` · ${l.custom.reference.slice(0, 80)}` : ""}
                </div>
              )}
              <button type="button" className="lang" onClick={() => remove(l.productId, l.sizeId, l.customId)}>Remove</button>
            </div>
            <div>
              AED {l.line.toLocaleString()}
              {!(l.product?.vatExempt || l.product?.giftValue) && <span className="excl"> {t.exclVat}</span>}
            </div>
          </div>
        ))}
      </div>
      <div className="totals">
        <div className="line"><span>{t.subtotal}</span><span>AED {subtotal.toLocaleString()}</span></div>
        {giftCredit > 0 && <div className="line"><span>{t.gift}</span><span>− AED {giftCredit.toLocaleString()}</span></div>}
        <div className="line"><span>{t.vat}</span><span>AED {vat.toFixed(2)}</span></div>
        <div className="line"><strong>{t.total}</strong><strong>AED {total.toFixed(2)}</strong></div>
        <p className="muted">{t.vatNote}</p>
        <Link className="btn" to="/checkout" style={{ marginTop: 16, display: "inline-block" }}>{t.checkout}</Link>
      </div>
    </section>
  );
}
