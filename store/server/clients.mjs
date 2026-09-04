import { hashPassword } from "./auth.js";
import { readJson, writeJson } from "./db.js";

export const TEST_CLIENT = {
  email: "layla@marahil.test",
  password: "MarahilClient2026!",
  name: "Layla Al Mansoori",
};

function clientShape(partial, password) {
  return {
    id: "c-layla",
    email: TEST_CLIENT.email,
    name: TEST_CLIENT.name,
    phone: "+971 50 123 4567",
    address: "Al Bateen, Villa 18",
    city: "Abu Dhabi",
    created: "2026-07-20T09:00:00.000Z",
    ...partial,
    ...hashPassword(password),
  };
}

function testOrders(clientId) {
  const customer = {
    name: TEST_CLIENT.name,
    email: TEST_CLIENT.email,
    phone: "+971 50 123 4567",
    address: "Al Bateen, Villa 18",
    city: "Abu Dhabi",
  };
  return [
    {
      id: "MRL-LYL-DELIVERED",
      clientId,
      status: "delivered",
      payment: "stub",
      at: "2026-08-02T11:20:00.000Z",
      customer,
      lines: [
        {
          productId: "ishraq-edp",
          sizeId: "50",
          qty: 1,
          price: 185,
          line: 185,
          label: "50ml",
          name: { en: "Ishraq Eau de Parfum", ar: "إشراق أو دو بارفان" },
        },
        {
          productId: "athar-cream",
          sizeId: "200",
          qty: 1,
          price: 95,
          line: 95,
          label: "200ml",
          name: { en: "Athar Cream", ar: "كريم أثر" },
        },
      ],
      subtotal: 280,
      taxableSubtotal: 280,
      giftCredit: 0,
      vat: 14,
      total: 294,
    },
    {
      id: "MRL-LYL-PROCESS",
      clientId,
      status: "processing",
      payment: "stub",
      at: "2026-08-28T16:05:00.000Z",
      customer,
      lines: [
        {
          productId: "maria-extrait",
          sizeId: "50",
          qty: 1,
          price: 295,
          line: 295,
          label: "50ml",
          name: { en: "Maria Extrait", ar: "ماريا إكستريه" },
        },
      ],
      subtotal: 295,
      taxableSubtotal: 295,
      giftCredit: 0,
      vat: 14.75,
      total: 309.75,
    },
    {
      id: "MRL-LYL-NEW",
      clientId,
      status: "received",
      payment: "stub",
      at: "2026-09-03T09:40:00.000Z",
      customer,
      lines: [
        {
          productId: "hadu-edp",
          sizeId: "50",
          qty: 1,
          price: 175,
          line: 175,
          label: "50ml",
          name: { en: "Hadu’ Eau de Parfum", ar: "هدوء أو دو بارفان" },
        },
        {
          productId: "first-marahil",
          sizeId: "set",
          qty: 1,
          price: 75,
          line: 75,
          label: "6 × 2ml",
          name: { en: "The First Stages", ar: "المراحل الأولى" },
        },
      ],
      subtotal: 250,
      taxableSubtotal: 250,
      giftCredit: 0,
      vat: 12.5,
      total: 262.5,
    },
  ];
}

export function ensureTestClient() {
  const clients = readJson("clients.json", []);
  let row = clients.find((c) => c.email === TEST_CLIENT.email);
  if (!row) {
    row = clientShape({}, TEST_CLIENT.password);
    writeJson("clients.json", [row, ...clients]);
  }
  const orders = readJson("orders.json", []);
  const have = new Set(orders.map((o) => o.id));
  const extra = testOrders(row.id).filter((o) => !have.has(o.id));
  if (extra.length) writeJson("orders.json", [...extra, ...orders]);
  return row;
}
