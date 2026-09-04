/** Public collection labels and catalog page copy. */

export const COLLECTION_LABELS = {
  marahil: { en: "Stages", ar: "المراحل", to: "/the-marahil" },
  haute: { en: "Parfum", ar: "بارفان", to: "/the-marahil" },
  woods: { en: "Pale Woods", ar: "الأخشاب", to: "/woods" },
  discovery: { en: "Discovery", ar: "الاكتشاف", to: "/discovery" },
  rituals: { en: "Beauty", ar: "الجمال", to: "/rituals" },
  home: { en: "Home", ar: "الغرفة", to: "/hearth" },
  atelier: { en: "Atelier", ar: "المرسم", to: "/atelier" },
  cards: { en: "Cards", ar: "البطاقات", to: "/cards" },
  custom: { en: "Custom", ar: "خاص", to: "/custom" },
};

export const SHOP_GROUPS = ["marahil", "haute", "woods", "discovery", "rituals", "home", "atelier"];

export const CATALOG_PAGES = {
  woods: {
    id: "woods",
    kicker: { en: "The Pale Woods", ar: "الأخشاب الفاتحة" },
    title: { en: "Hadu’, Sarw, Ghusn", ar: "هدوء، سرو، غصن" },
    lede: {
      en: "Three quiet woods. Creamy sandalwood, cool cypress, a warm bough. Same bottle. Same black cap.",
      ar: "ثلاثة أخشاب هادئة. صندل كريمي، سرو بارد، وغصن دافئ. الزجاجة نفسها. الغطاء الأسود نفسه.",
    },
  },
  hearth: {
    id: "home",
    kicker: { en: "Home", ar: "الغرفة" },
    title: { en: "Bakhoor and Scented Candles", ar: "بخور وشموع معطرة" },
    lede: {
      en: "The same juice, for the room. Layl Bakhoor, Athar and Layl candles.",
      ar: "العصير نفسه، للغرفة. بخور ليل، وشموع أثر وليل.",
    },
  },
  discovery: {
    ids: ["discovery"],
    kicker: { en: "Discovery", ar: "الاكتشاف" },
    title: { en: "The first stages", ar: "المراحل الأولى" },
    lede: {
      en: "The First Stages and The Pale Woods. Chapters in 2ml, not a random vial set.",
      ar: "المراحل الأولى والأخشاب الفاتحة. فصول بـ ٢ مل، لا طقم عبوات عشوائي.",
    },
  },
};

export function collectionLabel(id, lang) {
  const row = COLLECTION_LABELS[id];
  if (!row) return id;
  return lang === "ar" ? row.ar : row.en;
}

export function fromPrice(product) {
  const prices = (product.sizes || []).map((s) => Number(s.price)).filter((n) => Number.isFinite(n));
  if (!prices.length) return 0;
  return Math.min(...prices);
}

export function hasPriceRange(product) {
  const prices = (product.sizes || []).map((s) => Number(s.price));
  return prices.length > 1 && prices.some((p) => p !== prices[0]);
}
