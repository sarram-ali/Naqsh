"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart";
const TABS = [["Home","/"],["Shop","/shop"],["Brands","/brands"],["About","/about"]];
const SUB = [["Men","/shop?g=men"],["Women","/shop?g=women"],["New Arrivals","/shop?new=1"],["Sale","/shop?sale=1"],["Abaya, Gown, Hijab","/shop?g=women&group=modest"]];
export default function Header() {
  const path = usePathname(), { count } = useCart();
  if (path.startsWith("/admin")) return null;
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
