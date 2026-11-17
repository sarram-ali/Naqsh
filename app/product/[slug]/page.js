import { notFound } from "next/navigation";
import Buy from "./Buy";
import Card from "../../Card";
import { getCatalog } from "../../data";
export const dynamic = "force-dynamic";
export default async function Product({ params }) {
  const { PRODUCTS } = await getCatalog();
  const p = PRODUCTS.find((x) => x.slug === params.slug);
  if (!p) notFound();
  const rel = PRODUCTS.filter((x) => x.cat === p.cat && x.g === p.g && x.slug !== p.slug).slice(0, 4);
  return (
    <div className="wrap">
      <Buy p={p} />
      <h2 className="h wide" style={{ marginTop: 40 }}>You may also like</h2>
      <div className="pgrid" style={{ paddingBottom: 72 }}>{rel.map((x) => <Card key={x.slug} p={x} />)}</div>
    </div>
  );
}
