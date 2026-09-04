import express from "express";
import cors from "cors";
import multer from "multer";
import { existsSync } from "fs";
import { extname, join } from "path";
import { dataDir, readJson, writeJson, uploadDir } from "./db.js";
import { ensureAdmin, verifyPassword, createSession, validSession, clientSession, hashPassword } from "./auth.js";
import { categories as seedCategories } from "../src/data/categories.js";
import { stripPrivate, withCosts, marginAed, marginPct } from "../src/lib/money.js";
import { canCancel, publicClient, ORDER_STATUSES } from "../src/lib/orders.js";
import { ensureTestClient } from "./clients.mjs";
import { DEFAULT_SETTINGS, normalizeSettings, publicSettings } from "../src/lib/settings.js";

if (!existsSync(join(dataDir, "products.json"))) {
  console.log("No products.json yet — seeding data/db…");
  await import("./seed.mjs");
}

ensureAdmin();
ensureTestClient();
if (!existsSync(join(dataDir, "categories.json"))) writeJson("categories.json", seedCategories);
if (!existsSync(join(dataDir, "samples.json"))) writeJson("samples.json", []);
if (!existsSync(join(dataDir, "orders.json"))) writeJson("orders.json", []);
if (!existsSync(join(dataDir, "clients.json"))) writeJson("clients.json", []);
if (!existsSync(join(dataDir, "settings.json"))) writeJson("settings.json", DEFAULT_SETTINGS);

