import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

export default function Layout() {
  const { t, lang, setLang, dir, lines, client } = useStore();
  const loc = useLocation();
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const pay = loc.pathname === "/cart" || loc.pathname === "/checkout";
  const [open, setOpen] = useState(null);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [loc.pathname, lang]);

  const menus = [
    {
      id: "perfumes",
      label: lang === "ar" ? "العطور" : "Perfumes",
      columns: [
        {
          heading: lang === "ar" ? "المراحل" : "Stages",
          links: [
            { to: "/the-marahil", label: lang === "ar" ? "كل المراحل" : "All stages" },
            { to: "/product/bad-edp", label: "Bad’" },
            { to: "/product/ishraq-edp", label: "Ishraq" },
            { to: "/product/wasl-edp", label: "Wasl" },
            { to: "/product/layl-edp", label: "Layl" },
            { to: "/product/athar-edp", label: "Athar" },
            { to: "/product/maria-extrait", label: "Maria" },
          ],
        },
        {
          heading: lang === "ar" ? "الأخشاب والبارفان" : "Woods & Parfum",
          links: [
            { to: "/woods", label: lang === "ar" ? "الأخشاب الفاتحة" : "The Pale Woods" },
            { to: "/product/ishraq-parfum", label: lang === "ar" ? "إشراق بارفان" : "Ishraq Parfum" },
            { to: "/product/wasl-parfum", label: lang === "ar" ? "وصل بارفان" : "Wasl Parfum" },
            { to: "/custom", label: lang === "ar" ? "عطر خاص" : "Custom" },
          ],
        },
      ],
    },
    {
      id: "beauty",
      label: lang === "ar" ? "الجمال" : "Beauty",
      columns: [
        {
          heading: lang === "ar" ? "البشرة والغرفة" : "Skin & room",
          links: [
            { to: "/rituals", label: lang === "ar" ? "كريمات وزيوت" : "Creams, Oils, Candles" },
            { to: "/hearth", label: lang === "ar" ? "بخور وشموع" : "Bakhoor & Scented Candles" },
            { to: "/product/wasl-attar", label: lang === "ar" ? "دهن وصل" : "Wasl Attar" },
          ],
        },
      ],
    },
    {
      id: "discovery",
      label: lang === "ar" ? "الاكتشاف" : "Discovery",
      columns: [
        {
          heading: lang === "ar" ? "أطقم العينات" : "Sampler sets",
          links: [
            { to: "/discovery", label: lang === "ar" ? "المراحل الأولى" : "The First Stages" },
            { to: "/product/first-marahil", label: lang === "ar" ? "ست قارورات" : "Six vials" },
            { to: "/product/pale-woods", label: lang === "ar" ? "الأخشاب الفاتحة" : "The Pale Woods set" },
          ],
        },
      ],
    },
    {
      id: "atelier",
      label: lang === "ar" ? "المرسم" : "Atelier",
      href: "/atelier",
    },
    {
      id: "house",
      label: lang === "ar" ? "البيت" : "The House",
      columns: [
        {
          heading: lang === "ar" ? "مراحل" : "MARAHIL",
          links: [
            { to: "/house", label: lang === "ar" ? "قصتنا" : "Our Story" },
            { to: "/care", label: t.care },
            { to: "/wholesale", label: t.wholesaleNav },
            { to: "/sitemap", label: lang === "ar" ? "خريطة الموقع" : "Sitemap" },
          ],
        },
      ],
    },
  ];

  return (
    <div className="house-root" dir={dir} lang={lang}>
      <div className="announce">
        {lang === "ar"
          ? "أبوظبي · عرض غير مدرج · الأسعار قبل ضريبة الإمارات"
          : "Abu Dhabi · Unlisted preview · Prices excl. UAE VAT"}
      </div>
      {pay && <div className="banner">{t.payBanner}</div>}
      <header className="masthead" onMouseLeave={() => setOpen(null)}>
        <button className="mast-burger" type="button" aria-label="Menu" onClick={() => setDrawer((v) => !v)}>
          <span />
          <span />
        </button>
        <Link to="/" className="brand-lockup">
          <span>
            <div className="brand-name">MARAHIL</div>
            <div className="brand-ar">مراحل</div>
            <div className="brand-sub">{t.houseLine}</div>
          </span>
        </Link>
        <nav className="mast-nav">
          {menus.map((m) =>
            m.href ? (
              <NavLink key={m.id} to={m.href} className="mast-link">
                {m.label}
              </NavLink>
            ) : (
              <div key={m.id} className={`mast-item${open === m.id ? " is-open" : ""}`}>
                <button type="button" className="mast-link" onMouseEnter={() => setOpen(m.id)} onClick={() => setOpen(open === m.id ? null : m.id)}>
                  {m.label}
                </button>
              </div>
            )
          )}
        </nav>
        <div className="header-actions">
          <button className="lang" type="button" onClick={() => setLang(lang === "en" ? "ar" : "en")}>
            {lang === "en" ? "ع" : "EN"}
          </button>
          <Link className="bag-count" to="/account">
            {client ? client.name.split(" ")[0] : t.signIn}
          </Link>
          <Link className="bag-count" to="/cart">
            {t.nav.cart} ({count})
          </Link>
        </div>
        {menus.map(
          (m) =>
            m.columns &&
            open === m.id && (
              <div key={`panel-${m.id}`} className="mega" onMouseEnter={() => setOpen(m.id)}>
                {m.columns.map((col) => (
                  <div key={col.heading}>
                    <p className="mega-head">{col.heading}</p>
                    {col.links.map((l) => (
                      <Link key={l.to} to={l.to}>
                        {l.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )
        )}
      </header>
      {drawer && (
        <div className="drawer">
          {menus.map((m) => (
            <div key={m.id} className="drawer-block">
              {m.href ? (
                <Link to={m.href}>{m.label}</Link>
              ) : (
                <>
                  <p>{m.label}</p>
                  {m.columns?.flatMap((c) => c.links).map((l) => (
                    <Link key={l.to} to={l.to}>
                      {l.label}
                    </Link>
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <Outlet />
      <footer className="site-foot">
        <div className="site-foot-grid">
          <div>
            <p className="brand-name">MARAHIL</p>
            <p className="brand-ar">مراحل</p>
            <p className="muted">{t.footerLegal}</p>
          </div>
          <div>
            <p className="mega-head">{lang === "ar" ? "العطور" : "Perfumes"}</p>
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
