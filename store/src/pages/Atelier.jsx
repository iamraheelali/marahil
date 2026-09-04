import { useState } from "react";
import { Link } from "react-router-dom";
import CatalogHead from "../components/CatalogHead.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";

const FEATURED = ["earrings", "necklace", "rings"];

function FinishCard({ product, lang }) {
  const { t, add } = useStore();
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id);
  const [done, setDone] = useState(false);
  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
  const shot = product.finishImages?.[sizeId] || product.image;
  return (
    <article className="atelier-card">
      <Link to={`/product/${product.id}`} className="atelier-card-media">
        <img src={shot} alt={product.name[lang]} />
      </Link>
      <div className="meta">{lang === "ar" ? "مجوهرات" : "Jewellery"}</div>
      <Link to={`/product/${product.id}`}>
        <h3>{product.name[lang]}</h3>
      </Link>
      <p className="card-size">{size.label}</p>
      <div className="chips">
        {product.sizes.map((s) => (
          <button key={s.id} type="button" className={s.id === sizeId ? "on" : ""} onClick={() => { setSizeId(s.id); setDone(false); }}>
            {s.id === "gold" ? (lang === "ar" ? "ذهبي" : "Gold") : lang === "ar" ? "فضي" : "Silver"}
          </button>
        ))}
      </div>
      <div className="price">
        AED {size.price.toLocaleString()}
        <span className="excl">{t.exclVat}</span>
      </div>
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          add(product.id, size.id);
          setDone(true);
        }}
      >
        {done ? t.added : t.add}
      </button>
    </article>
  );
}

export default function Atelier() {
  const { lang, byCollection, avgRating, t } = useStore();
  const all = byCollection("atelier");
  const featured = FEATURED.map((id) => all.find((p) => p.id === id)).filter(Boolean);
  const gift = all.find((p) => p.id === "atelier-gift");
  const rest = all.filter((p) => !FEATURED.includes(p.id) && p.id !== "atelier-gift");

  return (
    <section className="section catalog-page atelier">
      <CatalogHead
        kicker={lang === "ar" ? "المرسم" : "Atelier"}
        title={lang === "ar" ? "المجوهرات" : "Jewellery"}
        lede={
          lang === "ar"
            ? "أقراط، عقد، خواتم — تشطيب فضي أو ذهبي. صُمِّم في أبوظبي."
            : "Earrings, Necklace, Rings — silver finish or gold finish. Designed in Abu Dhabi."
        }
        countLabel={lang === "ar" ? `${all.length} قطع` : `${all.length} pieces`}
      />
      <div className="atelier-layout">
        <div className="atelier-cards">
          {featured.map((p) => (
            <FinishCard key={p.id} product={p} lang={lang} />
          ))}
        </div>
        <div className="atelier-hero">
          <img src={brandSrc("marahil-atelier-gift.png")} alt={gift?.name[lang] || "Atelier gift"} />
          <p className="meta">
            {lang === "ar" ? "أقراط · عقد · طقم خواتم — مع إشراق" : "Earrings · Necklace · Rings set — with Ishraq"}
          </p>
          {gift && (
            <div className="atelier-hero-cta">
              <h3>{gift.name[lang]}</h3>
              <p className="muted">{gift.blurb[lang]}</p>
              <p className="price">
                {lang === "ar" ? "من" : "From"} AED {Math.min(...gift.sizes.map((s) => s.price)).toLocaleString()}
                <span className="excl">{t.exclVat}</span>
              </p>
              <Link className="btn" to={`/product/${gift.id}`}>
                {t.add}
              </Link>
            </div>
          )}
        </div>
      </div>
      {rest.length > 0 && (
        <>
          <h3 className="atelier-more">{lang === "ar" ? "بقية المرسم" : "The rest of the atelier"}</h3>
          <div className="grid collection-grid">
            {rest.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
