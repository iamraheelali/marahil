import { useEffect, useState } from "react";
import { api } from "../api.js";
import Login from "../admin/Login.jsx";
import Products from "../admin/Products.jsx";
import Categories from "../admin/Categories.jsx";
import Trade from "../admin/Trade.jsx";
import Clients from "../admin/Clients.jsx";
import { aed } from "../lib/money.js";

const tokenKey = "marahil-admin-token";

function useToken() {
  const [token, setToken] = useState(() => sessionStorage.getItem(tokenKey) || "");
  const save = (t) => {
    sessionStorage.setItem(tokenKey, t);
    setToken(t);
  };
  const clear = () => {
    sessionStorage.removeItem(tokenKey);
    setToken("");
  };
  return { token, save, clear };
}

function Dashboard({ token, stats, go }) {
  if (!stats) return <p className="muted">Loading…</p>;
  return (
    <div>
      <h2>Overview</h2>
      <p className="muted">
        Approved reviews and published products appear on the public site. Cost, margin, and trade samples stay on this desk.
      </p>
      <div className="desk-stats">
        <button type="button" className="desk-stat" onClick={() => go("products")}>
          <strong>{stats.live}</strong>
          <span>Live products</span>
        </button>
        <button type="button" className="desk-stat" onClick={() => go("products")}>
          <strong>{stats.hidden}</strong>
          <span>Hidden</span>
        </button>
        <button type="button" className="desk-stat" onClick={() => go("categories")}>
          <strong>{stats.categories}</strong>
          <span>Categories</span>
        </button>
        <button type="button" className="desk-stat" onClick={() => go("reviews")}>
          <strong>{stats.pending}</strong>
          <span>Pending reviews</span>
        </button>
        <button type="button" className="desk-stat" onClick={() => go("trade")}>
          <strong>{stats.samplesOpen}</strong>
          <span>Open samples</span>
        </button>
        <button type="button" className="desk-stat" onClick={() => go("trade")}>
          <strong>{stats.tradeNew}</strong>
          <span>New trade leads</span>
        </button>
        <button type="button" className="desk-stat" onClick={() => go("clients")}>
          <strong>{stats.clients ?? 0}</strong>
          <span>Clients</span>
        </button>
        <div className="desk-stat">
          <strong>{aed(stats.catalogMargin)}</strong>
          <span>Unit margin (first sizes)</span>
        </div>
      </div>
    </div>
  );
}

function Reviews({ token }) {
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("pending");
  const load = () => api.adminReviews(token).then(setRows);
  useEffect(() => {
    load();
  }, [token]);
  const patch = async (id, body) => {
    await api.patchReview(token, id, body);
    load();
  };
  const list = rows.filter((r) => (filter === "all" ? true : r.status === filter));
  return (
    <div>
      <div className="desk-toolbar">
        <h2>Reviews</h2>
        {["pending", "approved", "rejected", "all"].map((f) => (
          <button key={f} type="button" className={filter === f ? "btn" : "btn ghost"} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>
      <ul className="admin-list">
        {list.map((r) => (
          <li key={r.id}>
            <div>
              ★{r.rating} {r.name} · {r.productId} · {r.status}
              {r.featured ? " · featured" : ""}
              <p>{r.text?.en}</p>
            </div>
            <div className="btn-row">
              <button type="button" className="btn" onClick={() => patch(r.id, { status: "approved" })}>
                Approve
              </button>
              <button type="button" className="btn ghost" onClick={() => patch(r.id, { status: "rejected" })}>
                Reject
              </button>
              <button type="button" className="lang" onClick={() => patch(r.id, { featured: !r.featured, status: "approved" })}>
                {r.featured ? "Unfeature" : "Feature"}
              </button>
              <button type="button" className="lang" onClick={() => api.deleteReview(token, r.id).then(load)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Desk({ token, onOut }) {
  const [tab, setTab] = useState("dash");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const refresh = () => {
    api.adminStats(token).then(setStats).catch(() => {});
    api.adminProducts(token).then(setProducts).catch(() => {});
    api.adminCategories(token).then(setCategories).catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, [token]);

  return (
    <div className="desk">
      <aside className="desk-side">
        <div className="brand-name">MARAHIL</div>
        <div className="brand-ar">مراحل</div>
        <p className="muted">House desk</p>
        {[
          ["dash", "Overview"],
          ["products", "Products"],
          ["categories", "Categories"],
          ["reviews", "Reviews"],
          ["trade", "Trade"],
          ["clients", "Clients"],
        ].map(([id, label]) => (
          <button key={id} type="button" className={tab === id ? "on" : ""} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
        <a href="/" className="desk-out">
          Public site
        </a>
        <button type="button" className="desk-out" onClick={onOut}>
          Sign out
        </button>
      </aside>
      <main className="desk-main">
        {tab === "dash" && <Dashboard token={token} stats={stats} go={setTab} />}
        {tab === "products" && (
          <Products token={token} rows={products} categories={categories} onReload={refresh} />
        )}
        {tab === "categories" && <Categories token={token} products={products} onChange={refresh} />}
        {tab === "reviews" && <Reviews token={token} />}
        {tab === "trade" && <Trade token={token} products={products} categories={categories} />}
        {tab === "clients" && <Clients token={token} />}
      </main>
    </div>
  );
}

export default function Admin() {
  const { token, save, clear } = useToken();
  if (!token) return <Login onAuth={save} />;
  return <Desk token={token} onOut={clear} />;
}
