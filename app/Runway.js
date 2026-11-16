"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Garment from "./Garment";
import QuickAdd from "./QuickAdd";
import { pkr } from "./catalog";
const VIEWS = ["front", "side", "detail"];
// depth stops from the front look to the back: x, feet y, height, blur, opacity
const KX = [0.74, 0.5, 0.35, 0.235], KF = [0.89, 0.777, 0.704, 0.651], KH = [0.832, 0.574, 0.436, 0.334], KB = [0, 1.5, 4, 8], KO = [1, 1, 1, 0.86];
const SK = "#c99a7a";
function Figure({ p }) {
  if (p.img) return <img src={p.img} alt={p.name} />;
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
  const N = items.length, go = (n) => setIdx((i) => (i + n + N) % N);
  useEffect(() => {
    const f = () => stage.current && setBox({ W: stage.current.clientWidth, H: stage.current.clientHeight });
    f(); addEventListener("resize", f); return () => removeEventListener("resize", f);
  }, []);
  useEffect(() => {
    const k = (e) => { if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  });
  useEffect(() => {
    // Wheel over the stage changes the piece; outside the stage the page scrolls as normal.
    const el = stage.current; if (!el) return;
    let acc = 0, t = 0, last = 0;
    const w = (e) => { e.preventDefault(); const now = Date.now(); if (now - last > 200) acc = 0; last = now; acc += e.deltaY + e.deltaX; if (Math.abs(acc) > 30 && now - t > 420) { go(acc > 0 ? 1 : -1); acc = 0; t = now; } };
    el.addEventListener("wheel", w, { passive: false });
    return () => el.removeEventListener("wheel", w);
  }, [N]);
  const front = items[idx], real = (front.imgs || []).slice(0, 3);
  const pics = real.length >= 2 ? real : [...real, ...Array(3 - real.length).fill(null)]; // 2 to 3 boxes
  const quick = { id: front.slug, slug: front.slug, name: front.name + " by " + front.brand, price: front.price, color: front.colors[0][0], hex: front.colors[0][1], size: front.sizes[front.sizes.length > 1 ? 1 : 0], shape: front.shape, img: front.img };
  return (
    <section className="runway">
      <div className="stage" ref={stage} aria-label="Drag left or right, or use the arrows, to see the next piece"
        onPointerDown={(e) => { down.current = e.clientX; }}
        onPointerUp={(e) => { const d = e.clientX - down.current; if (d < -40) go(1); else if (d > 40) go(-1); }}>
        {items.map((p, i) => {
          const d = (i - idx + N) % N, out = N > 4 && d === N - 1, e = out ? 0 : Math.min(d, 3), h = KH[e] * box.H, w = h * 0.375;
          return (
            <div key={p.slug} className="m" onClick={() => d && setIdx(i)}
              style={{ width: w, height: h, zIndex: 10 - e, opacity: d > 3 || out ? 0 : KO[e], pointerEvents: d > 3 || out ? "none" : "auto", filter: KB[e] ? `blur(${KB[e]}px)` : "none", transform: `translate(${(out ? 1.22 : KX[e]) * box.W - w / 2}px, ${KF[e] * box.H - h}px)` }}>
              <Figure p={p} />
            </div>
          );
        })}
        <div className="intro"><h2 className="wide">{title}</h2><p>{blurb}</p></div>
        <div className="arrows wide"><button onClick={() => go(-1)}>Prev</button><button onClick={() => go(1)}>Next</button></div>
        <div className="tag" key={front.slug}>
          {/* SECTION: Price (replaced the "Look 01" number) */}
          <div className="look wide">{pkr(front.price)}{front.was && <s className="was">{pkr(front.was)}</s>}</div>
          <p className="by">{front.brand} · {front.fabric}</p>
          <div className="tagbtns"><Link className="shop wide" href={`/product/${front.slug}`}>View details</Link><QuickAdd item={quick} className="btn fill wide qadd" label="Add to cart" /></div>
        </div>
      </div>
      <aside className="rail pics" aria-label="More views of this piece" style={{ "--n": pics.length }}>
        {/* SECTION: Photo boxes (2 to 3 photos of the front piece; replaced the Price box, see _archive/Runway.v2.js) */}
        {pics.map((src, i) => (
          <div className={"card" + (i % 2 ? " alt" : "")} key={front.slug + i} style={{ animationDelay: i * 0.08 + "s" }}>
            <span className={"shot v-" + VIEWS[i]}><Garment shape={front.shape} c={front.colors[0][1]} c2={front.colors[1][1]} img={src} /></span>
          </div>
        ))}
      </aside>
    </section>
  );
}
