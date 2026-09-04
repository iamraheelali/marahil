import { useEffect, useState } from "react";
import { api } from "../api.js";

function blank() {
  return {
    id: "",
    name: { en: "", ar: "" },
    blurb: { en: "", ar: "" },
    vatExempt: false,
    sort: 99,
  };
}

export default function Categories({ token, products, onChange }) {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(blank());
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const load = () => api.adminCategories(token).then(setRows);
  useEffect(() => {
    load();
  }, [token]);

  const count = (id) => products.filter((p) => p.collection === id).length;
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

  return (
    <div>
      <div className="desk-toolbar">
        <h2>Categories</h2>
        <button
          type="button"
          className="btn"
          onClick={() => {
            setEditing("new");
            setForm(blank());
            setMsg("");
          }}
        >
          Add category
        </button>
      </div>
      <p className="muted">
        Products sit in a category. Delete is allowed only when the category has no products. Gift cards stay VAT-exempt.
      </p>
      <table className="desk-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Arabic</th>
            <th>Id</th>
            <th>Products</th>
            <th>VAT</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => {
            const n = count(c.id);
            return (
              <tr key={c.id}>
                <td>
                  <strong>{c.name?.en}</strong>
                  <div className="muted">{c.blurb?.en}</div>
                </td>
                <td>{c.name?.ar}</td>
                <td>{c.id}</td>
                <td>{n}</td>
                <td>{c.vatExempt ? "exempt" : "5% on goods"}</td>
                <td className="desk-actions">
                  <button
                    type="button"
                    className="lang"
                    onClick={() => {
                      setEditing(c.id);
                      setForm({ ...blank(), ...c, name: { en: "", ar: "", ...c.name }, blurb: { en: "", ar: "", ...c.blurb } });
                      setMsg("");
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="lang"
                    disabled={n > 0}
                    title={n > 0 ? "Move or delete products first" : "Delete empty category"}
                    onClick={async () => {
                      if (n > 0) return;
                      if (!window.confirm(`Delete category “${c.name?.en}”?`)) return;
                      try {
                        await api.deleteCategory(token, c.id);
                        setEditing(null);
                        await load();
                        onChange?.();
                      } catch (ex) {
                        setMsg(ex.message);
                      }
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {rows.some((c) => count(c.id) === 0) && (
        <p className="muted" style={{ marginTop: 12 }}>
          Empty categories can be deleted. Add a product, or remove the category.
        </p>
      )}
      {editing && (
        <form
          className="desk-editor"
          style={{ marginTop: 28 }}
          onSubmit={async (e) => {
            e.preventDefault();
            const id = String(form.id || form.name.en)
              .toLowerCase()
              .replace(/[^\w]+/g, "-")
              .replace(/^-|-$/g, "");
            await api.saveCategory(token, { ...form, id });
            setMsg("Category saved.");
            setEditing(null);
            load();
            onChange?.();
          }}
        >
          <h3>{editing === "new" ? "New category" : "Edit category"}</h3>
          <div className="desk-editor-grid">
            <input
              placeholder="id (slug)"
              value={form.id}
              onChange={(e) => set("id", e.target.value)}
              disabled={editing !== "new"}
            />
            <input type="number" placeholder="Sort" value={form.sort} onChange={(e) => set("sort", Number(e.target.value))} />
            <input required placeholder="Name EN" value={form.name.en} onChange={(e) => set("name.en", e.target.value)} />
            <input placeholder="Name AR" value={form.name.ar} onChange={(e) => set("name.ar", e.target.value)} />
            <textarea placeholder="Blurb EN" value={form.blurb.en} onChange={(e) => set("blurb.en", e.target.value)} />
            <textarea placeholder="Blurb AR" value={form.blurb.ar} onChange={(e) => set("blurb.ar", e.target.value)} />
            <label className="desk-check">
              <input type="checkbox" checked={Boolean(form.vatExempt)} onChange={(e) => set("vatExempt", e.target.checked)} />
              VAT exempt (gift cards / credit)
            </label>
          </div>
          {msg && <p className="notice">{msg}</p>}
          <div className="btn-row">
            <button className="btn" type="submit">
              Save category
            </button>
            <button type="button" className="btn ghost" onClick={() => setEditing(null)}>
              Close
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
