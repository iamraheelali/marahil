import { Link } from "react-router-dom";
import CatalogHead from "../components/CatalogHead.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ShopCard from "../components/ShopCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { fromPrice, hasPriceRange } from "../data/catalog.js";
import { HAUTE_SEQUENCE, STAGES_PAGE } from "../data/stages.js";
import { brandSrc } from "../lib/brand.js";

export default function Stages() {
  const { lang, catalog, avgRating, t } = useStore();
  const byId = (id) => catalog.find((p) => p.id === id);
  const chapters = STAGES_PAGE.map(byId).filter(Boolean);
  const haute = HAUTE_SEQUENCE.map(byId).filter(Boolean);
  const stages = chapters.filter((p) => p.collection === "marahil");
  const discovery = chapters.filter((p) => p.collection === "discovery");

  return (
    <section className="section catalog-page">
      <CatalogHead
        kicker={lang === "ar" ? "المراحل" : "Stages"}
        title={lang === "ar" ? "ستة فصول. زجاجة واحدة." : "Six stages. One bottle."}
        lede={
          lang === "ar"
            ? "بدء، إشراق، وصل، ليل، أثر، وماريا. الاكتشاف بجانبها. تجمعون فصولاً، لا شكلاً جديداً كل عام."
            : "Bad’, Ishraq, Wasl, Layl, Athar, and Maria. Discovery sits beside them. You collect chapters, not a new shape each year."
        }
        countLabel={lang === "ar" ? `${stages.length} مراحل` : `${stages.length} stages`}
      />

      <ol className="catalog-line">
        {stages.map((p, i) => {
          const range = hasPriceRange(p);
          const low = fromPrice(p);
          return (
            <li key={p.id}>
              <Link className="catalog-line-row" to={`/product/${p.id}`}>
                <span className="catalog-line-n">{String(i + 1).padStart(2, "0")}</span>
                <img src={p.image} alt="" />
                <span className="catalog-line-names">
                  <span className="catalog-line-ar" lang="ar">
                    {p.arabic}
                  </span>
                  <span className="catalog-line-en">{p.name[lang]}</span>
                </span>
                <span className="catalog-line-family">{p.family?.[lang]}</span>
                <span className="catalog-line-price">
                  {range ? (lang === "ar" ? "من " : "From ") : null}
                  AED {low.toLocaleString()}
                  {avgRating(p.id) > 0 ? ` · ★ ${avgRating(p.id).toFixed(1)}` : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>

      {discovery.length > 0 && (
        <div className="catalog-band">
          <div>
            <p className="kicker">{lang === "ar" ? "الاكتشاف" : "Discovery"}</p>
            <h2>{lang === "ar" ? "المراحل الأولى" : "The First Stages"}</h2>
            <p className="lede">
              {lang === "ar" ? "٢ مل من الفصول. ابدؤوا من هنا." : "2ml of the chapters. Start here."}
            </p>
          </div>
          <div className="grid collection-grid catalog-band-grid">
            {discovery.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
            ))}
          </div>
        </div>
      )}

      {haute.length > 0 && (
        <div className="stages-haute">
          <div className="atelier-head">
            <p className="kicker">{lang === "ar" ? "صُنع في فرنسا" : "Made in France"}</p>
            <h2 className="atelier-more">{lang === "ar" ? "بارفان — نفس الفصول، أغلظ" : "Parfum — the same chapters, denser"}</h2>
            <p className="lede">
              {lang === "ar"
                ? "إشراق ووصل كبارفان. ماريا تبقى في المراحل كتوقيع المؤسسة."
                : "Ishraq and Wasl as Parfum. Maria remains a stage."}
            </p>
          </div>
          <div className="atelier-layout hero-first">
            <div className="atelier-hero">
              <img src={brandSrc("marahil-haute-lineup.png")} alt={lang === "ar" ? "إشراق ووصل بارفان" : "Ishraq and Wasl Parfum"} />
              <p className="meta">{lang === "ar" ? "إشراق · وصل" : "Ishraq · Wasl"}</p>
            </div>
            <div className="atelier-cards">
              {haute.map((p) => (
                <ShopCard key={p.id} product={p} lang={lang} kicker={lang === "ar" ? "بارفان" : "Parfum"} />
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="muted stages-note">
        {lang === "ar" ? (
          <>
            أو دو بارفان يُجمَّع في الإمارات. البارفان والإكستريه من فرنسا.{" "}
            <Link to="/woods">{t.woodsCta}</Link>
          </>
        ) : (
          <>
            Eau de Parfum is assembled in the UAE. Parfum and Extrait are made in France.{" "}
            <Link to="/woods">{t.woodsCta}</Link>
          </>
        )}
      </p>
    </section>
  );
}
