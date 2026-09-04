import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function ShopCard({ product, lang, kicker }) {
  const { t, add } = useStore();
  const [sizeId, setSizeId] = useState(product.sizes[0]?.id);
  const [done, setDone] = useState(false);
  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0];
  const shot = product.finishImages?.[sizeId] || product.image;
  return (
    <article className="atelier-card">
      <Link to={`/product/${product.id}`} className="atelier-card-media">
        <img src={shot} alt={product.name[lang]} />
      </Link>
      {kicker ? <div className="meta">{kicker}</div> : null}
      <Link to={`/product/${product.id}`}>
        <h3>{product.name[lang]}</h3>
      </Link>
      <p className="card-size">{size?.label}</p>
      {product.sizes.length > 1 && (
        <div className="chips">
          {product.sizes.map((s) => (
            <button
              key={s.id}
              type="button"
              className={s.id === sizeId ? "on" : ""}
              onClick={() => {
                setSizeId(s.id);
                setDone(false);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <div className="price">
        AED {Number(size?.price || 0).toLocaleString()}
        <span className="excl">{t.exclVat}</span>
      </div>
      <button
        type="button"
        className="btn ghost"
        onClick={() => {
          add(product.id, size.id);
          setDone(true);
        }}
      >
        {done ? t.added : t.add}
      </button>
    </article>
  );
}
