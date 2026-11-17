import { sb } from "./supabase";
import * as demo from "./catalog";
import { IMG } from "./images";
const ORDER = ["XS", "S", "M", "L", "XL", "XXL"];
// One place that loads the store: from Supabase when connected, otherwise the demo data in catalog.js.
export async function getCatalog() {
  if (!sb) return { CATS: demo.CATS, BRANDS: demo.BRANDS, PRODUCTS: demo.PRODUCTS, live: false };
  const [c, f, b, p, s] = await Promise.all([
    sb.from("categories").select("*").eq("active", true).order("name"), sb.from("fabrics").select("*").eq("active", true).order("name"),
    sb.from("brands").select("*").eq("active", true).order("name"), sb.from("products").select("*").eq("active", true).order("created_at", { ascending: false }), sb.from("stock").select("*"),
  ]);
  const err = [c, f, b, p, s].find((r) => r.error); if (err) console.error("Supabase:", err.error.message);
  const cat = Object.fromEntries((c.data || []).map((x) => [x.id, x])), fab = Object.fromEntries((f.data || []).map((x) => [x.id, x])), brand = Object.fromEntries((b.data || []).map((x) => [x.id, x]));
  const stockBy = {}; (s.data || []).forEach((r) => ((stockBy[r.product_id] ||= {})[r.size] = r.qty));
  const names = (f.data || []).map((x) => x.name), CATS = { men: [], women: [] };
  (c.data || []).forEach((x) => CATS[x.gender].push([x.slug, x.name, x.shape, 0, names, x.photo_url]));
  const PRODUCTS = (p.data || []).filter((x) => cat[x.category_id] && brand[x.brand_id]).map((x) => {
    const ct = cat[x.category_id], br = brand[x.brand_id], fb = fab[x.fabric_id], st = stockBy[x.id] || {};
    const base = (x.colors || []).map((k) => [k.name, k.hex]), bc = base.length ? base : [["Default", "#2b2f36"]];
    const photos = x.photos?.length ? x.photos : IMG[ct.gender].categories[ct.slug]?.photos || [];
    const sizes = Object.keys(st).sort((a, z) => (ORDER.indexOf(a) + 1 || 99) - (ORDER.indexOf(z) + 1 || 99) || a.localeCompare(z));
    return { id: x.id, slug: x.slug, name: x.name, desc: x.description, brand: { slug: br.slug, name: br.name }, g: ct.gender, cat: ct.slug, catName: ct.name, shape: ct.shape, fabric: fb?.name || "", season: fb?.season || "", stitch: x.stitch, price: x.price, was: x.was_price, isNew: x.is_new, colors: [0, 1, 2].map((j) => bc[j % bc.length]), sizes: sizes.length ? sizes : ["One size"], stock: st, soldOut: !Object.values(st).some((q) => q > 0), img: photos[0] || null, imgs: photos };
  });
  const BRANDS = (b.data || []).map((x) => {
    const cats = { men: [], women: [] };
    PRODUCTS.filter((q) => q.brand.slug === x.slug).forEach((q) => { if (!cats[q.g].includes(q.cat)) cats[q.g].push(q.cat); });
    return { slug: x.slug, name: x.name, photo: x.photo_url, cats, g: ["men", "women"].filter((g) => cats[g].length) };
  }).filter((x) => x.g.length);
  return { CATS, BRANDS, PRODUCTS, live: true };
}
