import Link from "next/link";
import { IMG } from "./images";
// Category tile. Photo path: see app/images.js (IMG.men.categories / IMG.women.categories)
export default function Tile({ href, g, c }) {
  return (
    <Link className="tile wide photo" href={href}>
      <img src={IMG[g].categories[c[0]].tile} alt={c[1]} />
      <span>{c[1]}</span>
    </Link>
  );
}
