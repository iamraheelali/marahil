# Storefront spec — brand, products, company, cards

Payment is **not** live. The store is fully usable for browsing, cart, House Card, gift cards, and placing a **local demo order**. Gateway keys come later.

Legal line (footer, checkout, cards): **MARAHIL by Maria Raheel Khan Perfumes and Cosmetics**.

---

## What ships in `store/` (Agent mode)

Vite + React + React Router. Images copied from `brand/visuals/` plus:

- `marahil-house-card.png` — membership card
- `marahil-gift-card.png` — gift card
- `marahil-cons-hadu.png` / `sarw` / `ghusn` — pale-woods bottles
- Favicon / header: `marahil-cons-cap-top.png` and stacked lockup

Config: `src/config/payments.js`

```
enabled: false
provider: "stub"   // later: telr | paytabs | tabby
currency: "AED"
vatRate: 0.05
```

Checkout still shows a card form so the UX is real. Submit writes the order to `localStorage` and shows a confirmation. Banner: *Payment will be configured. No charge is taken.*

---

## Company profile (`/house`)

- House of MARAHIL — *مراحل* as stages of becoming
- Founder: Maria Raheel Khan
- UAE original house (own juices), English and Arabic as equals
- Atelier / contact: Abu Dhabi, UAE — studio@marahilparfums.com / press@marahilparfums.com
- Do not name other perfume houses on this page

---

## Card system

**House Card**
- Issue from `/cards` with name + email
- Number `MRK-2026-XXXX`
- Digital card UI using the pewter seal
- Optional 5% member note (not a real discount engine until payment is on)

**Gift cards**
- AED 250 / 500 / 1000 as cart SKUs
- After demo checkout, a code `MARAHIL-XXXX` is stored
- Checkout field: apply code → reduce AED total (local only)

**Payment card**
- Fields only. No PAN sent to a server.

---

## Product map

| Slug | Image | Price (AED) |
|---|---|---|
| ishraq-edp | cons-ishraq-boxed | 620 / 920 |
| maria-extrait | cons-maria-boxed | 1180 |
| first-marahil | cons-discovery | 280 |
| hadu-edp | cons-hadu | 820 / 1080 |
| sarw-edp | cons-sarw | 780 / 1020 |
| ghusn-edp | cons-ghusn | 820 / 1080 |
| pale-woods | cons-discovery | 220 |
| athar-oil | cons-body-oil | 280 |
| athar-cream | cons-cream-lid | 320 |
| athar-lotion | cons-lotion | 240 |
| wasl-attar | cons-attar | 420 |
| layl-bakhoor | cons-bakhoor | 380 |
| ishraq-candle | cons-candle | 260 |
| earrings | earrings | 890 |
| necklace | necklace | 1240 |
| rings | rings | 640–980 |
| gift-250/500/1000 | gift-card | face value |

---

## To generate the working site

Switch this chat to **Agent** (or approve the mode switch). Plan mode cannot write `.jsx` / `.html` / `package.json`.
