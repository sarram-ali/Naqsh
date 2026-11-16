import Link from "next/link";
import Runway from "../Runway";
import Garment from "../Garment";
import { PRODUCTS, BRANDS, CATS, fabricsFor } from "../catalog";
export const metadata = { title: "Shop | NAQSH" };
export default function Shop({ searchParams }) {
  const { g = "", cat = "", fabric = "", stitch = "", brand = "" } = searchParams;
  const href = (o) => "/shop?" + new URLSearchParams(Object.entries({ g, cat, fabric, stitch, brand, ...o }).filter(([, v]) => v));
  const gl = g ? [g] : ["men", "women"], focused = cat || fabric || stitch || brand;
  const list = PRODUCTS.filter((p) => (!g || p.g === g) && (!cat || p.cat === cat) && (!fabric || p.fabric === fabric) && (!stitch || p.stitch === stitch) && (!brand || p.brand.slug === brand));
  const cats = [...new Map(gl.flatMap((x) => CATS[x]).map((c) => [c[0], c[1]]))];
  const brands = BRANDS.filter((b) => gl.some((x) => b.cats[x].length && (!cat || b.cats[x].includes(cat))));
  const title = [g && (g === "men" ? "Men" : "Women"), cat && cats.find((c) => c[0] === cat)?.[1], fabric, stitch, brand && BRANDS.find((b) => b.slug === brand)?.name].filter(Boolean).join(" / ") || "Shop";
  const Chip = ({ on, to, children }) => <Link className={"chip wide" + (on ? " on" : "")} href={to}>{children}</Link>;
  const Row = ({ label, children }) => <div className="frow"><span className="wide">{label}</span><div className="chips">{children}</div></div>;
  const items = list.map((p) => ({ slug: p.slug, name: p.name, brand: p.brand.name, price: p.price, shape: p.shape, colors: p.colors, sizes: p.sizes, fabric: p.fabric }));
  return (
    <>
      <div className="wrap" style={{ paddingTop: 36 }}>
        <h1 className="h wide">{title}</h1>
        <Row label="For"><Chip on={!g} to={href({ g: "", cat: "" })}>All</Chip><Chip on={g === "men"} to={href({ g: "men", cat: "" })}>Men</Chip><Chip on={g === "women"} to={href({ g: "women", cat: "" })}>Women</Chip></Row>
        {focused ? (
          <>
            <Row label="Category"><Chip on={!cat} to={href({ cat: "", fabric: "" })}>Any</Chip>{cats.map(([s, l]) => <Chip key={s} on={cat === s} to={href({ cat: s, fabric: "" })}>{l}</Chip>)}</Row>
            <Row label="Fabric"><Chip on={!fabric} to={href({ fabric: "" })}>Any</Chip>{fabricsFor(g, cat).map((f) => <Chip key={f} on={fabric === f} to={href({ fabric: f })}>{f}</Chip>)}</Row>
            <Row label="Stitching"><Chip on={!stitch} to={href({ stitch: "" })}>Any</Chip><Chip on={stitch === "Stitched"} to={href({ stitch: "Stitched" })}>Stitched</Chip><Chip on={stitch === "Unstitched"} to={href({ stitch: "Unstitched" })}>Unstitched</Chip></Row>
            <Row label="Brand"><Chip on={!brand} to={href({ brand: "" })}>Any</Chip>{brands.map((b) => <Chip key={b.slug} on={brand === b.slug} to={href({ brand: b.slug })}>{b.name}</Chip>)}</Row>
          </>
        ) : (
          <>
            {gl.map((x) => (<div key={x}><h2 className="sub wide">{x} categories</h2><div className="tiles">{CATS[x].map((c) => <Link key={c[0]} className="tile wide" href={href({ g: x, cat: c[0] })}><Garment shape={c[2]} c="#c3cfdd" c2="#2b2f36" />{c[1]}</Link>)}</div></div>))}
            <h2 className="sub wide">By fabric</h2><div className="chips">{fabricsFor(g).map((f) => <Chip key={f} to={href({ fabric: f })}>{f}</Chip>)}</div>
            <h2 className="sub wide">By brand</h2><div className="chips">{brands.map((b) => <Chip key={b.slug} to={href({ brand: b.slug })}>{b.name}</Chip>)}</div>
          </>
        )}
      </div>
      {focused && (list.length
        ? <Runway key={[g, cat, fabric, stitch, brand].join("|")} items={items} title={title} blurb={`${list.length} pieces. Drag left or right, or use the arrows.`} />
        : <div className="wrap sec"><p>Nothing matches these filters. Try removing one.</p></div>)}
      <div style={{ height: 48 }} />
    </>
  );
}
