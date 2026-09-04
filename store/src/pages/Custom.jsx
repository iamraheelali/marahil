import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";
import { EMAILS } from "../data/house.js";

const FAMILIES = [
  { id: "woody", en: "Woody / sandalwood", ar: "خشبي / صندل" },
  { id: "floral", en: "Floral", ar: "زهري" },
  { id: "oriental", en: "Oriental / amber", ar: "شرقي / عنبر" },
  { id: "fresh", en: "Fresh / citrus", ar: "منعش / حمضي" },
  { id: "gourmand", en: "Soft gourmand", ar: "حلوي خفيف" },
  { id: "musk", en: "Musk / skin", ar: "مسك / بشرة" },
];

export default function Custom() {
  const { t, lang, add, getProduct } = useStore();
  const nav = useNavigate();
  const product = getProduct("custom-atelier");
  const [path, setPath] = useState("inspired");
  const [family, setFamily] = useState("woody");
  const [sizeId, setSizeId] = useState(() => product?.sizes?.[0]?.id || "");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState("");
  const size = product?.sizes.find((s) => s.id === sizeId);

  if (!product || !size) {
    return (
      <section className="section">
        <p className="muted">{lang === "ar" ? "جاري التحميل…" : "Loading the atelier…"}</p>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="kicker">{lang === "ar" ? "المشغل" : "Atelier"}</div>
      <h2>{lang === "ar" ? "عطر خاص" : "Custom Fragrance"}</h2>
      <p className="lede">
        {lang === "ar"
          ? "صمموا عطراً أصلياً من مراحل: من موجزكم، أو بإلهام من عطر تحبونه. الناتج يُعبأ بختم البيت الذهبي فقط — لا ننسخ علب البيوت الأخرى ولا شعاراتها ولا نبيع تقليداً باسم علامة أخرى."
          : "Commission an original MARAHIL juice from your brief, or from a scent you already love as inspiration. It is bottled under the gold house crest only. We do not copy other houses’ packaging, logos, or sell a fake of another brand."}
      </p>
      <div className="notice">
        {lang === "ar"
          ? "البارفان والإكستريه يُصنعان في فرنسا. أو دو بارفان اليومي، والزيوت، والبخور، والكريمات، والشموع تُجمَّع في الإمارات، من العصير نفسه."
          : "Haute Parfum and Extrait are made in France. Everyday Eau de Parfum, Oils, Bakhoor, Creams, and Scented Candles are assembled in the UAE, from the same juice."}
      </div>
      <form
        className="split"
        onSubmit={(e) => {
          e.preventDefault();
          add("custom-atelier", sizeId, 1, {
            path,
            family,
            reference: path === "inspired" ? reference.trim() : "",
            notes: notes.trim(),
            name: name.trim() || (lang === "ar" ? "خاص" : "Custom"),
          });
          nav("/cart");
        }}
      >
        <div className="form" style={{ maxWidth: "100%" }}>
          <h3>{lang === "ar" ? "المسار" : "Path"}</h3>
          <div className="chips">
            <button type="button" className={path === "inspired" ? "on" : ""} onClick={() => setPath("inspired")}>
              {lang === "ar" ? "مستوحى من عطر تحبونه" : "Inspired by a scent you love"}
            </button>
            <button type="button" className={path === "original" ? "on" : ""} onClick={() => setPath("original")}>
              {lang === "ar" ? "أصلي بالكامل" : "Fully original brief"}
            </button>
          </div>
          {path === "inspired" && (
            <>
              <label className="muted">
                {lang === "ar"
                  ? "صفوا العطر الذي تحبونه (ملاحظات، إحساس، عائلة). للمشغل فقط — لن يُطبع على الزجاجة."
                  : "Describe a scent you love (notes, mood, family). Private for the atelier — never printed on the bottle."}
              </label>
              <textarea
                required
                rows={4}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder={
                  lang === "ar"
                    ? "مثال: صندل كريمي هادئ، ورد خشبي، مسك قريب من البشرة…"
                    : "e.g. quiet creamy sandalwood, woody rose, close musk on skin…"
                }
              />
            </>
          )}
          <h3>{lang === "ar" ? "العائلة" : "Olfactive family"}</h3>
          <div className="chips">
            {FAMILIES.map((f) => (
              <button key={f.id} type="button" className={family === f.id ? "on" : ""} onClick={() => setFamily(f.id)}>
                {f[lang]}
              </button>
            ))}
          </div>
          <label className="muted">{lang === "ar" ? "ملاحظات إضافية" : "Further notes"}</label>
          <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          <label className="muted">{lang === "ar" ? "اسم عصيركم (اختياري)" : "Name this juice (optional)"}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hadu’ for N." />
          <h3>{lang === "ar" ? "التركيز والحجم" : "Concentration & format"}</h3>
          <div className="sizes" style={{ marginTop: 0 }}>
            {product.sizes.map((s) => (
              <button key={s.id} type="button" className={s.id === sizeId ? "on" : ""} onClick={() => setSizeId(s.id)}>
                {s.label} · AED {s.price.toLocaleString()} {t.exclVat}
              </button>
            ))}
          </div>
          <button className="btn" type="submit">
            {t.add} · AED {size.price.toLocaleString()} {t.exclVat}
          </button>
        </div>
        <div>
          <img src={brandSrc("marahil-cons-box-lid.png")} alt="MARAHIL custom box" />
          <p className="muted" style={{ marginTop: 12 }}>
            {lang === "ar"
              ? "الزجاجة والغطاء والختم نفسها لبيت مراحل. اسم عصيركم على اللوحة فقط."
              : "Same house bottle, black cap, and gold house crest. Only your juice name on the plaque."}{" "}
            <a className="mail-link" href={`mailto:${EMAILS.studio}`}>
              {EMAILS.studio}
            </a>
          </p>
        </div>
      </form>
    </section>
  );
}
