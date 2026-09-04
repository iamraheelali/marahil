/** House main navigation. Mega columns stay here so admin can enable them later. */

export const MAIN_NAV = [
  { id: "shop", href: "/shop", en: "Shop", ar: "المتجر" },
  { id: "stages", href: "/the-marahil", en: "Stages", ar: "المراحل" },
  { id: "beauty", href: "/rituals", en: "Beauty", ar: "الجمال" },
  { id: "atelier", href: "/atelier", en: "Atelier", ar: "المرسم" },
  { id: "house", href: "/house", en: "The House", ar: "البيت" },
];

export const MEGA_COLUMNS = {
  shop: [
    {
      heading: { en: "Collections", ar: "المجموعات" },
      links: [
        { to: "/shop", en: "All collections", ar: "كل المجموعات" },
        { to: "/the-marahil", en: "Stages", ar: "المراحل" },
        { to: "/woods", en: "The Pale Woods", ar: "الأخشاب الفاتحة" },
        { to: "/discovery", en: "Discovery", ar: "الاكتشاف" },
      ],
    },
  ],
  stages: [
    {
      heading: { en: "Stages", ar: "المراحل" },
      links: [
        { to: "/the-marahil", en: "All stages", ar: "كل المراحل" },
        { to: "/product/bad-edp", en: "Bad’", ar: "بدء" },
        { to: "/product/ishraq-edp", en: "Ishraq", ar: "إشراق" },
        { to: "/product/wasl-edp", en: "Wasl", ar: "وصل" },
        { to: "/product/layl-edp", en: "Layl", ar: "ليل" },
        { to: "/product/athar-edp", en: "Athar", ar: "أثر" },
        { to: "/product/maria-extrait", en: "Maria", ar: "ماريا" },
      ],
    },
    {
      heading: { en: "Woods & Parfum", ar: "الأخشاب والبارفان" },
      links: [
        { to: "/woods", en: "The Pale Woods", ar: "الأخشاب الفاتحة" },
        { to: "/product/ishraq-parfum", en: "Ishraq Parfum", ar: "إشراق بارفان" },
        { to: "/product/wasl-parfum", en: "Wasl Parfum", ar: "وصل بارفان" },
        { to: "/custom", en: "Custom", ar: "عطر خاص" },
      ],
    },
  ],
  beauty: [
    {
      heading: { en: "Skin & room", ar: "البشرة والغرفة" },
      links: [
        { to: "/rituals", en: "Creams, Oils, Powder", ar: "كريمات وزيوت وبودرة" },
        { to: "/product/layl-hair-body", en: "Layl Hair & Body", ar: "رذاذ ليل" },
        { to: "/product/ishraq-silk-powder", en: "Ishraq Silk Powder", ar: "بودرة إشراق" },
        { to: "/product/athar-laban-oil", en: "Athar Laban Oil", ar: "زيت أثر باللبن" },
        { to: "/hearth", en: "Bakhoor & Scented Candles", ar: "بخور وشموع" },
        { to: "/product/wasl-attar", en: "Wasl Attar", ar: "دهن وصل" },
      ],
    },
  ],
  house: [
    {
      heading: { en: "MARAHIL", ar: "مراحل" },
      links: [
        { to: "/house", en: "Our Story", ar: "قصتنا" },
        { to: "/care", en: "Care", ar: "العناية" },
        { to: "/wholesale", en: "Trade", ar: "تجارة" },
        { to: "/sitemap", en: "Sitemap", ar: "خريطة الموقع" },
      ],
    },
  ],
};

export function navLabel(item, lang) {
  return lang === "ar" ? item.ar : item.en;
}
