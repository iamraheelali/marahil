import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { STAGES_PAGE, sortByIds } from "../data/stages.js";

export function ShopCategory() {
  const { id } = useParams();
  const { lang, categories } = useStore();
  const cat = (categories || []).find((c) => c.id === id);
  return (
    <Collection
      id={id}
      title={cat?.name?.[lang] || cat?.name?.en || id}
      lede={cat?.blurb?.[lang] || cat?.blurb?.en || ""}
    />
  );
}

export default function Collection({ id, ids, title, lede, order }) {
  const { lang, byCollection, avgRating } = useStore();
  const cols = ids || [id];
  let items = cols.flatMap((c) => byCollection(c));
  const sequence = order || (cols.includes("marahil") ? STAGES_PAGE : null);
  if (sequence) items = sortByIds(items, sequence);
  return (
    <section className="section collection">
      <div className="collection-head">
        <p className="kicker">{lang === "ar" ? "المجموعة" : "Collection"}</p>
        <h2>{title}</h2>
        <p className="lede">{lede}</p>
        <p className="muted">
          {lang === "ar" ? `${items.length} منتجات` : `${items.length} pieces`}
          {lang === "ar" ? " · مرّروا لرؤية العلبة" : " · Hover to see the house box"}
        </p>
      </div>
      <div className="grid collection-grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
        ))}
      </div>
    </section>
  );
}
