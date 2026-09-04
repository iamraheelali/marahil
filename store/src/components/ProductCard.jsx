import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { collectionLabel, fromPrice, hasPriceRange } from "../data/catalog.js";

export default function ProductCard({ product, lang, rating = 0, showCollection = false }) {
  const { t } = useStore();
  const rest = product.image;
  const pack = (product.images || []).find((src) => src !== rest);
  const size = product.sizes?.[0];
  const showVat = !(product.vatExempt || product.giftValue);
  const range = hasPriceRange(product);
  const low = fromPrice(product);
  return (
    <Link className="card" to={`/product/${product.id}`}>
      <div className={`card-media${pack ? " has-pack" : ""}`}>
        <img className="rest" src={rest} alt={product.name[lang]} />
        {pack && <img className="pack" src={pack} alt="" aria-hidden="true" />}
      </div>
      <div className="card-body">
        {product.arabic ? (
          <p className="card-ar" lang="ar">
            {product.arabic}
          </p>
        ) : showCollection ? (
          <p className="meta">{collectionLabel(product.collection, lang)}</p>
        ) : null}
        <h3>{product.name[lang]}</h3>
        {product.family?.[lang] ? <p className="card-family">{product.family[lang]}</p> : null}
        {size ? <p className="card-size">{size.label}</p> : null}
        {rating > 0 && <p className="muted card-rating">★ {rating.toFixed(1)}</p>}
        <div className="price">
          {range
            ? `${lang === "ar" ? "من" : "From"} AED ${low.toLocaleString()}`
            : `AED ${low.toLocaleString()}`}
          {showVat && <span className="excl">{t.exclVat}</span>}
        </div>
      </div>
    </Link>
  );
}
