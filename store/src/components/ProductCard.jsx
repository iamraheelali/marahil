import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function ProductCard({ product, lang, rating = 0 }) {
  const { t } = useStore();
  const rest = product.image;
  const pack = (product.images || []).find((src) => src !== rest);
  const size = product.sizes[0];
  const showVat = !(product.vatExempt || product.giftValue);
  return (
    <Link className="card" to={`/product/${product.id}`}>
      <div className={`card-media${pack ? " has-pack" : ""}`}>
        <img className="rest" src={rest} alt={product.name[lang]} />
        {pack && <img className="pack" src={pack} alt="" aria-hidden="true" />}
      </div>
      <div className="card-body">
        <div className="meta">{product.arabic}</div>
        <h3>{product.name[lang]}</h3>
        <p className="card-size">{size.label}</p>
        {rating > 0 && <p className="muted">★ {rating.toFixed(1)}</p>}
        <div className="price">
          {product.sizes.length > 1 && product.sizes.some((s) => s.price !== size.price)
            ? `${lang === "ar" ? "من" : "From"} AED ${Math.min(...product.sizes.map((s) => s.price)).toLocaleString()}`
            : `AED ${size.price.toLocaleString()}`}
          {showVat && <span className="excl">{t.exclVat}</span>}
        </div>
      </div>
    </Link>
  );
}
