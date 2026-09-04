import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";
import { MAIN_NAV, MEGA_COLUMNS, navLabel } from "../data/nav.js";
import HouseContact from "./HouseContact.jsx";

export default function Layout() {
  const { t, lang, setLang, dir, lines, client, settings } = useStore();
  const loc = useLocation();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const pay = loc.pathname === "/cart" || loc.pathname === "/checkout";
  const megaOn = Boolean(settings?.megaNav);
  const [open, setOpen] = useState(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [loc.pathname, loc.search, loc.hash, lang]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", drawer);
    return () => document.body.classList.remove("nav-open");
  }, [drawer]);

  useEffect(() => {
    if (!drawer && !open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDrawer(false);
        setOpen(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawer, open]);

  const menus = MAIN_NAV.map((item) => ({
    ...item,
    label: navLabel(item, lang),
    columns: MEGA_COLUMNS[item.id] || null,
  }));

  return (
    <div className="house-root" dir={dir} lang={lang}>
      <div className="announce">
        {lang === "ar" ? (
          <>
            أبوظبي · عرض غير مدرج
            <span className="announce-break">الأسعار قبل ضريبة الإمارات</span>
          </>
        ) : (
          <>
            Abu Dhabi · Unlisted preview
            <span className="announce-break">Prices excl. UAE VAT</span>
          </>
        )}
      </div>
      {pay && <div className="banner">{t.payBanner}</div>}
      <header className="masthead" onMouseLeave={() => setOpen(null)}>
        <button
          className="mast-burger"
          type="button"
          aria-label={drawer ? "Close menu" : "Menu"}
          aria-expanded={drawer}
          onClick={() => setDrawer((v) => !v)}
        >
          <span />
          <span />
        </button>
        <Link to="/" className="brand-lockup" aria-label="MARAHIL">
          <img className="brand-crest" src={brandSrc("marahil-crest.png")} alt="" />
          <span className="brand-word">
            <span className="brand-name">MARAHIL</span>
            <span className="brand-ar">مراحل</span>
          </span>
        </Link>
        <nav className="mast-nav" aria-label={lang === "ar" ? "القائمة" : "Main"}>
          {menus.map((m) => (
            <NavLink
              key={m.id}
              to={m.href}
              end
              className={({ isActive }) => (isActive ? "mast-link active" : "mast-link")}
              onMouseEnter={() => megaOn && m.columns && setOpen(m.id)}
              onFocus={() => megaOn && m.columns && setOpen(m.id)}
            >
              {m.label}
            </NavLink>
          ))}
        </nav>
        <div className="header-actions">
          <button className="lang" type="button" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {lang === "en" ? "ع" : "EN"}
          </button>
          <Link className="bag-count header-account" to="/account">
            {client ? client.name.split(" ")[0] : t.signIn}
          </Link>
          <Link className="bag-count header-bag" to="/cart" aria-label={`${t.nav.cart} (${count})`}>
            <span className="bag-label">{t.nav.cart}</span>
            <span className="bag-n">{count}</span>
          </Link>
        </div>
        {megaOn &&
          menus.map(
            (m) =>
              m.columns &&
              open === m.id && (
                <div key={`panel-${m.id}`} className="mega" onMouseEnter={() => setOpen(m.id)}>
                  {m.columns.map((col) => (
                    <div key={col.heading.en}>
                      <p className="mega-head">{navLabel(col.heading, lang)}</p>
                      {col.links.map((l) => (
                        <Link key={l.to} to={l.to}>
                          {navLabel(l, lang)}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )
          )}
      </header>
      {drawer && (
        <button className="drawer-veil" type="button" aria-label="Close menu" onClick={() => setDrawer(false)} />
      )}
      {drawer && (
        <nav className="drawer" aria-label={lang === "ar" ? "القائمة" : "Menu"}>
          {menus.map((m) => (
            <div key={m.id} className="drawer-block">
              <Link to={m.href}>{m.label}</Link>
              {megaOn &&
                m.columns?.flatMap((c) => c.links).map((l) => (
                  <Link key={l.to} to={l.to}>
                    {navLabel(l, lang)}
                  </Link>
                ))}
            </div>
          ))}
          <div className="drawer-block drawer-service">
            <Link to="/account">{client ? client.name.split(" ")[0] : t.signIn}</Link>
            <Link to="/cart">
              {t.nav.cart} ({count})
            </Link>
            <Link to="/care">{t.care}</Link>
            <Link to="/wholesale">{t.wholesaleNav}</Link>
          </div>
        </nav>
      )}
      <main id="house-main" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-foot">
        <div className="site-foot-grid">
          <div>
            <img className="foot-crest" src={brandSrc("marahil-crest.png")} alt="MARAHIL" />
            <p className="foot-legal">{t.footerLegal}</p>
            <p className="foot-tag">{t.footerTag}</p>
            <p className="muted">{t.packLine}</p>
            <HouseContact lang={lang} />
          </div>
          <div>
            <p className="mega-head">{lang === "ar" ? "العطور" : "Perfumes"}</p>
            <Link to="/shop">{lang === "ar" ? "المتجر" : "Shop"}</Link>
            <Link to="/the-marahil">{t.nav.marahil}</Link>
            <Link to="/woods">{t.nav.woods}</Link>
            <Link to="/discovery">{lang === "ar" ? "الاكتشاف" : "Discovery"}</Link>
            <Link to="/custom">{t.nav.custom}</Link>
          </div>
          <div>
            <p className="mega-head">{lang === "ar" ? "البيت" : "The House"}</p>
            <Link to="/house">{t.nav.house}</Link>
            <Link to="/rituals">{t.nav.rituals}</Link>
            <Link to="/atelier">{t.nav.atelier}</Link>
            <Link to="/hearth">{t.nav.hearth}</Link>
            <Link to="/wholesale">{t.wholesaleNav}</Link>
          </div>
          <div>
            <p className="mega-head">{lang === "ar" ? "الخدمة" : "Service"}</p>
            <Link to="/account">{t.account}</Link>
            <Link to="/cards">{t.nav.cards}</Link>
            <Link to="/care">{t.care}</Link>
            <Link to="/sitemap">{lang === "ar" ? "خريطة الموقع" : "Sitemap"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
