import { useParams } from "react-router-dom";
import CatalogHead from "../components/CatalogHead.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { CATALOG_PAGES } from "../data/catalog.js";
import { STAGES_PAGE, sortByIds } from "../data/stages.js";
import { useStore } from "../context/StoreContext.jsx";

export function ShopCategory() {
  const { id } = useParams();
  const { lang, categories } = useStore();
  const cat = (categories || []).find((c) => c.id === id);
  return (
    <Collection
      id={id}
      kicker={lang === "ar" ? "المجموعة" : "Collection"}
      title={cat?.name?.[lang] || cat?.name?.en || id}
      lede={cat?.blurb?.[lang] || cat?.blurb?.en || ""}
    />
  );
}

export default function Collection({ page, id, ids, kicker, title, lede, order }) {
  const { lang, byCollection, avgRating } = useStore();
  const copy = page ? CATALOG_PAGES[page] : null;
  const cols = copy?.ids || ids || [copy?.id || id];
  let items = cols.flatMap((c) => byCollection(c));
  const sequence = order || (cols.includes("marahil") ? STAGES_PAGE : null);
  if (sequence) items = sortByIds(items, sequence);

  const headKicker = copy ? copy.kicker[lang] : kicker || (lang === "ar" ? "المجموعة" : "Collection");
  const headTitle = copy ? copy.title[lang] : title;
  const headLede = copy ? copy.lede[lang] : lede;

  return (
    <section className="section catalog-page">
      <CatalogHead
        kicker={headKicker}
        title={headTitle}
        lede={headLede}
        countLabel={lang === "ar" ? `${items.length} منتجات` : `${items.length} pieces`}
      />
      <div className="grid collection-grid">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
        ))}
      </div>
    </section>
  );
}
