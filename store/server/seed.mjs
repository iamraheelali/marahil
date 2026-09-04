import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { products } from "../src/data/products.js";
import { categories } from "../src/data/categories.js";
import { getProfile } from "../src/data/profiles.js";
import { seedReviews } from "../src/data/testimonials.js";
import { hashPassword } from "./auth.js";
import { withCosts } from "../src/lib/money.js";
import { ensureTestClient } from "./clients.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const db = join(root, "data", "db");
mkdirSync(db, { recursive: true });
mkdirSync(join(root, "data", "uploads"), { recursive: true });

const catalogOnly = process.argv.includes("--catalog-only");
const existingFile = join(db, "products.json");
const keptCost = new Map();
const keptPublished = new Map();
if (existsSync(existingFile)) {
  for (const row of JSON.parse(readFileSync(existingFile, "utf8"))) {
    keptPublished.set(row.id, row.published);
    for (const size of row.sizes || []) {
      if (size.cost != null && size.cost !== "") keptCost.set(`${row.id}:${size.id}`, Number(size.cost));
    }
  }
}

const catalog = products.map((p) =>
  withCosts({
    ...p,
    published: keptPublished.has(p.id) ? keptPublished.get(p.id) : true,
    profile: getProfile(p.id),
    sizes: (p.sizes || []).map((s) => ({
      ...s,
      ...(keptCost.has(`${p.id}:${s.id}`) ? { cost: keptCost.get(`${p.id}:${s.id}`) } : {}),
    })),
  })
);

writeFileSync(join(db, "products.json"), JSON.stringify(catalog, null, 2));
writeFileSync(join(db, "categories.json"), JSON.stringify(categories, null, 2));

if (catalogOnly) {
  console.log(`Wrote ${catalog.length} products and ${categories.length} categories. Reviews, admin, and clients untouched.`);
  process.exit(0);
}

const reviews = seedReviews.map((r) => ({ ...r, status: r.status || "approved" }));
writeFileSync(join(db, "reviews.json"), JSON.stringify(reviews, null, 2));
if (!existsSync(join(db, "wholesale.json"))) writeFileSync(join(db, "wholesale.json"), "[]");
if (!existsSync(join(db, "samples.json"))) writeFileSync(join(db, "samples.json"), "[]");
if (!existsSync(join(db, "sessions.json"))) writeFileSync(join(db, "sessions.json"), "[]");
if (!existsSync(join(db, "admin.json"))) {
  const password = process.env.MARAHIL_ADMIN_PASSWORD || "MarahilAdmin2026!";
  writeFileSync(join(db, "admin.json"), JSON.stringify({ username: "admin", ...hashPassword(password) }, null, 2));
}
ensureTestClient();
console.log("Seeded catalog, categories, reviews. Test client layla@marahil.test if missing.");
