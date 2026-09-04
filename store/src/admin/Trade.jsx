import { useEffect, useMemo, useState } from "react";
import { api } from "../api.js";
import { aed, isVatExempt, marginAed, priceInclVat, vatAmount } from "../lib/money.js";

const SAMPLE_STATUS = ["requested", "packed", "dispatched", "received", "invoiced", "closed"];
const HOUSE_JUICES = [
  "bad-edp",
  "ishraq-edp",
  "wasl-edp",
  "layl-edp",
  "athar-edp",
  "maria-extrait",
  "first-marahil",
  "hadu-edp",
  "sarw-edp",
  "ghusn-edp",
  "pale-woods",
];

function blankSample() {
  return {
    id: "",
    company: "",
    contact: "",
    email: "",
    phone: "",
    city: "Abu Dhabi",
    status: "requested",
    foc: true,
    notes: "",
    items: [],
  };
}

function itemFromProduct(p, qty = 1, foc = true) {
  const s = p.sizes?.[0] || { id: "one", price: 0, cost: 0, label: "" };
  return {
    productId: p.id,
    sizeId: s.id,
    qty,
    foc,
    name: p.name?.en || p.id,
    label: s.label,
    price: Number(s.price) || 0,
    cost: Number(s.cost) || 0,
    vatExempt: isVatExempt(p),
  };
}

function totals(sample) {
  return (sample.items || []).reduce(
    (acc, it) => {
      const qty = Number(it.qty) || 0;
      const sell = (Number(it.price) || 0) * qty;
      const cost = (Number(it.cost) || 0) * qty;
      const charged = it.foc || sample.foc ? 0 : sell;
      const vat = it.foc || sample.foc ? 0 : vatAmount(sell, it.vatExempt);
      acc.retail += sell;
      acc.cost += cost;
      acc.charge += charged;
      acc.vat += vat;
      return acc;
    },
    { retail: 0, cost: 0, charge: 0, vat: 0 }
  );
}

