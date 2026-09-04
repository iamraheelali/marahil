---
name: marahil-admin
description: Maintains the MARAHIL house store, JSON catalog, branding rules, and the unlisted /admin management desk. Use when editing products, reviews, admin portal, storefront branding, prices, or the MARAHIL JSON database.
---

# MARAHIL house desk

## Route

`/admin` is the management portal. Do **not** add a public nav or footer link to it.

Login: `admin` / env `MARAHIL_ADMIN_PASSWORD` (default `MarahilAdmin2026!`). Hash in `store/data/db/admin.json`.

## Data

Filesystem JSON, not a hosted SQL db:

- `store/data/db/products.json` — catalog (edit via admin or `src/data/products.js` then `npm run seed`)
- `store/data/db/categories.json` — product categories (add / edit / delete if empty)
- `store/data/db/samples.json` — trade sample books (house cost + VAT)
- `store/data/db/reviews.json` — ratings; public sees `status: approved` only; Home testimonials need `featured: true`
- `store/data/db/clients.json` — house client profiles (hashed passwords)
- `store/data/db/orders.json` — orders with status (`received` can cancel; `processing` and after cannot)
- `store/data/uploads/` — uploaded stills (`/uploads/...`)
- API: `store/server/index.js` on port 8787; Vite proxies `/api` and `/uploads`

After changing seed sources, run `npm run seed` from `store/`. Seed overwrites products, categories, and reviews. It does **not** overwrite `admin.json` if present.

## Branding (do not drift)

- House **MARAHIL** / **مراحل**. Juices are chapter names. Never a SKU named only Marahil.
- Colours: Ink `#1A1614`, Ivory `#F4EFE6`, Pewter `#8A8580`, Stage red `#6B2A28` as a 1px hairline only.
- Pewter metal only. Juice name on the plaque, never inside the MRK seal.
- Spelling: Perfumes, Parfum, Eau de Parfum, Beauty, Jewellery, Bakhoor, Scented Candles, Oils, Creams.
- Founded Abu Dhabi. French haute Parfum/Extrait; everyday, Beauty, Oils assembled in the UAE.
- Bottle / box hardware: pewter MRK seal only. Jewellery may offer **silver finish** and **gold finish** (champagne plate); never put yellow gold on the cap.
- Prices excl. VAT; bag adds UAE 5% on goods; gift cards VAT-exempt.
- Header: MARAHIL over مراحل, no cropped cap logo. Admin stays off public chrome.

## Admin capabilities

Overview stats, **categories** (add / edit / delete when empty), products grouped by category, bilingual create/edit/hide/delete, **cost price (house only)** and **margin** vs sell excl. VAT, VAT 5% / exempt, multi-image upload, review approve/reject/feature/delete, trade leads, **full trade samples** (pack house set, FOC or invoiced with VAT), **clients** and order status.

Public `GET /api/products` strips `cost` / original price. Never show house cost on the storefront.

## Clients

Public `/account`: register, sign in, profile, order history. Cancel is allowed only while status is `received`. Once `processing` (or packed/shipped/delivered) the cancel button is hidden and the API rejects it.

Test profile (seeded, not wiped): `layla@marahil.test` / `MarahilClient2026!` — delivered, in-process, and received orders.
