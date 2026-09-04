import { useStore } from "../context/StoreContext.jsx";
import { brandSrc } from "../lib/brand.js";
import Reveal from "../components/Reveal.jsx";
import { Link } from "react-router-dom";

export default function House() {
  const { t } = useStore();
  return (
    <>
      <section className="film-hero film-hero-short">
        <img className="film-still" src={brandSrc("marahil-direction-c-founder.png")} alt="Maria Raheel Khan" />
        <div className="film-veil" />
        <div className="film-copy">
          <p className="kicker">{t.storyKicker}</p>
          <h1>{t.storyTitle}</h1>
        </div>
      </section>
      <Reveal>
        <section className="section story">
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
          <div className="btn-row" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="btn" to="/the-marahil">
              {t.enter}
            </Link>
          </div>
        </section>
      </Reveal>
    </>
  );
}

