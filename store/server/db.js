import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const dataDir = join(root, "data", "db");
export const uploadDir = join(root, "data", "uploads");

mkdirSync(dataDir, { recursive: true });
mkdirSync(uploadDir, { recursive: true });

export function readJson(name, fallback) {
  const p = join(dataDir, name);
  if (!existsSync(p)) {
    writeJson(name, fallback);
    return fallback;
  }
  return JSON.parse(readFileSync(p, "utf8"));
}

export function writeJson(name, value) {
  writeFileSync(join(dataDir, name), JSON.stringify(value, null, 2), "utf8");
}
