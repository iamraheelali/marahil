/** Works in Vite and in Node seed (where import.meta.env is absent). */
export function assetBase() {
  const base = import.meta.env && import.meta.env.BASE_URL;
  return base || "/";
}

export function brandSrc(file) {
  const name = String(file).replace(/^\/brand\//, "").replace(/^brand\//, "");
  return `${assetBase()}brand/${name}`;
}
