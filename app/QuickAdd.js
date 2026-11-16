"use client";
import { useState } from "react";
import { useCart } from "./cart";
// Adds a piece to the cart without opening its page (default colour and size).
export default function QuickAdd({ item, className = "qa", label }) {
  const { add } = useCart(), [ok, setOk] = useState(false);
  return <button className={className} aria-label={"Add " + item.name + " to cart"} onClick={() => { add(item); setOk(true); setTimeout(() => setOk(false), 1200); }}>{label ? (ok ? "Added" : label) : ok ? "✓" : "+"}</button>;
}
