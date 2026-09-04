import CollectionNav from "./CollectionNav.jsx";

export default function CatalogHead({ kicker, title, lede, countLabel, extra, nav = true }) {
  return (
    <header className="catalog-head">
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <h1>{title}</h1>
      {lede ? <p className="lede">{lede}</p> : null}
      {nav ? <CollectionNav /> : null}
      {extra}
      {countLabel ? <p className="muted catalog-count">{countLabel}</p> : null}
    </header>
  );
}
