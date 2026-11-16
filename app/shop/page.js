import Link from "next/link";
import Runway from "../Runway";
import Tile from "../Tile";
import { PRODUCTS, BRANDS, CATS, SEASONS, fabricsFor } from "../catalog";
export const metadata = { title: "Shop | NAQSH" };
export default function Shop({ searchParams }) {
  const { g = "", cat = "", fabric = "", stitch = "", season = "", brand = "", new: nw = "", sale = "", group = "" } = searchParams;
  const MODEST = ["abaya", "gown", "hijab"];
  const href = (o) => "/shop?" + new URLSearchParams(Object.entries({ g, cat, fabric, stitch, season, brand, new: nw, sale, group, ...o }).filter(([, v]) => v));
  const gl = g ? [g] : ["men", "women"], focused = cat || fabric || stitch || season || brand || nw || sale;
  const list = PRODUCTS.filter((p) => (!g || p.g === g) && (!cat || p.cat === cat) && (!fabric || p.fabric === fabric) && (!stitch || p.stitch === stitch) && (!season || p.season === season) && (!brand || p.brand.slug === brand) && (!nw || p.isNew) && (!sale || p.was) && (!group || MODEST.includes(p.cat)));
  const cats = [...new Map(gl.flatMap((x) => CATS[x]).filter((c) => !group || MODEST.includes(c[0])).map((c) => [c[0], c[1]]))];
  const brands = BRANDS.filter((b) => gl.some((x) => b.cats[x].length && (!cat || b.cats[x].includes(cat))));
  const title = [nw && "New arrivals", sale && "Sale", group && !cat && "Abaya, gown, hijab", g && (g === "men" ? "Men" : "Women"), cat && cats.find((c) => c[0] === cat)?.[1], fabric, stitch, season, brand && BRANDS.find((b) => b.slug === brand)?.name].filter(Boolean).join(" / ") || "Shop";
  const Chip = ({ on, to, children }) => <Link className={"chip wide" + (on ? " on" : "")} href={to}>{children}</Link>;
  // A dropdown that needs no JavaScript: one pill per filter, options inside.
  const Dd = ({ label, value, opts, cols }) => (
    <details className="dd"><summary className={"chip wide" + (value ? " on" : "")}>{label}{value ? ": " + value : ""}</summary>
      <div className={"menu" + (cols ? " cols" : "")}>{opts.map(([v, l, to]) => <Link key={l} className={v ? "on" : ""} href={to}>{l}</Link>)}</div></details>
  );
  const opt = (key, cur, list2) => [[!cur, "Any", href({ [key]: "" })], ...list2.map(([v, l]) => [cur === v, l, href({ [key]: v })])];
  const items = list.map((p) => ({ slug: p.slug, name: p.name, brand: p.brand.name, price: p.price, shape: p.shape, colors: p.colors, sizes: p.sizes, fabric: p.fabric, stitch: p.stitch, img: p.img, imgs: p.imgs, was: p.was }));
  return (
    <>
      <div className="wrap" style={{ paddingTop: 32 }}>
        {/* SECTION: Shop filters (previous 5 chip rows are in _archive/shop-page.v1.js) */}
        <h1 className="h wide">{title}</h1>
        <div className="seg wide"><Link className={!g ? "on" : ""} href={href({ g: "", cat: "" })}>All</Link><Link className={g === "men" ? "on" : ""} href={href({ g: "men", cat: "" })}>Men</Link><Link className={g === "women" ? "on" : ""} href={href({ g: "women", cat: "" })}>Women</Link></div>
        <div className="catrow"><Chip on={!cat} to={href({ cat: "", fabric: "" })}>All clothes</Chip>{cats.map(([s, l]) => <Chip key={s} on={cat === s} to={href({ cat: s, fabric: "" })}>{l}</Chip>)}</div>
        <div className="bar">
          <Dd label="Fabric" value={fabric} opts={opt("fabric", fabric, fabricsFor(g, cat).map((f) => [f, f]))} />
          <Dd label="Season" value={season} opts={opt("season", season, SEASONS.map((x) => [x, x]))} />
          <Dd label="Stitching" value={stitch} opts={opt("stitch", stitch, [["Stitched", "Stitched"], ["Unstitched", "Unstitched"]])} />
          <Dd label="Brand" value={brand && BRANDS.find((b) => b.slug === brand)?.name} cols opts={opt("brand", brand, brands.map((b) => [b.slug, b.name]))} />
          {(fabric || season || stitch || brand || cat) && <Link className="clear wide" href={href({ cat: "", fabric: "", season: "", stitch: "", brand: "", new: "", sale: "" })}>Clear all</Link>}
        </div>
        {!focused && gl.map((x) => (<div key={x}><h2 className="sub wide">{x} categories</h2><div className="tiles">{CATS[x].filter((c) => !group || MODEST.includes(c[0])).map((c) => <Tile key={c[0]} g={x} c={c} href={href({ g: x, cat: c[0] })} />)}</div></div>))}
        {focused ? <p className="count">{list.length} pieces</p> : null}
      </div>
      {focused && (list.length
        ? <Runway key={[g, cat, fabric, stitch, season, brand].join("|")} items={items} title={title} blurb="Scroll, drag, or use the arrows." />
        : <div className="wrap sec"><p>Nothing matches these filters. Try clearing one.</p></div>)}
      <div style={{ height: 48 }} />
    </>
  );
}
