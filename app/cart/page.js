"use client";
import Link from "next/link";
import { useState } from "react";
import Garment from "../Garment";
import { useCart } from "../cart";
import { pkr } from "../catalog";
import { sb } from "../supabase";
const STEPS = ["Cart", "Information", "Shipping", "Payment"];
const PAY = ["Cash on delivery", "Credit / Debit card", "EasyPaisa / JazzCash"];
export default function Cart() {
  const { items, setQty, key, total, clear } = useCart();
  const [step, setStep] = useState(1), [f, setF] = useState({}), [pay, setPay] = useState(PAY[0]), [order, setOrder] = useState(null), [busy, setBusy] = useState(false), [err, setErr] = useState("");
  const inp = (n, ph, t = "text", req = true) => <input name={n} type={t} required={req} placeholder={ph} value={f[n] || ""} onChange={(e) => setF({ ...f, [n]: e.target.value })} />;
  const go = (n) => (e) => { e.preventDefault(); setStep(n); };
  const place = async () => {
    let id = "NQ-" + Math.floor(100000 + Math.random() * 900000); // demo mode
    if (sb) {
      setBusy(true); setErr("");
      const { data, error } = await sb.rpc("place_order", { p: { customer: f, payment: pay, items: items.map((i) => ({ slug: i.slug || i.id, name: i.name, size: i.size, color: i.color, qty: i.qty })) } });
      setBusy(false);
      if (error) return setErr(error.message.includes("SOLD_OUT") ? "Sorry, " + error.message.split("SOLD_OUT:")[1] + " is sold out in your size. Please change your cart." : "Could not place the order. Please try again.");
      id = data;
    }
    setOrder({ id, items, total, pay, f }); clear();
  };
  if (order) return (
    <div className="wrap sec tall" style={{ maxWidth: 720 }}>
      <h1 className="h wide">Thank you</h1><p>Your order has been placed successfully.</p>
      <p style={{ margin: "14px 0" }}>Your order ID is <b>{order.id}</b></p>
      {order.items.map((i) => <div className="srow" key={key(i)}><span className="sth"><Garment shape={i.shape || "top"} c={i.hex || "#2b2f36"} img={i.img} /></span><span className="sname">{i.name}<small>{[i.color, i.size].filter(Boolean).join(" / ")}</small></span><span className="sx">x{i.qty}</span><span>{pkr(i.price * i.qty)}</span></div>)}
      <div className="tot"><span>Total</span><b>{pkr(order.total)}</b></div>
      <p style={{ color: "#737b86", lineHeight: 1.7 }}>Payment: {order.pay}<br />Deliver to: {order.f.name}, {order.f.address}, {order.f.city}, {order.f.province} {order.f.postal}<br />Phone: {order.f.phone}</p><br />
      <Link className="btn fill wide" href="/shop">Continue shopping</Link>
    </div>
  );
  if (!items.length) return <div className="wrap sec tall"><h1 className="h wide">Your cart is empty</h1><Link className="btn wide" href="/shop">Shop now</Link></div>;
  return (
    <div className="wrap cgrid">
      <div>
        {/* SECTION: Checkout steps (old single-page checkout: _archive/cart-page.v1.js) */}
        <h1 className="h wide">Checkout</h1>
        <div className="steps wide">{STEPS.map((l, i) => <span key={l} className={i + 1 === step ? "on" : i + 1 < step ? "done" : ""}><i className={"dot" + (i + 1 < step ? " tk" : "")}>{i + 1 < step ? "✓" : i + 1}</i>{l}{i < 3 && <em> / </em>}</span>)}</div>
        {step === 1 && (<>
          {items.map((i) => (
            <div className="crow" key={key(i)}>
              <div className="th"><Garment shape={i.shape || "top"} c={i.hex || "#2b2f36"} /></div>
              <div><div>{i.name}</div><div style={{ color: "#737b86", fontSize: 13 }}>{[i.color, i.size].filter(Boolean).join(" / ")}</div>
                <div className="qty"><button onClick={() => setQty(i, i.qty - 1)}>-</button>{i.qty}<button onClick={() => setQty(i, i.qty + 1)}>+</button><button className="rm" onClick={() => setQty(i, 0)}>Remove</button></div></div>
              <div>{pkr(i.price * i.qty)}</div>
            </div>
          ))}
          <div className="btns"><button className="btn fill wide" onClick={() => setStep(2)}>Continue</button></div>
        </>)}
        {step === 2 && <form className="form" onSubmit={go(3)}><h2 className="h wide">Information</h2>{inp("email", "Email", "email")}{inp("name", "Full name")}{inp("phone", "Phone number", "tel")}
          <div className="btns"><button type="button" className="btn wide" onClick={() => setStep(1)}>Back</button><button className="btn fill wide">Continue</button></div></form>}
        {step === 3 && <form className="form" onSubmit={go(4)}><h2 className="h wide">Shipping address</h2>{inp("address", "Address")}{inp("city", "City")}{inp("province", "Province")}{inp("postal", "Postal code", "text", false)}
          <div className="btns"><button type="button" className="btn wide" onClick={() => setStep(2)}>Back</button><button className="btn fill wide">Continue</button></div></form>}
        {step === 4 && <div className="form"><h2 className="h wide">Payment method</h2>
          {PAY.map((p) => <label key={p} className={"opt" + (pay === p ? " on" : "")}><input type="radio" name="pay" checked={pay === p} onChange={() => setPay(p)} style={{ width: "auto" }} />{p}</label>)}
          {pay !== PAY[0] && <p style={{ color: "#737b86", fontSize: 13 }}>Online payment is not connected yet. Connect a payment provider before going live.</p>}
          {err && <p style={{ color: "#a32" }}>{err}</p>}<div className="btns"><button className="btn wide" onClick={() => setStep(3)}>Back</button><button className="btn fill wide" disabled={busy} onClick={place}>Pay PKR {total.toLocaleString("en-PK")}</button></div></div>}
      </div>
      <aside className="sum"><h2 className="sub wide" style={{ marginTop: 0 }}>Order summary</h2>
        <div className="slist">{items.map((i) => <div className="srow" key={key(i)}><span className="sth"><Garment shape={i.shape || "top"} c={i.hex || "#2b2f36"} img={i.img} /></span><span className="sname">{i.name}<small>{[i.color, i.size].filter(Boolean).join(" / ")}</small></span><span className="sx">x{i.qty}</span><span>{pkr(i.price * i.qty)}</span></div>)}</div>
        <div className="tot"><span>Total</span><b>{pkr(total)}</b></div></aside>
    </div>
  );
}
