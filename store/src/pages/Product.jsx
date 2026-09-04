import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { getProfile } from "../data/profiles.js";

function Stars({ value, onPick }) {
  const n = Math.round(value || 0);
  return (
    <span className="stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <button type="button" key={i} className={i <= n ? "on" : ""} onClick={() => onPick?.(i)} aria-label={`${i} stars`}>
          ★
        </button>
      ))}
    </span>
  );
}

export default function Product() {
  const { slug } = useParams();
  const { t, lang, add, getProduct, reviewsFor, avgRating, addReview } = useStore();
  const product = getProduct(slug);
  const [sizeId, setSizeId] = useState(product?.sizes?.[0]?.id);
  const [done, setDone] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, text: "", city: "" });
  const size = useMemo(() => product?.sizes.find((s) => s.id === sizeId), [product, sizeId]);
  const profile = product?.profile || (product ? getProfile(product.id) : null);
  const list = product ? reviewsFor(product.id) : [];
  const avg = product ? avgRating(product.id) : 0;

  const shots = (product?.images || [product?.image]).filter(Boolean);
  const [hero, setHero] = useState(shots[0] || "");

  useEffect(() => {
    setSizeId(product?.sizes?.[0]?.id);
    setDone(false);
    setSent(false);
    setHero((product?.images || [product?.image]).filter(Boolean)[0]);
  }, [slug, product?.id]);

  useEffect(() => {
    const shot = product?.finishImages?.[sizeId];
    if (shot) setHero(shot);
  }, [sizeId, product]);

  if (!product) {
    return (
      <section className="section">
        <p>Not found.</p>
        <Link to="/">{t.continue}</Link>
      </section>
    );
  }

  const txt = (field) => (field && (field[lang] || field.en)) || "";

  return (
    <article className="pdp-wrap">
      <div className="pdp">
        <div>
          <div className="pdp-gallery">
            <img className="hero-shot" src={hero || shots[0]} alt={product.name[lang]} />
            {shots.length > 1 && (
              <div className="pdp-thumbs">
                {shots.map((src) => (
                  <button type="button" key={src} onClick={() => setHero(src)}>
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="kicker">{product.arabic}</div>
          <h2>{product.name[lang]}</h2>
          <p className="house-tag">MARAHIL · مراحل</p>
          <p className="muted">{product.family[lang]}</p>
          {list.length > 0 && (
            <p className="stars-line">
              <Stars value={avg} /> {avg.toFixed(1)} · {list.length} {t.reviews}
            </p>
          )}
          <p>{product.blurb[lang]}</p>
          <div className="sizes">
            {product.sizes.map((s) => (
              <button key={s.id} className={s.id === sizeId ? "on" : ""} type="button" onClick={() => setSizeId(s.id)}>
                {s.label} · AED {s.price.toLocaleString()} {t.exclVat}
              </button>
            ))}
          </div>
          <button
            className="btn"
            type="button"
            onClick={() => {
              add(product.id, size.id);
              setDone(true);
            }}
          >
            {done ? t.added : t.add} · AED {size.price.toLocaleString()} {t.exclVat}
          </button>
          <dl className="pyramid">
            <dt>{t.notes}</dt>
            <dd>Top: {product.notes?.top || "—"}</dd>
            <dd>Heart: {product.notes?.heart || "—"}</dd>
            <dd>Base: {product.notes?.base || "—"}</dd>
            <dt>{t.wear}</dt>
            <dd>{product.wear?.[lang] || product.wear?.en || "—"}</dd>
          </dl>
        </div>
      </div>
      {profile && (
        <section className="section profile-block">
          <h3>{lang === "ar" ? "ملف المنتج" : "Product profile"}</h3>
          <dl className="profile-grid">
            <div><dt>{t.origin}</dt><dd>{txt(profile.origin)}</dd></div>
            <div><dt>{t.contents}</dt><dd>{txt(profile.contents)}</dd></div>
            <div><dt>{t.materials}</dt><dd>{txt(profile.materials)}</dd></div>
            <div><dt>{t.packaging}</dt><dd>{txt(profile.packaging)}</dd></div>
            <div><dt>{lang === "ar" ? "المحتوى العطري" : "Juice / fill"}</dt><dd>{txt(profile.juice)}</dd></div>
            <div><dt>{t.howTo}</dt><dd>{txt(profile.skin)}</dd></div>
          </dl>
        </section>
      )}
      <section className="section">
        <h3>{t.reviews}</h3>
        {list.length === 0 && <p className="muted">{lang === "ar" ? "لا تقييمات معتمدة بعد." : "No approved reviews yet."}</p>}
        {list.map((r) => (
          <blockquote key={r.id} className="review">
            <Stars value={r.rating} />
            <p>{r.text[lang] || r.text.en}</p>
            <footer>
              {r.name}
              {r.city ? ` · ${r.city}` : ""} · {r.at}
            </footer>
          </blockquote>
        ))}
        <h3>{t.writeReview}</h3>
        <p className="muted">
          {lang === "ar"
            ? "يظهر التقييم للعامة بعد موافقة الإدارة."
            : "Reviews appear on the site after admin approval."}
        </p>
        {sent ? (
          <p className="notice">{lang === "ar" ? "استلمنا تقييمكم وهو بانتظار الموافقة." : "Received. Pending admin approval."}</p>
        ) : (
          <form
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();
              await addReview(product.id, form);
              setSent(true);
            }}
          >
            <input required placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder={t.city} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <label>
              {t.reviews} <Stars value={form.rating} onPick={(n) => setForm({ ...form, rating: n })} />
            </label>
            <textarea required rows={4} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
            <button className="btn" type="submit">{t.submitReview}</button>
          </form>
        )}
      </section>
    </article>
  );
}
