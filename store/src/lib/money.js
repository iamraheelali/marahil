export const VAT_RATE = 0.05;

export function isVatExempt(product) {
  return Boolean(product?.vatExempt || product?.giftValue || product?.collection === "cards");
}

export function vatAmount(price, exempt) {
  const p = Number(price) || 0;
  if (exempt) return 0;
  return Math.round(p * VAT_RATE * 100) / 100;
}

export function priceInclVat(price, exempt) {
  return (Number(price) || 0) + vatAmount(price, exempt);
}

export function marginAed(price, cost) {
  return (Number(price) || 0) - (Number(cost) || 0);
}

export function marginPct(price, cost) {
  const p = Number(price) || 0;
  if (!p) return 0;
  return (marginAed(price, cost) / p) * 100;
}

export function defaultCost(product, size) {
  const price = Number(size?.price) || 0;
  if (product?.giftValue || product?.collection === "cards") return price;
  const rates = {
    atelier: 0.42,
    haute: 0.52,
    rituals: 0.38,
    home: 0.38,
    custom: 0.48,
    discovery: 0.4,
    cards: 0,
  };
  let rate = rates[product?.collection] ?? 0.33;
  if (product?.id === "maria-extrait") rate = 0.36;
  if (String(size?.id || "").startsWith("fr-")) rate = 0.52;
  return Math.round(price * rate);
}

export function withCosts(product) {
  return {
    ...product,
    sizes: (product.sizes || []).map((s) => ({
      ...s,
      cost: s.cost != null && s.cost !== "" ? Number(s.cost) : defaultCost(product, s),
    })),
  };
}

/** Strip house cost so the public catalog never sees original price. */
export function stripPrivate(product) {
  if (!product) return product;
  const { cost, ...rest } = product;
  return {
    ...rest,
    sizes: (product.sizes || []).map((s) => {
      const { cost: _c, costPrice, original, originalPrice, ...keep } = s;
      return keep;
    }),
  };
}

export function aed(n) {
  return `AED ${Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
