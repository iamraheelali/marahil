import CatalogHead from "../components/CatalogHead.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ShopCard from "../components/ShopCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { BEAUTY_FEATURED } from "../data/stages.js";
import { brandSrc } from "../lib/brand.js";

export default function Beauty() {
  const { lang, catalog, byCollection, avgRating } = useStore();
  const featured = BEAUTY_FEATURED.map((id) => catalog.find((p) => p.id === id)).filter(Boolean);
  const rest = byCollection("rituals").filter((p) => !BEAUTY_FEATURED.includes(p.id));

  return (
    <section className="section catalog-page atelier">
      <CatalogHead
        kicker={lang === "ar" ? "الجمال" : "Beauty"}
        title={lang === "ar" ? "كريمات، زيوت، رذاذ وبودرة" : "Creams, Oils, Spray, Powder"}
        lede={
          lang === "ar"
            ? "أثر وليل وإشراق وماريا على البشرة. كريم، رذاذ شعر وجسم، بودرة حرير، وزيت لبن. يُجمَّع في الإمارات."
            : "Athar, Layl, Ishraq and Maria on skin. Cream, hair and body spray, silk powder, and laban oil. Assembled in the UAE."
        }
        countLabel={lang === "ar" ? `${featured.length + rest.length} منتجات` : `${featured.length + rest.length} pieces`}
      />
      <div className="atelier-layout hero-first">
        <div className="atelier-hero">
          <img src={brandSrc("marahil-beauty-lineup.png")} alt={lang === "ar" ? "خط أثر للجمال" : "Athar beauty line"} />
          <p className="meta">{lang === "ar" ? "كريم · زيت · شمعة" : "Cream · Oil · Candle"}</p>
        </div>
        <div className="atelier-cards">
          {featured.map((p) => (
            <ShopCard key={p.id} product={p} lang={lang} kicker={p.family[lang]} />
          ))}
        </div>
      </div>
      {rest.length > 0 && (
        <>
          <h3 className="atelier-more">{lang === "ar" ? "بقية الجمال" : "The rest of Beauty"}</h3>
          <p className="lede">{lang === "ar" ? "زيوت ١٠٠ مل، إكسير ماريا، رذاذ شعر، كريمات، ودهن وصل." : "100ml oils, Maria elixir, Hair Mist, Creams, and Wasl Attar."}</p>
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
