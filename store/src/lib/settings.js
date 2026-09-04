export const DEFAULT_SETTINGS = {
  megaNav: false,
};

export function normalizeSettings(raw = {}) {
  return {
    megaNav: Boolean(raw.megaNav),
  };
}

export function publicSettings(settings) {
  return {
    megaNav: Boolean(settings?.megaNav),
  };
}
