import { useState } from "react";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";

export default function Cards() {
  const { t, lang, houseCard, issueHouseCard, giftCodes, byCollection } = useStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const gifts = byCollection("cards");

  return (
    <section className="section">
      <h2>{t.houseCard}</h2>
      <p className="lede">
        {lang === "ar"
          ? "بطاقة البيت رقم إم آر كيه. تُحفظ على هذا الجهاز حتى نربط الحساب لاحقاً."
          : "A pewter House Card numbered MRK. Stored on this device until accounts go live."}
      </p>
      <img className="house-card-visual" src={brandSrc("marahil-house-card.png")} alt="House Card" />
      {houseCard ? (
        <div>
          <h3>{t.issued}</h3>
          <p>
            {houseCard.name}
            <br />
            {houseCard.number}
            <br />
            {houseCard.email}
          </p>
        </div>
      ) : (
        <form
          className="form"
          onSubmit={(e) => {
            e.preventDefault();
            issueHouseCard(name, email);
          }}
        >
          <input required placeholder={t.name} value={name} onChange={(e) => setName(e.target.value)} />
          <input required type="email" placeholder={t.email} value={email} onChange={(e) => setEmail(e.target.value)} />
          <button className="btn" type="submit">{t.issue}</button>
        </form>
      )}
      <h2 style={{ marginTop: 48 }}>{t.giftShop}</h2>
      <div className="grid">
        {gifts.map((p) => (
          <ProductCard key={p.id} product={p} lang={lang} />
        ))}
      </div>
      {giftCodes.length > 0 && (
        <p className="muted" style={{ marginTop: 24 }}>
          {lang === "ar" ? "رموزكم:" : "Your codes:"} {giftCodes.map((g) => `${g.code} (AED ${g.remaining})`).join(" · ")}
        </p>
      )}
    </section>
  );
}
