# Website IA and hosting notes

Documented now. **Not built in this phase.** Identity in the brand kit comes first.

---

## What the site must feel like

A house, not a catalogue. Collection is *The Marahil* (stages), not a filter grid of random SKUs.  
Bilingual **English and Arabic** with real RTL. AED first. UAE-first shipping.

Study: [Amouage](https://amouage.com/) (story), [Initio UAE](https://ae.initioparfums.com/) (rituals), [Rasasi](https://rasasi.com/) (Arabic as equal).

---

## Sitemap

| EN | AR (working) | Job |
|---|---|---|
| Home | الرئيسية | Film/still of the bottle, one hero juice (Maria), enter The Marahil |
| The House | البيت | Founder Maria Raheel Khan, meaning of مراحل |
| The Marahil | المراحل | The five + Maria |
| Juice PDP | صفحة العطر | Notes, layering, matching hair/body, sizes |
| Discovery | الاكتشاف | The First Marahil set |
| Rituals | الطقوس | Hair mist, body oil (Athar, Maria) |
| Journal | المفكرة | Short essays, not a SEO blog farm |
| Atelier / Contact | المرسم | Dubai/UAE, press, wholesale later |
| Authenticity & care | الأصالة والعناية | IFRA, ingredients, how to spot the house codes |
| Legal | قانوني | Privacy (PDPL), terms, VAT, shipping |

Checkout, account, and order tracking in both languages.

---

## Hosting (UAE)

“UAE hosted” and “Shopify” are not the same thing.

| Option | Fit |
|---|---|
| **Shopify** | Fastest bilingual theme path. Telr / PayTabs / Tabby via apps. **Data is not in a UAE region.** Shopify Payments is not available in the UAE (gateway + extra platform fees). |
| **Azure UAE North or AWS me-central-1** | True UAE origin. Custom Next.js (or headless) + Telr/PayTabs + Tabby + COD. Matches a literal “hosted in the UAE” claim and PDPL-friendlier architecture. |
| Etisalat / du / Khazna | Local alternative if you want a UAE operator, not a hyperscaler. |

**Recommendation for this house:** when you build, put the storefront and checkout origin in **Azure UAE North** (or AWS UAE). Cloudflare in front is fine; origin stays in the UAE.

Payments later: Telr or PayTabs, Tabby, COD, Aramex / Emirates Post. VAT and trade license on the go-live checklist — not this file.

---

## Domain on the site

Primary: **marahilparfums.com** (see [02-naming-and-lockups.md](02-naming-and-lockups.md)).  
Redirect thehouseofmarahil.com. Do not market marahil.com.

Language switcher: `EN` / `ع` in the header next to the stacked lockup. Avatar/favicon = MRK seal.
