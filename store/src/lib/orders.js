export const ORDER_STATUSES = ["received", "processing", "packed", "shipped", "delivered", "cancelled"];

/** Only a freshly received order may be cancelled. In-process and after: no cancel. */
export function canCancel(order) {
  return (order?.status || "received") === "received";
}

export function lineName(line, lang = "en") {
  if (line?.name?.[lang]) return line.name[lang];
  if (line?.name?.en) return line.name.en;
  if (line?.product?.name?.[lang]) return line.product.name[lang];
  if (line?.product?.name?.en) return line.product.name.en;
  return line?.productId || "Item";
}

export function lineLabel(line) {
  return line?.label || line?.size?.label || line?.sizeId || "";
}

export function publicClient(row) {
  if (!row) return null;
  const { salt, hash, ...rest } = row;
  return rest;
}
