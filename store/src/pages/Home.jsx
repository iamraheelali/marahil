import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { STAGES_PAGE } from "../data/stages.js";
import { brandSrc } from "../lib/brand.js";

export default function Home() {
  const { t, lang, catalog, testimonials, avgRating } = useStore();
  const featured = STAGES_PAGE.map((id) => catalog.find((p) => p.id === id)).filter(Boolean);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">{t.heroKicker}</div>
          <h1>{t.heroTitle}</h1>
          <p className="lede">{t.heroBody}</p>
          <div className="btn-row">
            <Link className="btn" to="/the-marahil">{t.enter}</Link>
            <Link className="btn ghost" to="/woods">{t.woodsCta}</Link>
            <Link className="btn ghost" to="/custom">{t.customCta}</Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={brandSrc("marahil-prod-bad.png")} alt="MARAHIL Bad’" />
        </div>
      </section>
      <section className="section">
        <h2>{lang === "ar" ? "من البيت" : "From the house"}</h2>
        <p className="lede">
          {lang === "ar"
            ? "زجاجة واحدة. ختم إم آر كيه على الغطاء والعلبة. اسم العصير يتغيّر فقط."
            : "One bottle. The MRK seal on cap and box. Only the juice name changes."}
        </p>
        <div className="grid collection-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
          ))}
        </div>
      </section>
      <section className="section">
        <h2>{t.testimonials}</h2>
        <div className="grid quotes">
          {testimonials.map((r) => (
            <blockquote key={r.id} className="quote">
              <p>“{r.text[lang] || r.text.en}”</p>
              <footer>
                {r.name}
                {r.city ? ` · ${r.city}` : ""} · ★{r.rating}
              </footer>
            </blockquote>
          ))}
        </div>
        {!testimonials.length && (
          <p className="muted">{lang === "ar" ? "الشهادات تظهر بعد موافقة الإدارة." : "Testimonials appear once the admin approves them."}</p>
        )}
      </section>
    </>
  );
}
