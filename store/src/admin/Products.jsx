import { useMemo, useState } from "react";
import { api } from "../api.js";
import { aed, isVatExempt, marginAed, marginPct, priceInclVat, vatAmount } from "../lib/money.js";
import { STAGES_PAGE, sortByIds } from "../data/stages.js";

import { brandSrc } from "../lib/brand.js";

function emptyProduct(collection = "marahil") {
  return {
    id: "",
    collection,
    published: true,
    vatExempt: collection === "cards",
    arabic: "",
    image: brandSrc("marahil-cons-box-lid.png"),
    images: [brandSrc("marahil-cons-box-lid.png")],
    name: { en: "", ar: "" },
    family: { en: "", ar: "" },
    blurb: { en: "", ar: "" },
    notes: { top: "", heart: "", base: "" },
    wear: { en: "", ar: "" },
    sizes: [{ id: "50", label: "50ml", price: 175, cost: 58 }],
    profile: {
      origin: { en: "Assembled in the UAE.", ar: "" },
      materials: { en: "Glass, pewter MARAHIL / MRK seal.", ar: "" },
      contents: { en: "", ar: "" },
      juice: { en: "", ar: "" },
      packaging: { en: "Ivory box, MRK seal.", ar: "" },
      skin: { en: "", ar: "" },
    },
  };
}

function MoneyLine({ size, exempt }) {
  const price = Number(size.price) || 0;
  const cost = Number(size.cost) || 0;
  const vat = vatAmount(price, exempt);
  const incl = priceInclVat(price, exempt);
  const m = marginAed(price, cost);
  const pct = marginPct(price, cost);
  return (
    <p className="desk-money">
      VAT {exempt ? "exempt" : aed(vat)} · shelf {aed(incl)}
      {exempt ? "" : " incl. VAT"} · margin {aed(m)} ({pct.toFixed(0)}% on sell)
    </p>
  );
}