function SampleEditor({ token, products, initial, onDone }) {
  const [form, setForm] = useState(initial || blankSample());
  const [pick, setPick] = useState(products[0]?.id || "");
  const [msg, setMsg] = useState("");
  const sum = totals(form);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addProduct = (id) => {
    const p = products.find((x) => x.id === id);
    if (!p) return;
    setForm((f) => {
      if (f.items.some((it) => it.productId === id)) return f;
      return { ...f, items: [...f.items, itemFromProduct(p, 1, f.foc)] };
    });
  };

  return (
    <form
      className="desk-editor"
      onSubmit={async (e) => {
        e.preventDefault();
        const id = form.id || `S-${Date.now()}`;
        await api.saveSample(token, { ...form, id, at: form.at || new Date().toISOString() });
        setMsg("Sample book saved.");
        onDone?.();
      }}
    >
      <h3>{form.id ? `Sample ${form.id}` : "New trade sample"}</h3>
      <div className="desk-editor-grid">
        <input required placeholder="Company" value={form.company} onChange={(e) => set("company", e.target.value)} />
        <input required placeholder="Contact" value={form.contact} onChange={(e) => set("contact", e.target.value)} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        <input placeholder="Phone" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        <input placeholder="City" value={form.city} onChange={(e) => set("city", e.target.value)} />
        <select value={form.status} onChange={(e) => set("status", e.target.value)}>
          {SAMPLE_STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label className="desk-check">
          <input
            type="checkbox"
            checked={Boolean(form.foc)}
            onChange={(e) => {
              const foc = e.target.checked;
              setForm((f) => ({ ...f, foc, items: f.items.map((it) => ({ ...it, foc })) }));
            }}
          />
          Complimentary (FOC) — no VAT charged
        </label>
        <textarea placeholder="Notes" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <h3>Sample lines</h3>
      <div className="desk-toolbar">
        <select value={pick} onChange={(e) => setPick(e.target.value)}>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name?.en}
            </option>
          ))}
        </select>
        <button type="button" className="btn ghost" onClick={() => addProduct(pick)}>
          Add SKU
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => {
            const items = HOUSE_JUICES.map((id) => products.find((p) => p.id === id))
              .filter(Boolean)
              .map((p) => itemFromProduct(p, 1, form.foc));
            setForm((f) => ({ ...f, items }));
          }}
        >
          Full house samples
        </button>
      </div>
      <p className="muted">
        Full house packs the five stages, Maria, three woods, and both discovery sets. Cost is house-only; VAT applies only if you invoice the
        samples.
      </p>
      <table className="desk-table">
        <thead>
          <tr>
            <th>Juice</th>
            <th>Size</th>
            <th>Qty</th>
            <th>FOC</th>
            <th>Sell excl. VAT</th>
            <th>VAT</th>
            <th>Cost</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {form.items.map((it, i) => {
            const charged = form.foc || it.foc ? 0 : (Number(it.price) || 0) * (Number(it.qty) || 0);
            const vat = vatAmount(charged, it.vatExempt);
            return (
              <tr key={`${it.productId}-${i}`}>
                <td>{it.name}</td>
                <td>{it.label}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    style={{ width: 64 }}
                    value={it.qty}
                    onChange={(e) =>
                      setForm((f) => {
                        const items = [...f.items];
                        items[i] = { ...items[i], qty: Number(e.target.value) || 1 };
                        return { ...f, items };
                      })
                    }
                  />
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={Boolean(it.foc || form.foc)}
                    onChange={(e) =>
                      setForm((f) => {
                        const items = [...f.items];
                        items[i] = { ...items[i], foc: e.target.checked };
                        return { ...f, items };
                      })
                    }
                  />
                </td>
                <td>{aed((Number(it.price) || 0) * (Number(it.qty) || 0))}</td>
                <td>{form.foc || it.foc ? "—" : aed(vat)}</td>
                <td>{aed((Number(it.cost) || 0) * (Number(it.qty) || 0))}</td>
                <td>
                  <button type="button" className="lang" onClick={() => setForm((f) => ({ ...f, items: f.items.filter((_, j) => j !== i) }))}>
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="desk-sample-totals">
        <div>
          Retail value <strong>{aed(sum.retail)}</strong>
        </div>
        <div>
          Charge excl. VAT <strong>{aed(sum.charge)}</strong>
        </div>
        <div>
          VAT <strong>{aed(sum.vat)}</strong>
        </div>
        <div>
          Invoice <strong>{aed(sum.charge + sum.vat)}</strong>
        </div>
        <div>
          House cost <strong>{aed(sum.cost)}</strong>
        </div>
      </div>
      {msg && <p className="notice">{msg}</p>}
      <div className="btn-row">
        <button className="btn" type="submit">
          Save sample
        </button>
        <button type="button" className="btn ghost" onClick={() => onDone?.()}>
          Close
        </button>
      </div>
    </form>
  );
}

function Book({ products, categories }) {
  return (
    <div>
      <h3>Trade book</h3>
      <p className="muted">Sell excl. VAT, UAE 5%, shelf, and house cost. Cost never appears on the public site.</p>
      {categories.map((c) => {
        const list = products.filter((p) => p.collection === c.id);
        if (!list.length) return null;
        return (
          <section key={c.id} className="desk-cat">
            <h3>{c.name?.en}</h3>
            <table className="desk-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Cost</th>
                  <th>Sell excl. VAT</th>
                  <th>VAT 5%</th>
                  <th>Shelf incl. VAT</th>
                  <th>Margin</th>
                </tr>
              </thead>
              <tbody>
                {list.flatMap((p) =>
                  (p.sizes || []).map((s) => {
                    const exempt = isVatExempt(p);
                    return (
                      <tr key={`${p.id}-${s.id}`}>
                        <td>{p.name?.en}</td>
                        <td>{s.label}</td>
                        <td>{aed(s.cost)}</td>
                        <td>{aed(s.price)}</td>
                        <td>{exempt ? "exempt" : aed(vatAmount(s.price, false))}</td>
                        <td>{aed(priceInclVat(s.price, exempt))}</td>
                        <td>{aed(marginAed(s.price, s.cost))}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </section>
        );
      })}
    </div>
  );
}

export default function Trade({ token, products, categories }) {
  const [tab, setTab] = useState("samples");
  const [leads, setLeads] = useState([]);
  const [samples, setSamples] = useState([]);
  const [editing, setEditing] = useState(null);
  const loadLeads = () => api.adminWholesale(token).then(setLeads);
  const loadSamples = () => api.adminSamples(token).then(setSamples);
  useEffect(() => {
    loadLeads();
    loadSamples();
  }, [token]);

  const openSamples = useMemo(() => samples.filter((s) => s.status !== "closed").length, [samples]);

  if (editing) {
    return (
      <SampleEditor
        token={token}
        products={products}
        initial={editing === "new" ? blankSample() : structuredClone(editing)}
        onDone={() => {
          setEditing(null);
          loadSamples();
        }}
      />
    );
  }

  return (
    <div>
      <div className="desk-toolbar">
        <h2>Trade</h2>
        {["samples", "leads", "book"].map((id) => (
          <button key={id} type="button" className={tab === id ? "btn" : "btn ghost"} onClick={() => setTab(id)}>
            {id === "samples" ? `Samples (${openSamples} open)` : id === "leads" ? "Leads" : "Price book"}
          </button>
        ))}
        {tab === "samples" && (
          <button type="button" className="btn" onClick={() => setEditing("new")}>
            New sample
          </button>
        )}
      </div>
      {tab === "leads" && (
        <ul className="admin-list">
          {!leads.length && <p className="muted">No trade enquiries yet.</p>}
          {leads.map((r) => (
            <li key={r.id}>
              <strong>{r.company}</strong> · {r.kind} · {r.email} · {r.volume || "—"} · {r.status || "new"}
              <p>{r.notes}</p>
              <div className="btn-row">
                {r.kind === "samples" && (
                  <button
                    type="button"
                    className="btn"
                    onClick={() =>
                      setEditing({
                        ...blankSample(),
                        company: r.company,
                        contact: r.contact,
                        email: r.email,
                        phone: r.phone,
                        city: r.city || "Abu Dhabi",
                        notes: r.notes,
                        status: "requested",
                      })
                    }
                  >
                    Open as sample
                  </button>
                )}
                <button type="button" className="lang" onClick={() => api.patchWholesale(token, r.id, { status: "open" }).then(loadLeads)}>
                  Open
                </button>
                <button type="button" className="lang" onClick={() => api.patchWholesale(token, r.id, { status: "done" }).then(loadLeads)}>
                  Done
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {tab === "samples" && (
        <table className="desk-table">
          <thead>
            <tr>
              <th>Ref</th>
              <th>Company</th>
              <th>Status</th>
              <th>Lines</th>
              <th>Retail</th>
              <th>VAT</th>
              <th>House cost</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {samples.map((s) => {
              const t = totals(s);
              return (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>
                    <strong>{s.company}</strong>
                    <div className="muted">{s.contact} · {s.email}</div>
                  </td>
                  <td>{s.status}</td>
                  <td>{s.items?.length || 0}</td>
                  <td>{aed(t.retail)}</td>
                  <td>{s.foc ? "FOC" : aed(t.vat)}</td>
                  <td>{aed(t.cost)}</td>
                  <td className="desk-actions">
                    <button type="button" className="lang" onClick={() => setEditing(s)}>
                      Edit
                    </button>
                    {SAMPLE_STATUS.filter((st) => st !== s.status).slice(0, 3).map((st) => (
                      <button key={st} type="button" className="lang" onClick={() => api.saveSample(token, { ...s, status: st }).then(loadSamples)}>
                        {st}
                      </button>
                    ))}
                    <button
                      type="button"
                      className="lang"
                      onClick={() => window.confirm("Delete this sample book?") && api.deleteSample(token, s.id).then(loadSamples)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {tab === "book" && <Book products={products} categories={categories} />}
    </div>
  );
}
