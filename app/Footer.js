import Link from "next/link";
// Edit the contact details below for each shop.
export default function Footer() {
  return (
    <footer className="ft">
      <div className="ftgrid">
        <div><div className="wide" style={{ fontSize: 18, letterSpacing: ".2em", marginBottom: 14 }}>Naqsh</div><p>Pakistani clothing for men and women, from the brands you know. Kurtas, shalwar kameez, three piece, formal wear and modest wear.</p></div>
        <div><h4 className="wide">Shop</h4><Link href="/shop?g=men">Men</Link><Link href="/shop?g=women">Women</Link><Link href="/shop?new=1">New Arrivals</Link><Link href="/shop?sale=1">Sale</Link><Link href="/shop?g=women&group=modest">Abaya, Gown, Hijab</Link></div>
        <div><h4 className="wide">Help</h4><span>Cash on delivery</span><span>Delivery across Pakistan</span><span>Exchange within 7 days</span><Link href="/cart">Your cart</Link><Link href="/about">About us</Link></div>
        <div><h4 className="wide">Contact</h4><span>WhatsApp: 03XX XXXXXXX</span><span>hello@yourshop.pk</span><span>Your shop address, City, Pakistan</span><span>Mon to Sat, 10am to 8pm</span></div>
      </div>
      <div className="ftbar"><span>© 2026 Naqsh. All rights reserved.</span><span>Pay by cash, card, EasyPaisa or JazzCash</span></div>
    </footer>
  );
}
