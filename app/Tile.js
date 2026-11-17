import Link from "next/link";
import Garment from "./Garment";
import { IMG } from "./images";
// Category tile. Photo path: see app/images.js (IMG.men.categories / IMG.women.categories)
export default function Tile({ href, g, c }) {
  return (
    <Link className="tile wide photo" href={href}>
      {(c[5] || IMG[g].categories[c[0]]?.tile) ? <img src={c[5] || IMG[g].categories[c[0]].tile} alt={c[1]} /> : <Garment shape={c[2]} c="#c3cfdd" c2="#2b2f36" />}
      <span>{c[1]}</span>
    </Link>
  );
}
