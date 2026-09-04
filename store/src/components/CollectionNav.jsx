import { NavLink } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";

const ITEMS = [
  { to: "/shop", en: "All", ar: "الكل" },
  { to: "/the-marahil", en: "Stages", ar: "المراحل" },
  { to: "/woods", en: "Woods", ar: "الأخشاب" },
  { to: "/rituals", en: "Beauty", ar: "الجمال" },
  { to: "/hearth", en: "Home", ar: "الغرفة" },
  { to: "/atelier", en: "Atelier", ar: "المرسم" },
  { to: "/discovery", en: "Discovery", ar: "الاكتشاف" },
];

export default function CollectionNav() {
  const { lang } = useStore();
  return (
    <nav className="collection-nav" aria-label={lang === "ar" ? "المجموعات" : "Collections"}>
      {ITEMS.map((item) => (
        <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? "is-on" : "")} end={item.to === "/shop"}>
          {lang === "ar" ? item.ar : item.en}
        </NavLink>
      ))}
    </nav>
  );
}
