import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./context/StoreContext.jsx";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import House from "./pages/House.jsx";
import Collection, { ShopCategory } from "./pages/Collection.jsx";
import Product from "./pages/Product.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Cards from "./pages/Cards.jsx";
import Order from "./pages/Order.jsx";
import Custom from "./pages/Custom.jsx";
import Wholesale from "./pages/Wholesale.jsx";
import Admin from "./pages/Admin.jsx";
import Care from "./pages/Care.jsx";
import Atelier from "./pages/Atelier.jsx";
import Stages from "./pages/Stages.jsx";
import Beauty from "./pages/Beauty.jsx";
import Account from "./pages/Account.jsx";

function routerBasename() {
  const base = import.meta.env.BASE_URL || "/";
  if (!base || base === "/") return undefined;
  return base.replace(/\/$/, "");
}

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter basename={routerBasename()}>
        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/house" element={<House />} />
            <Route path="/the-marahil" element={<Stages />} />
            <Route
              path="/woods"
              element={
                <Collection
                  id="woods"
                  title="The Pale Woods"
                  lede="Hadu’, Sarw, Ghusn. Creamy sandalwood, cool cypress, a warm bough."
                />
              }
            />
            <Route path="/rituals" element={<Beauty />} />
            <Route path="/atelier" element={<Atelier />} />
            <Route
              path="/hearth"
              element={
                <Collection
                  id="home"
                  title="Home"
                  lede="Bakhoor and Scented Candles. Same olfactive DNA as the juices, for the room."
                />
              }
            />
            <Route path="/collection/:id" element={<ShopCategory />} />
            <Route path="/custom" element={<Custom />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/cards" element={<Cards />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/account" element={<Account />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/care" element={<Care />} />
            <Route path="/wholesale" element={<Wholesale />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
