"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Garment from "./Garment";
import { useCart } from "./cart";
import { pkr } from "./catalog";
// depth stops from the front look to the back: x, feet y, height, blur, opacity
const KX = [0.74, 0.5, 0.35, 0.235], KF = [0.89, 0.777, 0.704, 0.651], KH = [0.832, 0.574, 0.436, 0.334], KB = [0, 1.5, 4, 8], KO = [1, 1, 1, 0.86];
const SK = "#c99a7a";
function Figure({ p }) {
  const c1 = p.colors[0][1], c2 = p.colors[1][1], s = p.shape;
  const top = s === "top" || s === "set" ? c1 : "#efe9dc", bot = s === "set" || s === "bottom" ? c1 : "#2b2f36";
  return (
    <svg viewBox="0 0 60 160" aria-hidden="true">
      <circle cx="30" cy="12" r="8" fill={SK} /><rect x="26" y="19" width="8" height="6" fill={SK} />
      <path d="M18 24h24l4 78H14z" fill={top} /><rect x="9" y="26" width="8" height="64" rx="4" fill={top} /><rect x="43" y="26" width="8" height="64" rx="4" fill={top} />
      <path d="M17 100h12l-1 58H19zM31 100h12l-2 58H32z" fill={bot} />
      {s === "wrap" ? <path d="M12 24h14l20 18v100H30z" fill={c1} opacity=".92" /> : <path d="M16 26l28 20-3 8-27-20z" fill={c2} opacity=".9" />}
    </svg>
  );
}
export default function Runway({ items, title, blurb }) {
  const [idx, setIdx] = useState(0), [box, setBox] = useState({ W: 1000, H: 600 }), stage = useRef(null), down = useRef(null);
  const { add } = useCart(), N = items.length, go = (n) => setIdx((i) => (i + n + N) % N);
  useEffect(() => {
    const f = () => stage.current && setBox({ W: stage.current.clientWidth, H: stage.current.clientHeight });
    f(); addEventListener("resize", f); return () => removeEventListener("resize", f);
  }, []);
  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });
  const front = items[idx];
  return (
    <section className="runway">
      <div className="stage" ref={stage} aria-label="Drag left or right, or use the arrows, to see the next piece"
        onPointerDown={(e) => { down.current = e.clientX; }}
        onPointerUp={(e) => { const d = e.clientX - down.current; if (d < -40) go(1); else if (d > 40) go(-1); }}>
        {items.map((p, i) => {
          const d = (i - idx + N) % N, e = Math.min(d, 3), h = KH[e] * box.H, w = h * 0.375;
          return (
            <div key={p.slug} className="m" onClick={() => d && setIdx(i)}
              style={{ width: w, height: h, zIndex: 10 - e, opacity: d > 3 ? 0 : KO[e], pointerEvents: d > 3 ? "none" : "auto", filter: KB[e] ? `blur(${KB[e]}px)` : "none", transform: `translate(${KX[e] * box.W - w / 2}px, ${KF[e] * box.H - h}px)` }}>
              <Figure p={p} />
            </div>
          );
        })}
        <div className="intro"><h2 className="wide">{title}</h2><p>{blurb}</p></div>
        <div className="arrows wide"><button onClick={() => go(-1)}>Prev</button><button onClick={() => go(1)}>Next</button></div>
        <div className="tag">
          <div className="look wide"><span>Look</span><span className="win"><span className="roll" style={{ transform: `translateY(${-idx * 100}%)` }}>{items.map((_, i) => <b key={i}>{String(i + 1).padStart(2, "0")}</b>)}</span></span></div>
          <p className="by">{front.brand} · {front.fabric}</p>
          <Link className="shop wide" href={`/product/${front.slug}`}>View details</Link>
        </div>
      </div>
      <aside className="rail" aria-label="Pieces in view">
        {[0, 1, 2].slice(0, Math.min(3, N)).map((o) => {
          const p = items[(idx + o) % N];
          return (
            <article className={"card" + (o % 2 ? " alt" : "")} key={idx + p.slug} style={{ animationDelay: o * 0.08 + "s" }}>
              <Link className="shot" href={`/product/${p.slug}`}><Garment shape={p.shape} c={p.colors[0][1]} c2={p.colors[1][1]} /></Link>
              <div className="meta">
                <h3 className="wide"><Link href={`/product/${p.slug}`}>{p.name}</Link></h3><span>{p.brand} · {pkr(p.price)}</span>
                <button className="add" aria-label={"Add " + p.name} onClick={() => add({ id: p.slug, slug: p.slug, name: p.name + " by " + p.brand, price: p.price, color: p.colors[0][0], hex: p.colors[0][1], size: p.sizes[p.sizes.length > 1 ? 1 : 0], shape: p.shape })} />
              </div>
            </article>
          );
        })}
      </aside>
    </section>
  );
}
