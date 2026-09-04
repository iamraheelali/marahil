import { useState } from "react";
import { useStore } from "../context/StoreContext.jsx";

export default function Wholesale() {
  const { t, lang, addTradeLead } = useStore();
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({
    kind: "retailer",
    company: "",
    contact: "",
    email: "",
    phone: "",
    city: "Abu Dhabi",
    volume: "",
    notes: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <section className="section split">
      <div>
        <div className="kicker">{t.wholesaleNav}</div>
        <h2>{t.wholesale}</h2>
        <p className="lede">
          {lang === "ar"
            ? "للتجار والسبا ومن يريد شراء الزيوت بالجملة. الشراكة مع متاجر التجزئة في الإمارات والخليج."
            : "For retailers, spas, and bulk Oils. Partnerships with shops in the UAE and the Gulf."}
        </p>
        <p>
          {lang === "ar"
            ? "العطور الراقية تُصنع في فرنسا. الزيوت والكريمات والبخور والشموع تُجمَّع في الإمارات. الحد الأدنى للجملة يُحدَّد بعد الطلب."
            : "Haute Parfums are Made in France. Oils, Creams, Bakhoor and Scented Candles are assembled in the UAE. Minimums set after enquiry."}
        </p>
        <p className="muted">trade@marahilparfums.com · Abu Dhabi</p>
      </div>
      {sent ? (
        <p className="notice">{lang === "ar" ? "وصل طلبكم للإدارة." : "Enquiry received. The admin portal will see it."}</p>
      ) : (
        <form
          className="form"
          onSubmit={async (e) => {
            e.preventDefault();
            await addTradeLead(form);
            setSent(true);
          }}
        >
          <select value={form.kind} onChange={set("kind")}>
            <option value="retailer">{lang === "ar" ? "شراكة تجزئة" : "Retail partnership"}</option>
            <option value="samples">{lang === "ar" ? "عينات تجارية كاملة" : "Full trade samples"}</option>
            <option value="bulk-oil">{lang === "ar" ? "زيوت بالجملة" : "Bulk Oils"}</option>
            <option value="wholesale">{lang === "ar" ? "جملة عامة" : "General wholesale"}</option>
            <option value="spa">{lang === "ar" ? "سبا / فندق" : "Spa / hotel"}</option>
          </select>
          <input required placeholder={lang === "ar" ? "الشركة" : "Company"} value={form.company} onChange={set("company")} />
          <input required placeholder={t.name} value={form.contact} onChange={set("contact")} />
          <input required type="email" placeholder={t.email} value={form.email} onChange={set("email")} />
          <input required placeholder={t.phone} value={form.phone} onChange={set("phone")} />
          <input placeholder={t.city} value={form.city} onChange={set("city")} />
          <input placeholder={lang === "ar" ? "الكمية التقريبية" : "Approx. volume"} value={form.volume} onChange={set("volume")} />
          <textarea rows={4} placeholder={lang === "ar" ? "تفاصيل" : "Notes"} value={form.notes} onChange={set("notes")} />
          <button className="btn" type="submit">{lang === "ar" ? "إرسال" : "Send enquiry"}</button>
        </form>
      )}
    </section>
  );
}
