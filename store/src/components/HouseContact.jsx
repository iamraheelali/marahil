import { EMAILS, HOUSE_PLACE } from "../data/house.js";

export default function HouseContact({ lang = "en", trade = false, orders = false }) {
  const items = [EMAILS.studio, EMAILS.press];
  if (orders) items.push(EMAILS.orders);
  if (trade) items.push(EMAILS.trade);

  return (
    <p className="foot-mail">
      {items.map((mail, i) => (
        <span key={mail}>
          {i > 0 ? <span aria-hidden="true"> · </span> : null}
          <a className="mail-link" href={`mailto:${mail}`}>
            {mail}
          </a>
        </span>
      ))}
      <span aria-hidden="true"> · </span>
      <span>{lang === "ar" ? HOUSE_PLACE.ar : HOUSE_PLACE.en}</span>
    </p>
  );
}
