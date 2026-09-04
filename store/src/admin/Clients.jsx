import { useEffect, useState } from "react";
import { api } from "../api.js";
import { ORDER_STATUSES } from "../lib/orders.js";
import { lineLabel, lineName } from "../lib/orders.js";

export default function Clients({ token }) {
  const [clients, setClients] = useState([]);
  const [orders, setOrders] = useState([]);
  const [pick, setPick] = useState("");
  const load = () => {
    api.adminClients(token).then(setClients);
    api.adminOrders(token).then(setOrders);
  };
  useEffect(() => {
    load();
  }, [token]);
  const list = pick ? orders.filter((o) => o.clientId === pick) : orders;
  return (
    <div>
      <div className="desk-toolbar">
        <h2>Clients</h2>
        <select value={pick} onChange={(e) => setPick(e.target.value)}>
          <option value="">All orders</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} · {c.email}
            </option>
          ))}
        </select>
      </div>
      <p className="muted">{clients.length} profiles. Cancel is blocked once an order is processing or later.</p>
      <table className="desk-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Email</th>
            <th>City</th>
            <th>Orders</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((c) => (
            <tr key={c.id}>
              <td>
                <button type="button" className="lang" onClick={() => setPick(c.id)}>
                  {c.name}
                </button>
              </td>
              <td>{c.email}</td>
              <td>{c.city}</td>
              <td>{orders.filter((o) => o.clientId === c.id).length}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3 style={{ marginTop: 36 }}>Order history</h3>
      <table className="desk-table">
        <thead>
          <tr>
            <th>Ref</th>
            <th>Client</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {list.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.customer?.name}</td>
              <td>
                {(o.lines || []).map((l) => `${lineName(l)} ${lineLabel(l)}`).join(" · ")}
              </td>
              <td>AED {Number(o.total).toFixed(2)}</td>
              <td>
                <select
                  value={o.status}
                  onChange={(e) => api.patchOrder(token, o.id, { status: e.target.value }).then(load)}
                >
                  {ORDER_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
