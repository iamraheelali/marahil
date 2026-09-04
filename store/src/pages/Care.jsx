import { useStore } from "../context/StoreContext.jsx";
import HouseContact from "../components/HouseContact.jsx";

export default function Care() {
  const { lang } = useStore();
  return (
    <section className="section">
      <h2>Authenticity & care</h2>
      <p className="lede">
        Haute Parfum is made in France (Eau de Parfum, Parfum, Extrait). Everyday editions, Beauty, and Jewellery
        are assembled in the UAE, from the same juice. Look for the faceted bottle, the black cap with the gold
        MARAHIL crest, and the circular house mark.
      </p>
      <p>
        Custom atelier juices are original MARAHIL formulas. An inspired brief describes a mood or notes you love; we do
        not print another house’s name on the bottle, copy its packaging, or sell counterfeits.
      </p>
      <p>
        Store Perfumes away from sun and heat. Bakhoor is for the burner, not the skin. Oils and Creams layer under Eau
        de Parfum. Scented Candles: trim the wick. IFRA and INCI lists follow once each juice is compounded.
      </p>
      <p className="muted">Founded in Abu Dhabi. Listed prices exclude VAT. The bag adds UAE VAT at 5% on goods; gift cards are store credit with no VAT.</p>
      <HouseContact lang={lang} orders />
    </section>
  );
}