function ProductEditor({ token, categories, initial, onDone }) {
  const [form, setForm] = useState(initial || emptyProduct());
  const [msg, setMsg] = useState("");
  const exempt = isVatExempt(form);
  const set = (path, value) => {
    setForm((f) => {
      const next = structuredClone(f);
      const keys = path.split(".");
      let cur = next;
      for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
      cur[keys[keys.length - 1]] = value;
      return next;
    });
  };
  const upload = async (file, slot) => {
    const { url } = await api.upload(token, file);
    if (slot === "hero") {
      setForm((f) => ({ ...f, image: url, images: [url, ...(f.images || []).filter((x) => x !== url)] }));
    } else {
      setForm((f) => ({ ...f, images: [...(f.images || []), url] }));
    }
  };
  return (
    <form
      className="desk-editor"
      onSubmit={async (e) => {
        e.preventDefault();
        const id = String(form.id || form.name.en.toLowerCase().replace(/\s+/g, "-")).replace(/[^\w-]/g, "-");
        const cat = categories.find((c) => c.id === form.collection);
        const sizes = (form.sizes || []).map((s) => ({
          ...s,
          price: Number(s.price) || 0,
          cost: Number(s.cost) || 0,
        }));
        await api.saveProduct(token, {
          ...form,
          id,
          sizes,
          image: form.image || form.images?.[0],
          vatExempt: Boolean(form.vatExempt || cat?.vatExempt || form.collection === "cards"),
        });
        setMsg("Saved. Cost stays on the desk only.");
        onDone?.();
      }}
    >
      <div className="desk-editor-grid">
        <input placeholder="id (slug)" value={form.id} onChange={(e) => set("id", e.target.value)} />
        <select
          value={form.collection}
          onChange={(e) => {
            const collection = e.target.value;
            const cat = categories.find((c) => c.id === collection);
            setForm((f) => ({ ...f, collection, vatExempt: Boolean(cat?.vatExempt || collection === "cards") }));
          }}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name?.en} ({c.id})
            </option>
          ))}
        </select>
        <input placeholder="Arabic name" value={form.arabic} onChange={(e) => set("arabic", e.target.value)} />
        <label className="desk-check">
          <input type="checkbox" checked={form.published !== false} onChange={(e) => set("published", e.target.checked)} /> Published
        </label>
        <label className="desk-check">
          <input type="checkbox" checked={Boolean(form.vatExempt)} onChange={(e) => set("vatExempt", e.target.checked)} /> VAT
          exempt
        </label>
        <input placeholder="Name EN" value={form.name?.en || ""} onChange={(e) => set("name.en", e.target.value)} required />
        <input placeholder="Name AR" value={form.name?.ar || ""} onChange={(e) => set("name.ar", e.target.value)} />
        <input placeholder="Family EN" value={form.family?.en || ""} onChange={(e) => set("family.en", e.target.value)} />
        <input placeholder="Family AR" value={form.family?.ar || ""} onChange={(e) => set("family.ar", e.target.value)} />
        <textarea placeholder="Blurb EN" value={form.blurb?.en || ""} onChange={(e) => set("blurb.en", e.target.value)} />
        <textarea placeholder="Blurb AR" value={form.blurb?.ar || ""} onChange={(e) => set("blurb.ar", e.target.value)} />
        <input placeholder="Top notes" value={form.notes?.top || ""} onChange={(e) => set("notes.top", e.target.value)} />
        <input placeholder="Heart notes" value={form.notes?.heart || ""} onChange={(e) => set("notes.heart", e.target.value)} />
        <input placeholder="Base notes" value={form.notes?.base || ""} onChange={(e) => set("notes.base", e.target.value)} />
        <textarea placeholder="Wear EN" value={form.wear?.en || ""} onChange={(e) => set("wear.en", e.target.value)} />
        <textarea placeholder="Wear AR" value={form.wear?.ar || ""} onChange={(e) => set("wear.ar", e.target.value)} />
        <input placeholder="Origin EN" value={form.profile?.origin?.en || ""} onChange={(e) => set("profile.origin.en", e.target.value)} />
        <input placeholder="Materials EN" value={form.profile?.materials?.en || ""} onChange={(e) => set("profile.materials.en", e.target.value)} />
        <input placeholder="Contents EN" value={form.profile?.contents?.en || ""} onChange={(e) => set("profile.contents.en", e.target.value)} />
        <input placeholder="Juice / fill EN" value={form.profile?.juice?.en || ""} onChange={(e) => set("profile.juice.en", e.target.value)} />
        <input placeholder="Packaging EN" value={form.profile?.packaging?.en || ""} onChange={(e) => set("profile.packaging.en", e.target.value)} />
        <input placeholder="How to wear EN" value={form.profile?.skin?.en || ""} onChange={(e) => set("profile.skin.en", e.target.value)} />
      </div>
      <h3>Sizes · sell excl. VAT · cost hidden from the store</h3>
      <p className="muted">
        Shelf price is excl. VAT. UAE 5% is added in the bag unless exempt. Cost (original) never leaves this portal.
      </p>
      {(form.sizes || []).map((s, i) => (
        <div className="desk-size-block" key={i}>
          <div className="desk-size">
            <input placeholder="id" value={s.id} onChange={(e) => set(`sizes.${i}.id`, e.target.value)} />
            <input placeholder="label" value={s.label} onChange={(e) => set(`sizes.${i}.label`, e.target.value)} />
            <label className="desk-field">
              <span>Cost · house only</span>
              <input type="number" min="0" step="1" value={s.cost ?? ""} onChange={(e) => set(`sizes.${i}.cost`, e.target.value)} />
            </label>
            <label className="desk-field">
              <span>Sell excl. VAT</span>
              <input type="number" min="0" step="1" value={s.price} onChange={(e) => set(`sizes.${i}.price`, e.target.value)} />
            </label>
            <button
              type="button"
              className="lang"
              onClick={() => setForm((f) => ({ ...f, sizes: f.sizes.filter((_, j) => j !== i) }))}
            >
              Remove
            </button>
          </div>
          <MoneyLine size={s} exempt={exempt} />
        </div>
      ))}
      <button
        type="button"
        className="btn ghost"
        onClick={() => setForm((f) => ({ ...f, sizes: [...(f.sizes || []), { id: "new", label: "50ml", price: 0, cost: 0 }] }))}
      >
        Add size
      </button>
      <h3>Images</h3>
      <p className="muted">Hero still first. Plaque = juice name only. Pewter MRK seal. No gold.</p>
      <div className="desk-thumbs">
        {(form.images || [form.image]).filter(Boolean).map((src) => (
          <button type="button" key={src} className={src === form.image ? "on" : ""} onClick={() => set("image", src)}>
            <img src={src} alt="" />
          </button>
        ))}
      </div>
      <label className="muted">
        Replace hero
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "hero")} />
      </label>
      <label className="muted">
        Add gallery image
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0], "extra")} />
      </label>
      <input placeholder="Image URL" value={form.image || ""} onChange={(e) => set("image", e.target.value)} />
      {msg && <p className="notice">{msg}</p>}
      <div className="btn-row">
        <button className="btn" type="submit">
          Save product
        </button>
        <button type="button" className="btn ghost" onClick={() => onDone?.()}>
          Close
        </button>
      </div>
    </form>
  );
}

