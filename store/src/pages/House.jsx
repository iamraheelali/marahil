import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";

export default function House() {
  const { t } = useStore();
  return (
    <section className="section story">
      <div className="kicker">{t.storyKicker}</div>
      <h1 className="story-heading">{t.storyTitle}</h1>
      <img
        className="story-logo"
        src={brandSrc("marahil-lockup-stacked-ivory.png")}
        alt="MARAHIL (مراحل) by Maria Raheel Khan"
      />
      <p className="lede story-lede">{t.storyP1}</p>
      <p className="story-lede">{t.storyP2}</p>
      <p className="muted story-lede">{t.storyP3}</p>
      <div className="story-aside">
        <img src={brandSrc("marahil-cons-cap-top.png")} alt="MARAHIL MRK seal" />
        <img src={brandSrc("marahil-direction-c-founder.png")} alt="Maria Raheel Khan" />
      </div>
      <p className="muted">studio@marahilparfums.com · press@marahilparfums.com · Abu Dhabi, UAE</p>
    </section>
  );
}
