import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import ShopCard from "../components/ShopCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { HAUTE_SEQUENCE, STAGES_PAGE } from "../data/stages.js";
import { brandSrc } from "../lib/brand.js";

export default function Stages() {
  const { lang, catalog, avgRating, t } = useStore();
  const byId = (id) => catalog.find((p) => p.id === id);
  const chapters = STAGES_PAGE.map(byId).filter(Boolean);
  const haute = HAUTE_SEQUENCE.map(byId).filter(Boolean);

  return (
    <section className="section collection">
      <div className="collection-head">
        <h2>{lang === "ar" ? "المراحل" : "Stages"}</h2>
        <p className="lede">
          {lang === "ar"
            ? "بدء، إشراق، وصل، ليل، أثر، وماريا — خمس مراحل وتوقيع المؤسسة. الاكتشاف بجانبها."
            : "Bad’, Ishraq, Wasl, Layl, Athar, and Maria — five stages and the founder signature. Discovery sits beside them."}
        </p>
        <p className="muted">
          {lang === "ar" ? `${chapters.length} منتجات` : `${chapters.length} pieces`}
          {lang === "ar" ? " · مرّروا لرؤية العلبة" : " · Hover to see the house box"}
        </p>
      </div>
      <div className="grid collection-grid">
        {chapters.map((p) => (
          <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
        ))}
      </div>

      {haute.length > 0 && (
        <div className="stages-haute">
          <div className="atelier-head">
            <p className="kicker">{lang === "ar" ? "صُنع في فرنسا" : "Made in France"}</p>
            <h3 className="atelier-more">{lang === "ar" ? "بارفان — نفس الفصول، أغلظ" : "Parfum — the same chapters, denser"}</h3>
            <p className="lede">
              {lang === "ar"
                ? "إشراق ووصل كبارفان. ماريا تبقى في المراحل كتوقيع المؤسسة. الأغطية بيوتر. العلب عاجية."
                : "Ishraq and Wasl as Parfum. Maria stays in the stages as the founder signature. Pewter caps. Ivory boxes."}
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
            Eau de Parfum is assembled in the UAE. Parfum and Extrait are Made in France.{" "}
            <Link to="/woods">{t.woodsCta}</Link>
          </>
        )}
      </p>
    </section>
  );
}
