import Link from "next/link";
export const metadata = { title: "About | NAQSH" };
const V = [["Every brand in one place", "Khaadi, Sapphire, Gul Ahmed, Maria B and many more, sorted by category, fabric and season so you find your piece fast."], ["Made for Pakistan", "Lawn for summer, khaddar and karandi for winter, stitched or unstitched. Prices in rupees."], ["Easy buying", "Cash on delivery, exchange within 7 days, and delivery to your door across Pakistan."]];
export default function About() {
  return (
    <div className="wrap sec" style={{ maxWidth: 900 }}>
      <h1 className="h wide">The Label</h1>
      <p style={{ lineHeight: 1.8, color: "#737b86", fontSize: 18 }}>Naqsh makes shopping for Pakistani clothes simple. Pick men or women, choose what you want to wear, and see it one piece at a time. Replace this text with the shop's own story.</p>
      <div className="bgrid" style={{ margin: "40px 0" }}>{V.map(([t, d]) => <div className="bcard" key={t}><h3 className="wide">{t}</h3><p>{d}</p></div>)}</div>
      <h2 className="sub wide">Delivery and exchange</h2>
      <p style={{ lineHeight: 1.8, color: "#737b86" }}>Orders are confirmed by phone and delivered across Pakistan. If the size is not right, exchange it within 7 days, unworn and with tags.</p>
      <h2 className="sub wide">Contact</h2>
      <p style={{ lineHeight: 1.8, color: "#737b86" }}>WhatsApp 03XX XXXXXXX, hello@yourshop.pk</p><br />
      <Link className="btn fill wide" href="/shop">Start shopping</Link>
    </div>
  );
}
