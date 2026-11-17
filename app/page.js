import Home from "./Home";
import { getCatalog } from "./data";
export const dynamic = "force-dynamic";
export default async function Page() {
  const { CATS, BRANDS, PRODUCTS } = await getCatalog();
  return <Home CATS={CATS} BRANDS={BRANDS} PRODUCTS={PRODUCTS} />;
}
