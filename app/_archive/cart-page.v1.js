"use client";
import Link from "next/link";
import { useState } from "react";
import Garment from "../Garment";
import { useCart } from "../cart";
import { pkr } from "../catalog";
export default function Cart() {
  const { items, setQty, key, total, clear } = useCart();
  const [order, setOrder] = useState(null);
  const place = (e) => { e.preventDefault(); setOrder("NQ-" + Math.floor(100000 + Math.random() * 900000)); clear(); };
  if (order) return <div className="wrap sec"><h1 className="h wide">Order placed</h1><p>Your order number is {order}. We will call you to confirm. Pay cash on delivery.</p><br /><Link className="btn wide" href="/shop">Keep shopping</Link></div>;
  if (!items.length) return <div className="wrap sec"><h1 className="h wide">Your cart is empty</h1><Link className="btn wide" href="/shop">Shop now</Link></div>;
  return (
    <div className="wrap cgrid">
      <div>
        <h1 className="h wide">Cart</h1>
        {items.map((i) => (
          <div className="crow" key={key(i)}>
            <div className="th"><Garment shape={i.shape || "top"} c={i.hex || "#2b2f36"} /></div>
            <div><div>{i.name}</div><div style={{ color: "#737b86", fontSize: 13 }}>{[i.color, i.size].filter(Boolean).join(" / ")}</div>
              <div className="qty"><button onClick={() => setQty(i, i.qty - 1)}>-</button>{i.qty}<button onClick={() => setQty(i, i.qty + 1)}>+</button></div></div>
            <div>{pkr(i.price * i.qty)}</div>
          </div>
        ))}
      </div>
      <form className="form" onSubmit={place}>
        <h2 className="h wide">Checkout</h2>
        <input required placeholder="Full name" /><input required placeholder="Phone number" /><input required placeholder="City" /><textarea required rows={3} placeholder="Delivery address" />
        <div className="tot"><span>Total</span><b>{pkr(total)}</b></div>
        <button className="btn fill wide" type="submit">Place order (cash on delivery)</button>
      </form>
    </div>
  );
}
