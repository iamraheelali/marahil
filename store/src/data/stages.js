/** Chapter order on Stages. Do not shuffle. Discovery sits after Maria. */
export const STAGE_SEQUENCE = ["bad-edp", "ishraq-edp", "wasl-edp", "layl-edp", "athar-edp", "maria-extrait"];
export const STAGES_PAGE = [...STAGE_SEQUENCE, "first-marahil"];
/** France Parfum only. Maria stays in STAGE_SEQUENCE. Do not insert these into Stages. */
export const HAUTE_SEQUENCE = ["ishraq-parfum", "wasl-parfum"];
export const BEAUTY_FEATURED = ["athar-musk-cream", "layl-hair-body", "ishraq-silk-powder", "athar-laban-oil"];

export function sortByIds(items, ids) {
  const map = new Map(items.map((p) => [p.id, p]));
  const ordered = ids.map((id) => map.get(id)).filter(Boolean);
  const rest = items.filter((p) => !ids.includes(p.id));
  return [...ordered, ...rest];
}
