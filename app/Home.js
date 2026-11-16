"use client";
import Link from "next/link";
import { useState } from "react";
import Garment from "./Garment";
import Card from "./Card";
import Tile from "./Tile";
import { IMG } from "./images";
import { BRANDS, CATS, PRODUCTS, fabricsFor } from "./catalog";
const T = { men: { bg: "#e7eff6", h: "for him", sub: "Kurtas, shalwar kameez and waistcoats from the brands Pakistan wears.", cat: "kurta" }, women: { bg: "#f8e9ec", h: "for her", sub: "Lawn, three piece sets and formal wear from Pakistan's best loved labels.", cat: "three-piece" } };
export default function Home() {
  const [g, setG] = useState("men"), t = T[g];
  const list = PRODUCTS.filter((p) => p.g === g), brands = BRANDS.filter((b) => b.cats[g].length);
  // Photos: see app/images.js
  const poster = IMG[g].banner, banner = IMG.home.eidBanner;
  const bg = poster ? `linear-gradient(90deg,rgba(255,255,255,.85),rgba(255,255,255,.15)),url(${poster}) center/cover` : t.bg;
  return (
    <>
      {/* SECTION: Home hero */}
      <section className="hero" style={{ background: bg }}>
        <div className="toggle htog wide" role="group" aria-label="Shop for">
          <span className="pill" style={{ transform: `translateX(${g === "men" ? 0 : 100}%)` }} />
          <button className={g === "men" ? "on" : ""} onClick={() => setG("men")}>Men</button>
          <button className={g === "women" ? "on" : ""} onClick={() => setG("women")}>Women</button>
        </div>
        <div>
          <p className="wide" style={{ fontSize: 11, letterSpacing: ".16em", color: "#737b86" }}>Eid Edit 2027</p>
          <h1 className="wide" key={g}>Eastern wear {t.h}</h1>
          <p className="hsub">{t.sub}</p>
          <div className="acts"><Link className="btn fill wide" href={`/shop?g=${g}`}>Shop {g}</Link><Link className="btn wide" href="/brands">All brands</Link></div>
        </div>
        <div className="fl">{[1, 2, 3].map((n) => <Link key={g + n} href={`/shop?g=${g}`} className="fc"><img src={IMG[g].boxes[n - 1]} alt="" /></Link>)}</div>
      </section>
      {/* SECTION: Brand strip */}
      <div className="mq"><div>{[...brands, ...brands].map((b, i) => <Link key={i} className="wide" href={`/shop?g=${g}&brand=${b.slug}`}>{b.name}</Link>)}</div></div>
      {/* SECTION: Categories and fabrics */}
      <section className="wrap sec">
        <h2 className="h wide">Shop {g} by category</h2>
        <div className="tiles">{CATS[g].map((c) => <Tile key={c[0]} g={g} c={c} href={`/shop?g=${g}&cat=${c[0]}`} />)}</div>
        <h3 className="sub wide">Shop by fabric</h3>
        <div className="chips">{fabricsFor(g).map((f) => <Link key={f} className="chip wide" href={`/shop?g=${g}&fabric=${encodeURIComponent(f)}`}>{f}</Link>)}</div>
      </section>
      {/* SECTION: Featured */}
      <section className="wrap sec">
        <h2 className="h wide">Featured for {g}</h2>
        <div className="pgrid">{list.filter((_, i) => i % 9 === 0).slice(0, 8).map((p) => <Card key={p.slug} p={p} />)}</div>
      </section>
      {/* SECTION: Banner */}
      <div className="banner" style={banner ? { background: `linear-gradient(rgba(22,25,31,.6),rgba(22,25,31,.6)),url(${banner}) center/cover` } : undefined}><h2 className="wide">Eid Edit 2027</h2><p>New season pieces in every brand and every fabric.</p><Link className="btn wide" href={`/shop?g=${g}`}>Explore {g}</Link></div>
      <section className="wrap sec trust">
        {[["Cash on delivery", "Pay when it arrives"], ["Easy exchange", "Within 7 days"], ["Delivery", "Across Pakistan"], ["WhatsApp support", "Ask before you buy"]].map(([a, b]) => <div key={a}><b className="wide" style={{ display: "block", marginBottom: 6, fontSize: 11, color: "#16191f" }}>{a}</b>{b}</div>)}
      </section>
    </>
  );
}
