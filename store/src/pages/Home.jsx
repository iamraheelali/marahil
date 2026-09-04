import { Link } from "react-router-dom";
import { useStore } from "../context/StoreContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Reveal from "../components/Reveal.jsx";
import { STAGE_SEQUENCE } from "../data/stages.js";
import { brandSrc } from "../lib/brand.js";

export default function Home() {
  const { t, lang, catalog, testimonials, avgRating } = useStore();
  const featured = STAGE_SEQUENCE.slice(0, 4)
    .map((id) => catalog.find((p) => p.id === id))
    .filter(Boolean);

  const bands = [
    {
      kicker: lang === "ar" ? "المراحل" : "The stages",
      title: lang === "ar" ? "ستة فصول. بيت واحد." : "Six stages. One house.",
      body:
        lang === "ar"
          ? "بدء، إشراق، وصل، ليل، أثر، وماريا. الاكتشاف بجانبها."
          : "Bad’, Ishraq, Wasl, Layl, Athar, and Maria. Discovery sits beside them.",
      to: "/the-marahil",
      cta: t.enter,
      img: brandSrc("marahil-cons-lineup.png"),
      alt: "MARAHIL stages",
    },
    {
      kicker: lang === "ar" ? "صُنع في فرنسا" : "Made in France",
      title: lang === "ar" ? "بارفان أغلظ لنفس الفصول" : "Parfum — the same chapters, denser",
      body:
        lang === "ar"
          ? "إشراق ووصل كبارفان. ماريا تبقى في المراحل. أغطية سوداء وختم ذهبي."
          : "Ishraq and Wasl as Parfum. Maria remains a stage. Black caps, gold crest.",
      to: "/the-marahil",
      cta: lang === "ar" ? "البارفان" : "Haute Parfum",
      img: brandSrc("marahil-haute-lineup.png"),
      alt: "MARAHIL Parfum",
      flip: true,
    },
    {
      kicker: lang === "ar" ? "الجمال" : "Beauty",
      title: lang === "ar" ? "أثر على البشرة وفي الغرفة" : "Athar on skin and in the room",
      body:
        lang === "ar"
          ? "كريم، زيت حريري، رذاذ وبودرة. يُجمَّع في الإمارات. ختم ذهبي على أغطية سوداء."
          : "Cream, silk oil, spray, and powder. Assembled in the UAE. Gold crest on black lids.",
      to: "/rituals",
      cta: lang === "ar" ? "الجمال" : "Beauty",
      img: brandSrc("marahil-beauty-lineup.png"),
      alt: "MARAHIL Beauty",
    },
  ];

  return (
    <>
      <section className="film-hero film-hero-home">
        <img className="film-still" src={brandSrc("marahil-home-hero.png")} alt="MARAHIL Ishraq" />
        <div className="film-veil" />
        <div className="film-copy">
          <p className="kicker">{t.heroKicker}</p>
          <h1>{t.heroTitle}</h1>
          <p className="lede">{t.heroBody}</p>
          <div className="btn-row">
            <Link className="btn" to="/the-marahil">
              {t.enter}
            </Link>
            <Link className="btn ghost" to="/house">
              {t.nav.house}
            </Link>
          </div>
        </div>
        <p className="film-scroll">{lang === "ar" ? "مرّروا" : "Scroll"}</p>
      </section>

      {bands.map((b) => (
        <Reveal key={b.title}>
          <section className={`story-band${b.flip ? " is-flip" : ""}`}>
            <div className="story-band-still">
              <img src={b.img} alt={b.alt} />
            </div>
            <div className="story-band-copy">
              <p className="kicker">{b.kicker}</p>
              <h2>{b.title}</h2>
              <p className="lede">{b.body}</p>
              <Link className="btn" to={b.to}>
                {b.cta}
              </Link>
            </div>
          </section>
        </Reveal>
      ))}

      <Reveal>
        <section className="section precious">
          <p className="kicker">{lang === "ar" ? "من البيت" : "From the house"}</p>
          <h2>{lang === "ar" ? "قريب، ثابت، شخصي" : "Close, lasting, personal"}</h2>
          <p className="lede">
            {lang === "ar"
              ? "زجاجة واحدة. ختم البيت الذهبي على الغطاء والعلبة. اسم العصير يتغيّر فقط."
              : "One bottle. The gold house crest on cap and box. Only the juice name changes."}
          </p>
          <div className="grid collection-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} lang={lang} rating={avgRating(p.id)} />
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="gift-band">
          <div>
            <p className="kicker">{lang === "ar" ? "الاكتشاف" : "Discovery"}</p>
            <h2>{lang === "ar" ? "المراحل الأولى" : "The First Stages"}</h2>
            <p className="lede">
              {lang === "ar"
                ? "٢ مل من بدء وإشراق ووصل وليل وأثر، مع عينة ماريا."
                : "2ml of Bad’, Ishraq, Wasl, Layl, Athar, and a Maria sample."}
            </p>
            <Link className="btn" to="/discovery">
              {lang === "ar" ? "طقم الاكتشاف" : "Open Discovery"}
            </Link>
          </div>
          <img src={brandSrc("marahil-cons-discovery.png")} alt="The First Stages" />
        </section>
      </Reveal>

      <section className="section">
        <h2>{t.testimonials}</h2>
        <div className="grid quotes">
          {testimonials.map((r) => (
            <blockquote key={r.id} className="quote">
              <p>“{r.text[lang] || r.text.en}”</p>
              <footer>
                {r.name}
                {r.city ? ` · ${r.city}` : ""} · ★{r.rating}
              </footer>
            </blockquote>
          ))}
        </div>
        {!testimonials.length && (
          <p className="muted">{lang === "ar" ? "الشهادات تظهر بعد موافقة الإدارة." : "Testimonials appear once the admin approves them."}</p>
        )}
      </section>
    </>
  );
}
