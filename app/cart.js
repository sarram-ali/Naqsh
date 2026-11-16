"use client";
import { createContext, useContext, useEffect, useState } from "react";
const Ctx = createContext(null);
export const useCart = () => useContext(Ctx);
const key = (i) => i.id + i.color + i.size;
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  useEffect(() => { try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {} }, []);
  const save = (n) => { setItems(n); try { localStorage.setItem("cart", JSON.stringify(n)); } catch {} };
  const add = (it) => { const q = it.qty || 1, f = items.find((x) => key(x) === key(it)); save(f ? items.map((x) => (key(x) === key(it) ? { ...x, qty: x.qty + q } : x)) : [...items, { ...it, qty: q }]); };
  const setQty = (it, q) => save(q < 1 ? items.filter((x) => key(x) !== key(it)) : items.map((x) => (key(x) === key(it) ? { ...x, qty: q } : x)));
  const value = { items, add, setQty, key, clear: () => save([]), count: items.reduce((a, b) => a + b.qty, 0), total: items.reduce((a, b) => a + b.qty * b.price, 0) };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
