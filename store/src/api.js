const headers = (token) =>
  token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };

async function req(path, opts = {}) {
  const res = await fetch(path, opts);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  products: () => req("/api/products"),
  reviews: (productId) => req(productId ? `/api/reviews?productId=${encodeURIComponent(productId)}` : "/api/reviews"),
  testimonials: () => req("/api/testimonials"),
  postReview: (body) => req("/api/reviews", { method: "POST", headers: headers(), body: JSON.stringify(body) }),
  wholesale: (body) => req("/api/wholesale", { method: "POST", headers: headers(), body: JSON.stringify(body) }),
  login: (username, password) =>
    req("/api/admin/login", { method: "POST", headers: headers(), body: JSON.stringify({ username, password }) }),
  categories: () => req("/api/categories"),
  adminProducts: (token) => req("/api/admin/products", { headers: headers(token) }),
  saveProduct: (token, product) =>
    req("/api/admin/products", { method: "POST", headers: headers(token), body: JSON.stringify(product) }),
  deleteProduct: (token, id) => req(`/api/admin/products/${id}`, { method: "DELETE", headers: headers(token) }),
  adminCategories: (token) => req("/api/admin/categories", { headers: headers(token) }),
  saveCategory: (token, category) =>
    req("/api/admin/categories", { method: "POST", headers: headers(token), body: JSON.stringify(category) }),
  deleteCategory: (token, id) => req(`/api/admin/categories/${id}`, { method: "DELETE", headers: headers(token) }),
  adminSamples: (token) => req("/api/admin/samples", { headers: headers(token) }),
  saveSample: (token, sample) =>
    req("/api/admin/samples", { method: "POST", headers: headers(token), body: JSON.stringify(sample) }),
  deleteSample: (token, id) => req(`/api/admin/samples/${id}`, { method: "DELETE", headers: headers(token) }),
  adminStats: (token) => req("/api/admin/stats", { headers: headers(token) }),
  adminReviews: (token) => req("/api/admin/reviews", { headers: headers(token) }),
  patchReview: (token, id, body) =>
    req(`/api/admin/reviews/${id}`, { method: "PATCH", headers: headers(token), body: JSON.stringify(body) }),
  deleteReview: (token, id) => req(`/api/admin/reviews/${id}`, { method: "DELETE", headers: headers(token) }),
  adminWholesale: (token) => req("/api/admin/wholesale", { headers: headers(token) }),
  patchWholesale: (token, id, body) =>
    req(`/api/admin/wholesale/${id}`, { method: "PATCH", headers: headers(token), body: JSON.stringify(body) }),
  adminClients: (token) => req("/api/admin/clients", { headers: headers(token) }),
  adminOrders: (token, clientId) =>
    req(clientId ? `/api/admin/orders?clientId=${encodeURIComponent(clientId)}` : "/api/admin/orders", { headers: headers(token) }),
  patchOrder: (token, id, body) =>
    req(`/api/admin/orders/${id}`, { method: "PATCH", headers: headers(token), body: JSON.stringify(body) }),
  clientRegister: (body) => req("/api/client/register", { method: "POST", headers: headers(), body: JSON.stringify(body) }),
  clientLogin: (email, password) =>
    req("/api/client/login", { method: "POST", headers: headers(), body: JSON.stringify({ email, password }) }),
  clientMe: (token) => req("/api/client/me", { headers: headers(token) }),
  saveClientProfile: (token, body) =>
    req("/api/client/me", { method: "PATCH", headers: headers(token), body: JSON.stringify(body) }),
  clientOrders: (token) => req("/api/client/orders", { headers: headers(token) }),
  clientOrder: (token, id) => req(`/api/client/orders/${id}`, { headers: headers(token) }),
  cancelOrder: (token, id) => req(`/api/client/orders/${id}/cancel`, { method: "POST", headers: headers(token) }),
  placeOrder: (token, body) =>
    req("/api/orders", { method: "POST", headers: headers(token), body: JSON.stringify(body) }),
  upload: async (token, file) => {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
    if (!res.ok) throw new Error("Upload failed");
    return res.json();
  },
};
