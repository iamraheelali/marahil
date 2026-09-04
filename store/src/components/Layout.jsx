import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function Layout() {
  const { t, lang, setLang, dir, lines, client } = useStore();
  const loc = useLocation();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const pay = loc.pathname === "/cart" || loc.pathname === "/checkout";

  return (
    <div dir={dir} lang={lang}>
      {pay && <div className="banner">{t.payBanner}</div>}
      <header className="header">
        <Link to="/" className="brand-lockup">
          <span>
            <div className="brand-name">MARAHIL</div>
            <div className="brand-ar">مراحل</div>
            <div className="brand-sub">{t.houseLine}</div>
          </span>
        </Link>
        <nav className="nav">
          <NavLink to="/house">{t.nav.house}</NavLink>
          <NavLink to="/the-marahil">{t.nav.marahil}</NavLink>
          <NavLink to="/woods">{t.nav.woods}</NavLink>
          <NavLink to="/rituals">{t.nav.rituals}</NavLink>
          <NavLink to="/atelier">{t.nav.atelier}</NavLink>
        </nav>
        <div className="header-actions">
          <button className="lang" type="button" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {lang === "en" ? "ع" : "EN"}
          </button>
          <Link className="bag-count" to="/account">
            {client ? client.name.split(" ")[0] : t.account}
          </Link>
          <Link className="bag-count" to="/cart">
            {t.nav.cart} ({count})
          </Link>
        </div>
      </header>
      <Outlet />
      <footer className="footer">
        <span>{t.footerLegal}</span>
        <span>
          <Link to="/custom">{t.nav.custom}</Link>
          {" · "}
          <Link to="/cards">{t.nav.cards}</Link>
          {" · "}
          <Link to="/hearth">{t.nav.hearth}</Link>
          {" · "}
          <Link to="/wholesale">{t.wholesaleNav}</Link>
          {" · "}
          <Link to="/care">{t.care}</Link>
          {" · "}
          <Link to="/house">{t.company}</Link>
        </span>
      </footer>
    </div>
  );
}
