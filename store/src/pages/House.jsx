import { Link } from "react-router-dom";
import Reveal from "../components/Reveal.jsx";
import HouseContact from "../components/HouseContact.jsx";
import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";
import { HOUSE_PLACE } from "../data/house.js";

const CHAPTERS = [
  { id: "bad-edp", n: "01", en: "Bad’", ar: "بدء", roleEn: "The beginning", roleAr: "البداية" },
  { id: "ishraq-edp", n: "02", en: "Ishraq", ar: "إشراق", roleEn: "Radiance", roleAr: "الإشراق" },
  { id: "wasl-edp", n: "03", en: "Wasl", ar: "وصل", roleEn: "The meeting", roleAr: "اللقاء" },
  { id: "layl-edp", n: "04", en: "Layl", ar: "ليل", roleEn: "Night", roleAr: "الليل" },
  { id: "athar-edp", n: "05", en: "Athar", ar: "أثر", roleEn: "The trace", roleAr: "الأثر" },
  { id: "maria-extrait", n: "06", en: "Maria", ar: "ماريا", roleEn: "The signature", roleAr: "التوقيع" },
];

const page = {
  en: {
    kicker: "The House",
    title: "Every stage has a scent.",
    founderName: "Maria Raheel Khan",
    founded: "Founded in Abu Dhabi",
    nameKicker: "The name",
    nameTitle: "A marhala you can wear",
    nameBody:
      "MARAHIL means stages — the quiet turns a life takes. We do not launch a new floral because summer arrived. We name a marhala.",
    equal:
      "Arabic and English are written as originals. They share the bottle, the box, and the card. Neither waits as a translation.",
    quote: "The house does not launch a season. It launches a stage.",
    founderBody:
      "Maria Raheel Khan founded MARAHIL in Abu Dhabi. The house joins French haute perfumery — Eau de Parfum, Parfum, Extrait — with Gulf heritage: Bakhoor, Oils, Creams, and Scented Candles.",
    chaptersKicker: "The chapters",
    chaptersTitle: "Six stages. One bottle.",
    chaptersBody:
      "Bad’, Ishraq, Wasl, Layl, Athar, and Maria. Discovery sits beside them. You collect chapters, not a new shape each year.",
    craftKicker: "The make",
    franceTitle: "France",
    franceBody: "Haute Parfum and Extrait are made in France. Same juice names. Denser wear.",
    uaeTitle: "The UAE",
    uaeBody: "Everyday editions, Beauty, and Jewellery are assembled in Abu Dhabi, from the same juice.",
    closeTitle: "The house is open.",
    enter: "Enter the stages",
    shop: "Shop",
  },
  ar: {
    kicker: "البيت",
    title: "لكل مرحلة عطر.",
    founderName: "ماريا رحيل خان",
    founded: "تأسس في أبوظبي",
    nameKicker: "الاسم",
    nameTitle: "مرحلة تُلبس",
    nameBody:
      "مراحل تعني الانتقالات الهادئة في حياةٍ تُعاش. لا نطلق زهرية لأن الصيف جاء. نسمّي مرحلة.",
    equal:
      "العربية والإنجليزية تُكتبان أصلين. تتقاسمان الزجاجة والعلبة والبطاقة. ليست إحداهما حاشيةً للأخرى.",
    quote: "البيت لا يطلق موسماً. يطلق مرحلة.",
    founderBody:
      "أسست ماريا رحيل خان مراحل في أبوظبي. يجمع البيت العطر الفرنسي الراقي — أو دو بارفان، بارفان، إكستريه — مع إرث الخليج: البخور، الزيوت، الكريمات، والشموع المعطرة.",
    chaptersKicker: "الفصول",
    chaptersTitle: "ستة مراحل. زجاجة واحدة.",
    chaptersBody:
      "بدء، إشراق، وصل، ليل، أثر، وماريا. الاكتشاف بجانبها. تجمعون فصولاً، لا شكلاً جديداً كل عام.",
    craftKicker: "الصنعة",
    franceTitle: "فرنسا",
    franceBody: "البارفان والإكستريه يُصنعان في فرنسا. الأسماء نفسها. ارتداء أغلظ.",
    uaeTitle: "الإمارات",
    uaeBody: "الإصدارات اليومية، والجمال، والمجوهرات تُجمَّع في أبوظبي، من العصير نفسه.",
    closeTitle: "البيت مفتوح.",
    enter: "ادخلوا إلى المراحل",
    shop: "المتجر",
  },
};

