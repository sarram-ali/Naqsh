"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart";
const TABS = [["Home","/"],["Shop","/shop"],["Brands","/brands"],["About","/about"]];
const SUB = [["Men","/shop?g=men"],["Women","/shop?g=women"],["Kurtas","/shop?cat=kurta"],["Shalwar Kameez","/shop?cat=shalwar-kameez"],["Three Piece","/shop?cat=three-piece"],["Waistcoats","/shop?cat=waistcoat"],["Unstitched","/shop?cat=unstitched"]];
export default function Header() {
  const path = usePathname(), { count } = useCart();
  return (
    <header>
      <div className="r1">
        <Link className="brand wide" href="/">Naqsh</Link>
        <nav className="tabs wide">{TABS.map(([t, h]) => <Link key={h} href={h} className={(h === "/" ? path === "/" : path.startsWith(h)) ? "on" : ""}>{t}</Link>)}</nav>
        <div className="acct wide"><Link href="/cart">Cart ({count})</Link></div>
      </div>
      <nav className="r2 wide">{SUB.map(([t, h]) => <Link key={h} href={h}>{t}</Link>)}</nav>
    </header>
  );
}
