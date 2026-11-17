"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Garment from "../../Garment";
import { useCart } from "../../cart";
import { pkr } from "../../catalog";
export default function Buy({ p }) {
  const [ci, setCi] = useState(0), [size, setSize] = useState(p.sizes.find((s) => !p.stock || p.stock[s] > 0) || p.sizes[0]), [added, setAdded] = useState(false);
  const { add } = useCart(), router = useRouter();
  const item = () => ({ id: p.slug, slug: p.slug, name: p.name + " by " + p.brand.name, price: p.price, color: p.colors[ci][0], hex: p.colors[ci][1], size, shape: p.shape, img: p.img });
  return (
    <div className="pd">
      <div className="art"><Garment shape={p.shape} c={p.colors[ci][1]} c2={p.colors[(ci + 1) % 3][1]} img={p.img} /></div>
      <div>
        <Link className="wide" style={{ fontSize: 10, letterSpacing: ".14em", color: "#737b86" }} href={`/shop?brand=${p.brand.slug}`}>{p.brand.name}</Link>
        <h1 className="wide">{p.name}</h1>
        <div className="pr">{pkr(p.price)}</div>
        <div className="desc" style={{ marginBottom: 8 }}>{p.fabric} · {p.stitch}</div>
        <p className="desc">{p.desc}</p>
        <span className="lab wide">Colour: {p.colors[ci][0]}</span>
        <div className="opts">{p.colors.filter((c, i, a) => a.findIndex((x) => x[0] === c[0]) === i).map((c, i) => <button key={c[0]} className={"sw" + (i === ci ? " on" : "")} style={{ background: c[1] }} aria-label={c[0]} onClick={() => setCi(i)} />)}</div>
        <span className="lab wide">Size</span>
        <div className="opts">{p.sizes.map((s) => <button key={s} disabled={!!p.stock && p.stock[s] <= 0} className={"sz" + (s === size ? " on" : "")} onClick={() => setSize(s)}>{s}</button>)}</div>
        <div className="acts">
          <button className="btn wide" disabled={p.soldOut} onClick={() => { add(item()); setAdded(true); setTimeout(() => setAdded(false), 1500); }}>{added ? "Added" : "Add to cart"}</button>
          <button className="btn fill wide" disabled={p.soldOut} onClick={() => { add(item()); router.push("/cart"); }}>Buy now</button>
        </div>
      </div>
    </div>
  );
}
