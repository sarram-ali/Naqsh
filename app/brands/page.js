import Link from "next/link";
import { getCatalog } from "../data";
import { IMG } from "../images";
export const metadata = { title: "Brands | NAQSH" };
// Photo path: app/images.js (IMG.brands)
export const dynamic = "force-dynamic";
export default async function Brands() {
  const { BRANDS, CATS } = await getCatalog();
  return (
    <div className="wrap sec">
      <h1 className="h wide">Brands</h1>
      <div className="bgrid">
        {BRANDS.map((b) => {
          const cover = b.photo || IMG.brands[b.slug];
          return (
            <div key={b.slug} className={"bcard" + (cover ? " cover" : "")} style={cover ? { backgroundImage: `linear-gradient(rgba(255,255,255,.2),rgba(255,255,255,.94) 70%),url(${cover})` } : undefined}>
              <h3 className="wide"><Link href={`/shop?brand=${b.slug}`}>{b.name}</Link></h3>
              {b.g.map((g) => (<div key={g}><p>{g === "men" ? "Men" : "Women"}</p><nav>{CATS[g].filter((c) => b.cats[g].includes(c[0])).map((c) => <Link key={c[0]} href={`/shop?g=${g}&brand=${b.slug}&cat=${c[0]}`}>{c[1]}</Link>)}</nav></div>))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
