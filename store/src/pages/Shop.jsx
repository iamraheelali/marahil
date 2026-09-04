import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import CatalogHead from "../components/CatalogHead.jsx";
import ProductCard from "../components/ProductCard.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { COLLECTION_LABELS, SHOP_GROUPS, collectionLabel } from "../data/catalog.js";
import { STAGES_PAGE, sortByIds } from "../data/stages.js";

const FILTERS = [
  { id: "all", match: null, en: "All", ar: "الكل" },
  { id: "marahil", match: ["marahil"], en: "Stages", ar: "المراحل" },
  { id: "haute", match: ["haute"], en: "Parfum", ar: "بارفان" },
  { id: "woods", match: ["woods"], en: "Woods", ar: "الأخشاب" },
  { id: "rituals", match: ["rituals"], en: "Beauty", ar: "الجمال" },
  { id: "home", match: ["home"], en: "Home", ar: "الغرفة" },
  { id: "atelier", match: ["atelier"], en: "Atelier", ar: "المرسم" },
  { id: "discovery", match: ["discovery"], en: "Discovery", ar: "الاكتشاف" },
];

function orderGroup(items, id) {
  if (id === "marahil") return sortByIds(items, STAGES_PAGE);
  return items;
}

export default function Shop() {
  const { lang, catalog, avgRating } = useStore();
  const [filter, setFilter] = useState("all");
  const goods = catalog.filter((p) => p.collection !== "cards" && p.collection !== "custom" && p.published !== false);
  const active = FILTERS.find((f) => f.id === filter) || FILTERS[0];
  const counts = useMemo(() => {
    const next = { all: goods.length };
    for (const f of FILTERS) {
      if (!f.match) continue;
      next[f.id] = goods.filter((p) => f.match.includes(p.collection)).length;
    }
    return next;
  }, [goods]);

  const grouped = useMemo(() => {
    const source = !active.match ? goods : goods.filter((p) => active.match.includes(p.collection));
    const ids = active.match || SHOP_GROUPS;
    return ids
      .map((id) => ({
        id,
        items: orderGroup(
          source.filter((p) => p.collection === id),
          id
        ),
      }))
      .filter((g) => g.items.length);
  }, [goods, active]);

  const shown = grouped.reduce((n, g) => n + g.items.length, 0);

  return (
    <section className="section catalog-page">
      <CatalogHead
        kicker={lang === "ar" ? "المتجر" : "Shop"}
        title={lang === "ar" ? "المجموعات" : "The house, in chapters"}
        lede={
          lang === "ar"
            ? "المراحل، البارفان، الأخشاب، الجمال، الغرفة، والمرسم. فصول، لا شبكة عشوائية."
            : "Stages, Parfum, Woods, Beauty, Home, and Atelier. Chapters, not a random grid."
        }
        countLabel={lang === "ar" ? `عرض ${shown} من ${goods.length}` : `Showing ${shown} of ${goods.length}`}
        nav={false}
        extra={
          <div className="shop-subcats">
            <p className="shop-subcats-kicker">{lang === "ar" ? "في هذه الصفحة" : "On this page"}</p>
            <div className="shop-subcats-row" role="tablist" aria-label={lang === "ar" ? "التصنيف" : "Filter the grid"}>
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  role="tab"
                  aria-selected={f.id === filter}
                  className={f.id === filter ? "is-on" : ""}
                  onClick={() => setFilter(f.id)}
                >
                  <span className="shop-subcats-name">{lang === "ar" ? f.ar : f.en}</span>
                  <span className="shop-subcats-n">{counts[f.id] ?? 0}</span>
                </button>
              ))}
            </div>
          </div>
        }
      />
      {grouped.map((g) => {
        const meta = COLLECTION_LABELS[g.id];
        return (
          <section key={g.id} className="catalog-group">
            {grouped.length > 1 && (
              <header className="catalog-group-head">
                <h2>{collectionLabel(g.id, lang)}</h2>
                {meta?.to ? (
                  <Link className="catalog-group-more" to={meta.to}>
                    {lang === "ar" ? "المجموعة" : "Open"}
                  </Link>
                ) : null}
              </header>
            )}
            <div className="grid collection-grid">
              {g.items.map((p) => (
                <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
              ))}
            </div>
          </section>
        );
      })}
    </section>
  );
}
