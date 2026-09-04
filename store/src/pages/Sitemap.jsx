import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { EMAILS } from "../data/house.js";

const MAP = [
  {
    en: "Home",
    ar: "الرئيسية",
    to: "/",
    job: { en: "Film still of the house, then the chapters.", ar: "لقطة البيت ثم الفصول." },
  },
  {
    en: "The House",
    ar: "البيت",
    to: "/house",
    job: { en: "Maria Raheel Khan. Meaning of مراحل. Abu Dhabi.", ar: "ماريا رحيل خان. معنى مراحل. أبوظبي." },
  },
  {
    en: "Shop",
    ar: "المتجر",
    to: "/shop",
    job: { en: "The house grid. Stages, Beauty, Home, Atelier.", ar: "شبكة البيت. المراحل والجمال والغرفة والمرسم." },
  },
  {
    en: "Stages",
    ar: "المراحل",
    to: "/the-marahil",
    job: { en: "Bad’, Ishraq, Wasl, Layl, Athar, Maria. Discovery beside them.", ar: "بدء وإشراق ووصل وليل وأثر وماريا. الاكتشاف بجانبها." },
  },
  {
    en: "Pale Woods",
    ar: "الأخشاب الفاتحة",
    to: "/woods",
    job: { en: "Hadu’, Sarw, Ghusn.", ar: "هدوء وسرو وغصن." },
  },
  {
    en: "Discovery",
    ar: "الاكتشاف",
    to: "/discovery",
    job: { en: "The First Stages and Pale Woods sets.", ar: "طقم المراحل الأولى والأخشاب الفاتحة." },
  },
  {
    en: "Beauty",
    ar: "الجمال",
    to: "/rituals",
    job: { en: "Creams, Oils, Hair Mist, Attar, Scented Candles.", ar: "كريمات وزيوت ورذاذ شعر ودهن وشموع." },
  },
  {
    en: "Home scent",
    ar: "البيت العطري",
    to: "/hearth",
    job: { en: "Bakhoor and Scented Candles.", ar: "بخور وشموع معطرة." },
  },
  {
    en: "Atelier",
    ar: "المرسم",
    to: "/atelier",
    job: { en: "Jewellery — Earrings, Necklace, Rings.", ar: "مجوهرات — أقراط وعقد وخواتم." },
  },
  {
    en: "Custom",
    ar: "خاص",
    to: "/custom",
    job: { en: "Original juice from a brief.", ar: "عصير أصلي من موجز." },
  },
  {
    en: "Care",
    ar: "العناية",
    to: "/care",
    job: { en: "Authenticity, IFRA, how to wear.", ar: "الأصالة وإيفرا وطريقة الارتداء." },
  },
  {
    en: "Trade",
    ar: "تجارة",
    to: "/wholesale",
    job: { en: "Wholesale and retail.", ar: "جملة وتجزئة." },
  },
  {
    en: "Cards",
    ar: "البطاقات",
    to: "/cards",
    job: { en: "House Card and gift cards.", ar: "بطاقة البيت وبطاقات الإهداء." },
  },
  {
    en: "Account",
    ar: "الحساب",
    to: "/account",
    job: { en: "Profile and orders.", ar: "الملف والطلبات." },
  },
];

export default function Sitemap() {
  const { lang } = useStore();
  return (
    <section className="section sitemap-page">
      <p className="kicker">{lang === "ar" ? "البيت" : "The House"}</p>
      <h2>{lang === "ar" ? "خريطة الموقع" : "Sitemap"}</h2>
      <p className="lede">
        {lang === "ar"
          ? "بيت لا كتالوج عشوائي. المراحل فصول. الإلهام من بيوت العطور الراقية — الهوية تبقى مراحل: ليل وختم ذهبي وعاج."
          : "A house, not a random catalogue. Stages are chapters. Structure studied from houses such as Amouage — the identity stays MARAHIL: night, gold crest, ivory."}
      </p>
      <p className="muted">
        <a className="mail-link" href={`mailto:${EMAILS.studio}`}>
          {EMAILS.studio}
        </a>
        {" · "}
        <a className="mail-link" href={`mailto:${EMAILS.press}`}>
          {EMAILS.press}
        </a>
      </p>
      <ul className="sitemap-list">
        {MAP.map((row) => (
          <li key={row.to}>
            <Link to={row.to}>{lang === "ar" ? row.ar : row.en}</Link>
            <span>{row.job[lang] || row.job.en}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
