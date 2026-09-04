import { randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { readJson, writeJson } from "./db.js";

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
}

export function verifyPassword(password, salt, hash) {
  const next = scryptSync(password, salt, 64);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  return timingSafeEqual(next, prev);
}

export function ensureAdmin() {
  let admin = readJson("admin.json", null);
  if (!admin) {
    const password = process.env.MARAHIL_ADMIN_PASSWORD || "MarahilAdmin2026!";
    admin = { username: "admin", ...hashPassword(password) };
    writeJson("admin.json", admin);
  }
  return admin;
}

export function createSession(meta = {}) {
  const sessions = readJson("sessions.json", []);
  const token = randomBytes(24).toString("hex");
  const rec = {
    token,
    exp: Date.now() + 1000 * 60 * 60 * 12,
    role: meta.role || "admin",
    clientId: meta.clientId || null,
  };
  writeJson("sessions.json", [...sessions.filter((s) => s.exp > Date.now()), rec]);
  return token;
}

export function getSession(token) {
  if (!token) return null;
  const sessions = readJson("sessions.json", []);
  return sessions.find((s) => s.token === token && s.exp > Date.now()) || null;
}

export function validSession(token) {
  const s = getSession(token);
  return Boolean(s && s.role !== "client");
}

export function clientSession(token) {
  const s = getSession(token);
  return s?.role === "client" ? s : null;
}
