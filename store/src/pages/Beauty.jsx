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
    <section className="section atelier">
      <div className="atelier-head">
        <p className="kicker">{lang === "ar" ? "الجمال" : "Beauty"}</p>
        <h2>{lang === "ar" ? "كريمات وزيوت وشموع" : "Creams, Oils, Scented Candles"}</h2>
        <p className="lede">
          {lang === "ar"
            ? "أثر على البشرة وفي الغرفة. كريم مسك ٥٠ غ، زيت حريري ٣٠ مل، وشمعة ١٨٠ غ. أغطية بيوتر. يُجمَّع في الإمارات."
            : "Athar on skin and in the room. Musk cream 50g, silk oil 30ml, and a 180g candle. Pewter lids. Assembled in the UAE."}
        </p>
      </div>
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
          <p className="lede">{lang === "ar" ? "زيوت ١٠٠ مل، رذاذ شعر، كريمات، ودهن وصل." : "100ml oils, Hair Mist, Creams, and Wasl Attar."}</p>
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
