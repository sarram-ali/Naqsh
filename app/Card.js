import Link from "next/link";
import Garment from "./Garment";
import QuickAdd from "./QuickAdd";
import { pkr } from "./catalog";
export default function Card({ p }) {
  const item = { id: p.slug, slug: p.slug, name: p.name + " by " + p.brand.name, price: p.price, color: p.colors[0][0], hex: p.colors[0][1], size: p.sizes[p.sizes.length > 1 ? 1 : 0], shape: p.shape, img: p.img };
  return (
    <div className="pc">
      <Link href={`/product/${p.slug}`}>
        <div className="art"><Garment shape={p.shape} c={p.colors[0][1]} c2={p.colors[1][1]} img={p.img} /></div>
        <div className="nm wide">{p.name}</div><div className="br">{p.brand.name}</div>
        <div className="pr">{pkr(p.price)}{p.was && <s>{pkr(p.was)}</s>}</div>
      </Link>
      {p.soldOut ? <span className="so">Sold out</span> : <QuickAdd item={item} />}
    </div>
  );
}
