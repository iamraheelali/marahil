import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as fallbackProducts } from "../data/products.js";
import { categories as seedCategories } from "../data/categories.js";
import { seedReviews } from "../data/testimonials.js";
import { payments } from "../config/payments.js";
import { copy } from "../data/i18n.js";
import { api } from "../api.js";
import { stripPrivate } from "../lib/money.js";

const clientKey = "marahil-client-token";

const Store = createContext(null);
const load = (k, d) => {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
};

const approvedSeed = seedReviews.filter((r) => r.status === "approved");
const featuredSeed = approvedSeed.filter((r) => r.featured);

export function StoreProvider({ children }) {
  const [lang, setLang] = useState(() => load("marahil-lang", "en"));
  const [cart, setCart] = useState(() => load("marahil-cart", []));
  const [houseCard, setHouseCard] = useState(() => load("marahil-house-card", null));
  const [giftCodes, setGiftCodes] = useState(() => load("marahil-gifts", []));
  const [appliedGift, setAppliedGift] = useState(null);
  const [orders, setOrders] = useState(() => load("marahil-orders", []));
  const [clientToken, setClientToken] = useState(() => sessionStorage.getItem(clientKey) || "");
  const [client, setClient] = useState(null);
  const [clientOrders, setClientOrders] = useState([]);
  const [catalog, setCatalog] = useState(() => fallbackProducts.map(stripPrivate));
  const [reviews, setReviews] = useState(approvedSeed);
  const [testimonials, setTestimonials] = useState(featuredSeed);
  const [categories, setCategories] = useState(seedCategories);

  useEffect(() => localStorage.setItem("marahil-lang", JSON.stringify(lang)), [lang]);
  useEffect(() => localStorage.setItem("marahil-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("marahil-house-card", JSON.stringify(houseCard)), [houseCard]);
  useEffect(() => localStorage.setItem("marahil-gifts", JSON.stringify(giftCodes)), [giftCodes]);
  useEffect(() => localStorage.setItem("marahil-orders", JSON.stringify(orders)), [orders]);

  const refreshPublic = () => {
    api.products().then((rows) => {
      if (Array.isArray(rows) && rows.length) setCatalog(rows.map(stripPrivate));
    }).catch(() => {});
    api.categories().then((rows) => {
      if (Array.isArray(rows) && rows.length) setCategories(rows);
    }).catch(() => {});
    api.reviews().then((rows) => {
      if (Array.isArray(rows) && rows.length) setReviews(rows);
    }).catch(() => {});
    api.testimonials().then((rows) => {
      if (Array.isArray(rows) && rows.length) setTestimonials(rows);
    }).catch(() => {});
  };

  useEffect(() => {
    refreshPublic();
  }, []);

  const persistClient = (token, profile) => {
    if (token) sessionStorage.setItem(clientKey, token);
    else sessionStorage.removeItem(clientKey);
    setClientToken(token || "");
    setClient(profile || null);
    if (!token) setClientOrders([]);
  };

  const refreshClient = () => {
    if (!clientToken) {
      setClient(null);
      setClientOrders([]);
      return;
    }
    api.clientMe(clientToken).then(setClient).catch(() => persistClient("", null));
    api.clientOrders(clientToken).then(setClientOrders).catch(() => {});
  };

  useEffect(() => {
    refreshClient();
  }, [clientToken]);

  const t = copy[lang];
  const dir = lang === "ar" ? "rtl" : "ltr";
  const getProduct = (id) => catalog.find((p) => p.id === id);

  const add = (productId, sizeId, qty = 1, custom = null) => {
    const p = getProduct(productId);
    if (!p) return;
    const size = p.sizes.find((s) => s.id === sizeId) || p.sizes[0];
    setCart((prev) => {
      if (custom) {
        return [
          ...prev,
          {
            productId,
            sizeId: size.id,
            qty,
            price: size.price,
            custom,
            customId: `c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          },
        ];
      }
      const i = prev.findIndex((x) => !x.custom && x.productId === productId && x.sizeId === size.id);
      if (i >= 0) {
        const next = [...prev];
        next[i] = { ...next[i], qty: next[i].qty + qty };
        return next;
      }
      return [...prev, { productId, sizeId: size.id, qty, price: size.price }];
    });
  };

  const remove = (productId, sizeId, customId) =>
    setCart((prev) =>
      prev.filter((x) => (customId ? x.customId !== customId : !(x.productId === productId && x.sizeId === sizeId && !x.custom)))
    );

  const lines = cart.map((item) => {
    const p = getProduct(item.productId);
    const size = p?.sizes.find((s) => s.id === item.sizeId);
    return { ...item, product: p, size, line: (size?.price || 0) * item.qty, custom: item.custom, customId: item.customId };
  });

  const subtotal = lines.reduce((s, l) => s + l.line, 0);
  const taxableSubtotal = lines.reduce(
    (s, l) => s + (l.product?.vatExempt || l.product?.giftValue ? 0 : l.line),
    0
  );
  const giftCredit = Math.min(appliedGift?.remaining || 0, subtotal);
  const taxableAfterGift = Math.max(0, taxableSubtotal - Math.min(giftCredit, taxableSubtotal));
  const vat = Number((taxableAfterGift * payments.vatRate).toFixed(2));
  const total = Number((subtotal - giftCredit + vat).toFixed(2));

  const applyGift = (code) => {
    const found = giftCodes.find((g) => g.code.toUpperCase() === code.trim().toUpperCase() && g.remaining > 0);
    setAppliedGift(found || null);
    return Boolean(found);
  };

  const issueHouseCard = (name, email) => {
    const num = `MRK-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const card = { name, email, number: num, issued: new Date().toISOString() };
    setHouseCard(card);
    return card;
  };

  const snapshotLines = () =>
    lines.map((l) => ({
      productId: l.productId,
      sizeId: l.sizeId,
      qty: l.qty,
      price: l.price || l.size?.price || 0,
      line: l.line,
      label: l.size?.label,
      name: l.product?.name,
      vatExempt: Boolean(l.product?.vatExempt || l.product?.giftValue),
      custom: l.custom || null,
      customId: l.customId,
    }));

  const placeOrder = async (customer) => {
    const idFallback = `MRL-${Date.now().toString(36).toUpperCase()}`;
    const issuedGifts = lines
      .filter((l) => l.product?.giftValue)
      .flatMap((l) =>
        Array.from({ length: l.qty }, () => ({
          code: `MARAHIL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
          remaining: l.product.giftValue,
        }))
      );
    if (issuedGifts.length) setGiftCodes((g) => [...g, ...issuedGifts]);
    if (appliedGift && giftCredit) {
      setGiftCodes((g) =>
        g.map((x) => (x.code === appliedGift.code ? { ...x, remaining: x.remaining - giftCredit } : x))
      );
    }
    const payload = {
      customer,
      lines: snapshotLines(),
      subtotal,
      taxableSubtotal,
      giftCredit,
      vat,
      total,
      issuedGifts,
    };
    let order;
    try {
      order = await api.placeOrder(clientToken, payload);
    } catch {
      order = { id: idFallback, status: "received", at: new Date().toISOString(), clientId: client?.id || null, ...payload, payment: "stub" };
    }
    if (clientToken) setClientOrders((o) => [order, ...o.filter((x) => x.id !== order.id)]);
    else setOrders((o) => [order, ...o]);
    setCart([]);
    setAppliedGift(null);
    return order;
  };

  const registerClient = async (body) => {
    const { token, client: profile } = await api.clientRegister(body);
    persistClient(token, profile);
    const rows = await api.clientOrders(token);
    setClientOrders(rows);
    return profile;
  };

  const signInClient = async (email, password) => {
    const { token, client: profile } = await api.clientLogin(email, password);
    persistClient(token, profile);
    const rows = await api.clientOrders(token);
    setClientOrders(rows);
    return profile;
  };

  const signOutClient = () => persistClient("", null);

  const saveProfile = async (body) => {
    const profile = await api.saveClientProfile(clientToken, body);
    setClient(profile);
    return profile;
  };

  const cancelOrder = async (id) => {
    const next = await api.cancelOrder(clientToken, id);
    setClientOrders((rows) => rows.map((o) => (o.id === id ? next : o)));
    return next;
  };

  const getOrder = (id) => clientOrders.find((o) => o.id === id) || orders.find((o) => o.id === id);

  const reviewsFor = (productId) => reviews.filter((r) => r.productId === productId);
  const avgRating = (productId) => {
    const list = reviewsFor(productId);
    if (!list.length) return 0;
    return list.reduce((s, r) => s + r.rating, 0) / list.length;
  };
  const addReview = async (productId, { name, rating, text, city }) => {
    await api.postReview({ productId, name, rating, text, city });
    return true;
  };
  const addTradeLead = async (lead) => api.wholesale(lead);

  const byCollection = (c) => catalog.filter((p) => p.collection === c);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      dir,
      catalog,
      categories,
      getProduct,
      byCollection,
      cart,
      lines,
      add,
      remove,
      subtotal,
      taxableSubtotal,
      vat,
      total,
      giftCredit,
      applyGift,
      appliedGift,
      giftCodes,
      houseCard,
      issueHouseCard,
      placeOrder,
      orders,
      client,
      clientToken,
      clientOrders,
      registerClient,
      signInClient,
      signOutClient,
      saveProfile,
      cancelOrder,
      getOrder,
      refreshClient,
      payments,
      reviews,
      reviewsFor,
      avgRating,
      addReview,
      testimonials,
      addTradeLead,
      refreshPublic,
    }),
    [lang, t, dir, catalog, categories, cart, lines, subtotal, taxableSubtotal, vat, total, giftCredit, appliedGift, giftCodes, houseCard, orders, reviews, testimonials, client, clientToken, clientOrders]
  );

  return <Store.Provider value={value}>{children}</Store.Provider>;
}

export const useStore = () => useContext(Store);