export default function House() {
  const { lang, catalog, t } = useStore();
  const c = page[lang] || page.en;
  const byId = (id) => catalog.find((p) => p.id === id);

  return (
    <article className="maison">
      <section className="maison-open">
        <figure className="maison-open-still">
          <img
            className="founder-portrait"
            src={brandSrc("marahil-house-founder.png")}
            alt="Maria Raheel Khan"
          />
        </figure>
        <div className="maison-open-copy">
          <p className="kicker">{c.kicker}</p>
          <p className="maison-wordmark" lang="ar">
            مراحل
          </p>
          <p className="maison-latin">MARAHIL</p>
          <h1>{c.title}</h1>
          <p className="maison-founder-line">
            {c.founderName}
            <span aria-hidden="true"> · </span>
            {c.founded}
          </p>
          <p className="maison-scroll">{lang === "ar" ? "مرّروا" : "Scroll"}</p>
        </div>
      </section>

      <Reveal>
        <section className="maison-name">
          <p className="kicker">{c.nameKicker}</p>
          <div className="maison-name-pair">
            <h2 className="maison-name-ar" lang="ar">
              مراحل
            </h2>
            <p className="maison-name-en">MARAHIL</p>
          </div>
          <p className="maison-name-title">{c.nameTitle}</p>
          <p className="lede">{c.nameBody}</p>
          <p className="maison-equal">{c.equal}</p>
          <img className="maison-name-crest" src={brandSrc("marahil-crest.png")} alt="" />
        </section>
      </Reveal>

      <Reveal>
        <section className="maison-founder">
          <blockquote className="maison-quote">
            <p>{c.quote}</p>
          </blockquote>
          <div className="maison-founder-copy">
            <p className="kicker">{t.houseFounderKicker}</p>
            <h2>{c.founderName}</h2>
            <p className="lede">{c.founderBody}</p>
            <p className="muted">{HOUSE_PLACE[lang] || HOUSE_PLACE.en}</p>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="maison-chapters">
          <header className="maison-chapters-head">
            <p className="kicker">{c.chaptersKicker}</p>
            <h2>{c.chaptersTitle}</h2>
            <p className="lede">{c.chaptersBody}</p>
          </header>
          <ol className="maison-timeline">
            {CHAPTERS.map((ch) => {
              const product = byId(ch.id);
              return (
                <li key={ch.id}>
                  <Link className="maison-stage" to={`/product/${ch.id}`}>
                    <span className="maison-stage-n">{ch.n}</span>
                    <span className="maison-stage-names">
                      <span className="maison-stage-ar" lang="ar">
                        {ch.ar}
                      </span>
                      <span className="maison-stage-en">{ch.en}</span>
                    </span>
                    <span className="maison-stage-role">{lang === "ar" ? ch.roleAr : ch.roleEn}</span>
                    {product?.image ? (
                      <img src={product.image} alt="" />
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      </Reveal>

      <Reveal>
        <section className="maison-craft">
          <p className="kicker">{c.craftKicker}</p>
          <div className="maison-craft-grid">
            <article>
              <img src={brandSrc("marahil-haute-lineup.png")} alt="" />
              <h3>{c.franceTitle}</h3>
              <p>{c.franceBody}</p>
            </article>
            <article>
              <img src={brandSrc("marahil-house-craft.png")} alt="" />
              <h3>{c.uaeTitle}</h3>
              <p>{c.uaeBody}</p>
            </article>
          </div>
        </section>
      </Reveal>

      <section className="maison-close">
        <img className="maison-close-crest" src={brandSrc("marahil-crest.png")} alt="MARAHIL" />
        <h2>{c.closeTitle}</h2>
        <div className="btn-row">
          <Link className="btn" to="/the-marahil">
            {c.enter}
          </Link>
          <Link className="btn ghost" to="/shop">
            {c.shop}
          </Link>
        </div>
        <HouseContact lang={lang} />
      </section>
    </article>
  );
}