export default function Products({ token, rows, categories, onReload }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rows.filter((p) => {
      if (cat !== "all" && p.collection !== cat) return false;
      if (!s) return true;
      return `${p.id} ${p.name?.en} ${p.arabic} ${p.collection}`.toLowerCase().includes(s);
    });
  }, [rows, q, cat]);

  const byCat = useMemo(() => {
    const map = new Map(categories.map((c) => [c.id, []]));
    filtered.forEach((p) => {
      if (!map.has(p.collection)) map.set(p.collection, []);
      map.get(p.collection).push(p);
    });
    return map;
  }, [filtered, categories]);

  if (editing) {
    const collection = editing === "new" ? (cat !== "all" ? cat : "marahil") : editing.collection;
    return (
      <ProductEditor
        token={token}
        categories={categories}
        initial={
          editing === "new"
            ? emptyProduct(collection)
            : {
                ...emptyProduct(editing.collection),
                ...structuredClone(editing),
                name: { en: "", ar: "", ...editing.name },
                family: { en: "", ar: "", ...editing.family },
                blurb: { en: "", ar: "", ...editing.blurb },
                notes: { top: "", heart: "", base: "", ...editing.notes },
                wear: { en: "", ar: "", ...editing.wear },
                sizes: editing.sizes?.length
                  ? structuredClone(editing.sizes).map((s) => ({ cost: 0, ...s }))
                  : emptyProduct().sizes,
                profile: { ...emptyProduct().profile, ...editing.profile },
              }
        }
        onDone={() => {
          setEditing(null);
          onReload();
        }}
      />
    );
  }

  const known = new Set(categories.map((c) => c.id));
  const stray = filtered.filter((p) => !known.has(p.collection));
  const sections = cat === "all" ? categories : categories.filter((c) => c.id === cat);

  return (
    <div>
      <div className="desk-toolbar">
        <h2>Products</h2>
        <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <button type="button" className="btn" onClick={() => setEditing("new")}>
          New product
        </button>
      </div>
      <div className="chips desk-cats">
        <button type="button" className={cat === "all" ? "on" : ""} onClick={() => setCat("all")}>
          All
        </button>
        {categories.map((c) => {
          const n = rows.filter((p) => p.collection === c.id).length;
          return (
            <button key={c.id} type="button" className={cat === c.id ? "on" : ""} onClick={() => setCat(c.id)}>
              {c.name?.en} ({n})
            </button>
          );
        })}
      </div>
      {sections.map((c) => {
        const list = sortByIds(byCat.get(c.id) || [], STAGES_PAGE);
        return (
          <section key={c.id} className="desk-cat">
            <div className="desk-cat-head">
              <h3>
                {c.name?.en} <span className="muted">{c.name?.ar}</span>
              </h3>
              <button type="button" className="btn ghost" onClick={() => { setCat(c.id); setEditing("new"); }}>
                Add in {c.name?.en}
              </button>
            </div>
            {list.length === 0 ? (
              <div className="desk-cat-empty">
                <p>No products in this category.</p>
                <p className="muted">Add a product, or delete the category from Categories if you no longer need it.</p>
              </div>
            ) : (
              <table className="desk-table">
                <thead>
                  <tr>
                    <th></th>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Cost</th>
                    <th>Sell excl. VAT</th>
                    <th>VAT</th>
                    <th>Shelf</th>
                    <th>Margin</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => {
                    const size = p.sizes?.[0] || { price: 0, cost: 0, label: "—" };
                    const exempt = isVatExempt(p);
                    const vat = vatAmount(size.price, exempt);
                    const m = marginAed(size.price, size.cost);
                    const pct = marginPct(size.price, size.cost);
                    return (
                      <tr key={p.id}>
                        <td>
                          <img className="desk-mini" src={p.image} alt="" />
                        </td>
                        <td>
                          <strong>{p.name?.en}</strong>
                          <div className="muted">
                            {p.arabic} · {p.id}
                          </div>
                        </td>
                        <td>{size.label}</td>
                        <td>{aed(size.cost)}</td>
                        <td>{aed(size.price)}</td>
                        <td>{exempt ? "exempt" : aed(vat)}</td>
                        <td>{aed(priceInclVat(size.price, exempt))}</td>
                        <td>
                          {aed(m)}
                          <div className="muted">{pct.toFixed(0)}%</div>
                        </td>
                        <td>{p.published === false ? "hidden" : "live"}</td>
                        <td className="desk-actions">
                          <button type="button" className="lang" onClick={() => setEditing(p)}>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="lang"
                            onClick={() => api.saveProduct(token, { id: p.id, published: p.published === false }).then(onReload)}
                          >
                            {p.published === false ? "Publish" : "Hide"}
                          </button>
                          <button
                            type="button"
                            className="lang"
                            onClick={() => window.confirm("Delete this product?") && api.deleteProduct(token, p.id).then(onReload)}
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
          </section>
        );
      })}
      {cat === "all" && stray.length > 0 && (
        <section className="desk-cat">
          <div className="desk-cat-head">
            <h3>Uncategorised</h3>
          </div>
          <p className="muted">These SKUs need a category. Edit and assign one.</p>
        </section>
      )}
    </div>
  );
}
