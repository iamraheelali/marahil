/** Works in Vite and in Node seed (where import.meta.env is absent). */
export const IMAGE_VER = "20260904aa";

export function assetBase() {
  const base = (import.meta.env && import.meta.env.BASE_URL) || "/";
  return base.endsWith("/") ? base : `${base}/`;
}

/** Prefix Vite base and cache-bust house stills. Uploads stay on origin `/uploads`. */
export function publicSrc(path) {
  if (!path) return path;
  const raw = String(path);
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw;
  const [pathname, existing] = raw.split("?");
  let p = pathname.replace(/^\//, "");
  const base = assetBase();
  const prefix = base.replace(/^\/|\/$/g, "");
  if (prefix && (p === prefix || p.startsWith(`${prefix}/`))) {
    p = p.slice(prefix.length).replace(/^\//, "");
  }
  const q = existing ? `${existing}&v=${IMAGE_VER}` : `v=${IMAGE_VER}`;
  if (p.startsWith("uploads/")) return `/${p}?${q}`;
  return `${base}${p}?${q}`;
}

export function brandSrc(file) {
  const name = String(file).replace(/^\/brand\//, "").replace(/^brand\//, "");
  return publicSrc(`brand/${name}`);
}

export function withPublicImages(product) {
  if (!product) return product;
  const next = { ...product };
  if (next.image) next.image = publicSrc(next.image);
  if (Array.isArray(next.images)) next.images = next.images.map((src) => publicSrc(src));
  if (next.finishImages && typeof next.finishImages === "object") {
    next.finishImages = Object.fromEntries(
      Object.entries(next.finishImages).map(([k, v]) => [k, v ? publicSrc(v) : v])
    );
  }
  return next;
}