function readSettings() {
  return normalizeSettings(readJson("settings.json", DEFAULT_SETTINGS));
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "8mb" }));
app.use("/uploads", express.static(uploadDir));

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (_req, file, cb) => {
      const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${extname(file.originalname || ".png")}`;
      cb(null, safe);
    },
  }),
});

function auth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (!validSession(token)) return res.status(401).json({ error: "Unauthorized" });
  next();
}

function clientAuth(req, res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const s = clientSession(token);
  if (!s) return res.status(401).json({ error: "Sign in to your house profile" });
  req.clientId = s.clientId;
  next();
}

function optionalClient(req, _res, next) {
  const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  const s = clientSession(token);
  if (s) req.clientId = s.clientId;
  next();
}

function findClient(id) {
  return readJson("clients.json", []).find((c) => c.id === id);
}

function slugify(value, fallback) {
  return String(value || fallback || `c-${Date.now()}`)
    .toLowerCase()
    .trim()
    .replace(/[^\w]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/settings", (_req, res) => res.json(publicSettings(readSettings())));

app.get("/api/categories", (_req, res) => res.json(readJson("categories.json", seedCategories)));

app.get("/api/products", (_req, res) => {
  const products = readJson("products.json", [])
    .filter((p) => p.published !== false)
    .map(stripPrivate);
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const p = readJson("products.json", []).find((x) => x.id === req.params.id && x.published !== false);
  if (!p) return res.status(404).json({ error: "Not found" });
  res.json(stripPrivate(p));
});

app.get("/api/reviews", (req, res) => {
  const { productId } = req.query;
  let list = readJson("reviews.json", []).filter((r) => r.status === "approved");
  if (productId) list = list.filter((r) => r.productId === productId);
  res.json(list);
});

app.get("/api/testimonials", (_req, res) => {
  const list = readJson("reviews.json", []).filter((r) => r.status === "approved" && r.featured);
  res.json(list);
});

app.post("/api/reviews", (req, res) => {
  const { productId, name, rating, text, city } = req.body || {};
  if (!productId || !text) return res.status(400).json({ error: "productId and text required" });
  const reviews = readJson("reviews.json", []);
  const row = {
    id: `r-${Date.now()}`,
    productId,
    name: String(name || "Guest").slice(0, 80),
    city: String(city || "").slice(0, 80),
    rating: Math.min(5, Math.max(1, Number(rating) || 5)),
    text: { en: String(text).slice(0, 2000), ar: String(text).slice(0, 2000) },
    at: new Date().toISOString().slice(0, 10),
    featured: false,
    status: "pending",
  };
  writeJson("reviews.json", [row, ...reviews]);
  res.json({ ok: true, id: row.id, status: "pending" });
});

app.post("/api/wholesale", (req, res) => {
  const leads = readJson("wholesale.json", []);
  const row = { id: `W-${Date.now()}`, at: new Date().toISOString(), status: "new", ...req.body };
  writeJson("wholesale.json", [row, ...leads]);
  res.json({ ok: true, id: row.id });
});

app.post("/api/admin/login", (req, res) => {
  const admin = ensureAdmin();
  const { username, password } = req.body || {};
  if (username !== admin.username || !verifyPassword(password || "", admin.salt, admin.hash)) {
    return res.status(401).json({ error: "Invalid login" });
  }
  res.json({ token: createSession(), username: admin.username });
});

app.get("/api/admin/settings", auth, (_req, res) => res.json(readSettings()));
app.patch("/api/admin/settings", auth, (req, res) => {
  const next = normalizeSettings({ ...readSettings(), megaNav: req.body?.megaNav });
  writeJson("settings.json", next);
  res.json(next);
});

app.get("/api/admin/stats", auth, (_req, res) => {
  const products = readJson("products.json", []);
  const reviews = readJson("reviews.json", []);
  const trade = readJson("wholesale.json", []);
  const samples = readJson("samples.json", []);
  const cats = readJson("categories.json", []);
  const live = products.filter((p) => p.published !== false && !p.giftValue);
  const margins = live.map((p) => marginPct(p.sizes?.[0]?.price, p.sizes?.[0]?.cost)).filter((n) => Number.isFinite(n));
  const catalogMargin = live.reduce((s, p) => s + marginAed(p.sizes?.[0]?.price, p.sizes?.[0]?.cost), 0);
  res.json({
    products: products.length,
    live: products.filter((p) => p.published !== false).length,
    hidden: products.filter((p) => p.published === false).length,
    categories: cats.length,
    pending: reviews.filter((r) => r.status === "pending").length,
    approved: reviews.filter((r) => r.status === "approved").length,
    trade: trade.length,
    tradeNew: trade.filter((t) => t.status === "new" || !t.status).length,
    samples: samples.length,
    samplesOpen: samples.filter((s) => s.status && s.status !== "closed").length,
    avgMargin: margins.length ? Math.round(margins.reduce((a, b) => a + b, 0) / margins.length) : 0,
    catalogMargin: Math.round(catalogMargin),
    clients: readJson("clients.json", []).length,
    orders: readJson("orders.json", []).length,
  });
});

app.get("/api/admin/products", auth, (_req, res) => res.json(readJson("products.json", [])));
app.post("/api/admin/products", auth, (req, res) => {
  const products = readJson("products.json", []);
  const cats = readJson("categories.json", []);
  const body = req.body || {};
  const id = String(body.id || `p-${Date.now()}`).replace(/[^\w-]/g, "-");
  const i = products.findIndex((p) => p.id === id);
  const prev = i >= 0 ? products[i] : {};
  const merged = { published: true, ...prev, ...body, id };
  const cat = cats.find((c) => c.id === merged.collection);
  const next = withCosts({
    ...merged,
    vatExempt: Boolean(merged.vatExempt || cat?.vatExempt || merged.collection === "cards"),
  });
  if (i >= 0) products[i] = next;
  else products.unshift(next);
  writeJson("products.json", products);
  res.json(next);
});
app.delete("/api/admin/products/:id", auth, (req, res) => {
  writeJson(
    "products.json",
    readJson("products.json", []).filter((p) => p.id !== req.params.id)
  );
  res.json({ ok: true });
});

app.get("/api/admin/categories", auth, (_req, res) => res.json(readJson("categories.json", seedCategories)));
app.post("/api/admin/categories", auth, (req, res) => {
  const cats = readJson("categories.json", []);
  const body = req.body || {};
  const id = slugify(body.id || body.name?.en, `c-${Date.now()}`);
  const row = {
    id,
    name: { en: body.name?.en || id, ar: body.name?.ar || "" },
    blurb: { en: body.blurb?.en || "", ar: body.blurb?.ar || "" },
    vatExempt: Boolean(body.vatExempt),
    sort: Number(body.sort) || cats.length + 1,
  };
  const i = cats.findIndex((c) => c.id === id);
  if (i >= 0) cats[i] = { ...cats[i], ...row, id: cats[i].id };
  else cats.push(row);
  cats.sort((a, b) => (a.sort || 0) - (b.sort || 0));
  writeJson("categories.json", cats);
  res.json(row);
});
app.delete("/api/admin/categories/:id", auth, (req, res) => {
  const used = readJson("products.json", []).filter((p) => p.collection === req.params.id);
  if (used.length) return res.status(400).json({ error: `Move or delete ${used.length} products first` });
  writeJson(
    "categories.json",
    readJson("categories.json", []).filter((c) => c.id !== req.params.id)
  );
  res.json({ ok: true });
});

app.get("/api/admin/samples", auth, (_req, res) => res.json(readJson("samples.json", [])));
app.post("/api/admin/samples", auth, (req, res) => {
  const rows = readJson("samples.json", []);
  const body = req.body || {};
  const id = String(body.id || `S-${Date.now()}`).replace(/[^\w-]/g, "-");
  const next = { foc: true, status: "requested", items: [], ...body, id };
  const i = rows.findIndex((r) => r.id === id);
  if (i >= 0) rows[i] = { ...rows[i], ...next };
  else rows.unshift(next);
  writeJson("samples.json", rows);
  res.json(next);
});
app.delete("/api/admin/samples/:id", auth, (req, res) => {
  writeJson(
    "samples.json",
    readJson("samples.json", []).filter((s) => s.id !== req.params.id)
  );
  res.json({ ok: true });
});

app.get("/api/admin/reviews", auth, (_req, res) => res.json(readJson("reviews.json", [])));
app.patch("/api/admin/reviews/:id", auth, (req, res) => {
  const reviews = readJson("reviews.json", []);
  const i = reviews.findIndex((r) => r.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Not found" });
  reviews[i] = { ...reviews[i], ...req.body, id: reviews[i].id };
  writeJson("reviews.json", reviews);
  res.json(reviews[i]);
});
app.delete("/api/admin/reviews/:id", auth, (req, res) => {
  writeJson(
    "reviews.json",
    readJson("reviews.json", []).filter((r) => r.id !== req.params.id)
  );
  res.json({ ok: true });
});

app.get("/api/admin/wholesale", auth, (_req, res) => res.json(readJson("wholesale.json", [])));
app.patch("/api/admin/wholesale/:id", auth, (req, res) => {
  const rows = readJson("wholesale.json", []);
  const i = rows.findIndex((r) => r.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Not found" });
  rows[i] = { ...rows[i], ...req.body, id: rows[i].id };
  writeJson("wholesale.json", rows);
  res.json(rows[i]);
});

app.post("/api/admin/upload", auth, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.get("/api/admin/clients", auth, (_req, res) => {
  res.json(readJson("clients.json", []).map(publicClient));
});
app.get("/api/admin/orders", auth, (req, res) => {
  const { clientId } = req.query;
  let rows = readJson("orders.json", []);
  if (clientId) rows = rows.filter((o) => o.clientId === clientId);
  res.json(rows);
});
app.patch("/api/admin/orders/:id", auth, (req, res) => {
  const rows = readJson("orders.json", []);
  const i = rows.findIndex((o) => o.id === req.params.id);
  if (i < 0) return res.status(404).json({ error: "Not found" });
  const status = req.body?.status;
  if (status && !ORDER_STATUSES.includes(status)) return res.status(400).json({ error: "Invalid status" });
  rows[i] = { ...rows[i], ...req.body, id: rows[i].id };
  writeJson("orders.json", rows);
  res.json(rows[i]);
});

app.post("/api/client/register", (req, res) => {
  const { name, email, password, phone, address, city } = req.body || {};
  const mail = String(email || "").trim().toLowerCase();
  if (!name || !mail || !password || String(password).length < 8) {
    return res.status(400).json({ error: "Name, email, and a password of 8+ characters are required" });
  }
  const clients = readJson("clients.json", []);
  if (clients.some((c) => c.email === mail)) return res.status(400).json({ error: "This email already has a house profile" });
  const row = {
    id: `c-${Date.now()}`,
    email: mail,
    name: String(name).slice(0, 80),
    phone: String(phone || "").slice(0, 40),
    address: String(address || "").slice(0, 200),
    city: String(city || "Abu Dhabi").slice(0, 80),
    created: new Date().toISOString(),
    ...hashPassword(String(password)),
  };
  writeJson("clients.json", [row, ...clients]);
  res.json({ token: createSession({ role: "client", clientId: row.id }), client: publicClient(row) });
});

app.post("/api/client/login", (req, res) => {
  const mail = String(req.body?.email || "").trim().toLowerCase();
  const password = String(req.body?.password || "");
  const row = readJson("clients.json", []).find((c) => c.email === mail);
  if (!row || !verifyPassword(password, row.salt, row.hash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }
  res.json({ token: createSession({ role: "client", clientId: row.id }), client: publicClient(row) });
});

app.get("/api/client/me", clientAuth, (req, res) => {
  const row = findClient(req.clientId);
  if (!row) return res.status(404).json({ error: "Profile not found" });
  res.json(publicClient(row));
});

app.patch("/api/client/me", clientAuth, (req, res) => {
  const clients = readJson("clients.json", []);
  const i = clients.findIndex((c) => c.id === req.clientId);
  if (i < 0) return res.status(404).json({ error: "Profile not found" });
  const { name, phone, address, city } = req.body || {};
  clients[i] = {
    ...clients[i],
    name: name != null ? String(name).slice(0, 80) : clients[i].name,
    phone: phone != null ? String(phone).slice(0, 40) : clients[i].phone,
    address: address != null ? String(address).slice(0, 200) : clients[i].address,
    city: city != null ? String(city).slice(0, 80) : clients[i].city,
  };
  writeJson("clients.json", clients);
  res.json(publicClient(clients[i]));
});

app.get("/api/client/orders", clientAuth, (req, res) => {
  res.json(readJson("orders.json", []).filter((o) => o.clientId === req.clientId));
});

app.get("/api/client/orders/:id", clientAuth, (req, res) => {
  const order = readJson("orders.json", []).find((o) => o.id === req.params.id && o.clientId === req.clientId);
  if (!order) return res.status(404).json({ error: "Not found" });
  res.json(order);
});

app.post("/api/client/orders/:id/cancel", clientAuth, (req, res) => {
  const rows = readJson("orders.json", []);
  const i = rows.findIndex((o) => o.id === req.params.id && o.clientId === req.clientId);
  if (i < 0) return res.status(404).json({ error: "Not found" });
  if (!canCancel(rows[i])) {
    return res.status(400).json({ error: "This order is already in process and cannot be cancelled." });
  }
  rows[i] = { ...rows[i], status: "cancelled", cancelledAt: new Date().toISOString() };
  writeJson("orders.json", rows);
  res.json(rows[i]);
});

app.post("/api/orders", optionalClient, (req, res) => {
  const body = req.body || {};
  const profile = req.clientId ? findClient(req.clientId) : null;
  const customer = {
    name: body.customer?.name || profile?.name || "",
    email: body.customer?.email || profile?.email || "",
    phone: body.customer?.phone || profile?.phone || "",
    address: body.customer?.address || profile?.address || "",
    city: body.customer?.city || profile?.city || "Abu Dhabi",
  };
  if (!customer.name || !customer.email) return res.status(400).json({ error: "Name and email required" });
  const lines = Array.isArray(body.lines) ? body.lines : [];
  const order = {
    id: `MRL-${Date.now().toString(36).toUpperCase()}`,
    clientId: req.clientId || null,
    status: "received",
    payment: "stub",
    at: new Date().toISOString(),
    customer,
    lines,
    subtotal: Number(body.subtotal) || 0,
    taxableSubtotal: Number(body.taxableSubtotal) || 0,
    giftCredit: Number(body.giftCredit) || 0,
    vat: Number(body.vat) || 0,
    total: Number(body.total) || 0,
    issuedGifts: body.issuedGifts || [],
  };
  writeJson("orders.json", [order, ...readJson("orders.json", [])]);
  res.json(order);
});

const port = Number(process.env.PORT || 8787);
app.listen(port, () => console.log(`MARAHIL API http://localhost:${port}`));
