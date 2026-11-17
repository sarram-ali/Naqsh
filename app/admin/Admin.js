"use client";
import { useEffect, useState } from "react";
import { sb } from "../supabase";
const slugify = (x) => String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const pkr = (n) => "Rs " + Number(n || 0).toLocaleString("en-PK");
const STATUS = ["new", "confirmed", "shipped", "delivered", "cancelled"];
async function upload(file, folder) {
  const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, "_")}`;
  const { error } = await sb.storage.from("photos").upload(path, file);
  if (error) throw error;
  return sb.storage.from("photos").getPublicUrl(path).data.publicUrl;
}
function useRows(fn) {
  const [rows, set] = useState(null), [n, setN] = useState(0);
  useEffect(() => { fn().then((r) => set(r.data || [])); }, [n]);
  return [rows, () => setN((x) => x + 1)];
}
const Msg = ({ children }) => <div className="adm login"><p>{children}</p></div>;

export default function Admin() {
  const [session, setSession] = useState(undefined), [ok, setOk] = useState(null), [tab, setTab] = useState("Dashboard");
  useEffect(() => {
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = sb.auth.onAuthStateChange((_, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (session) sb.rpc("is_admin").then(({ data }) => setOk(!!data)); else setOk(null); }, [session]);
  if (!sb) return <Msg>Supabase is not connected yet. Add your two keys to the .env.local file (see SETUP.md), then restart.</Msg>;
  if (session === undefined) return <Msg>Loading...</Msg>;
  if (!session) return <Login />;
  if (ok === null) return <Msg>Checking your account...</Msg>;
  if (!ok) return <Msg>This account is not an admin. <button className="lnk" onClick={() => sb.auth.signOut()}>Sign out</button></Msg>;
  const TABS = { Dashboard: <Dashboard />, Orders: <Orders />, Products: <Products />, Brands: <Crud key="b" table="brands" title="Brand" fields={[{ k: "name", label: "Brand name" }, { k: "photo_url", label: "Photo or logo", photo: true }]} blank={{}} />,
    Categories: <Crud key="c" table="categories" title="Category" fields={[{ k: "name", label: "Category name" }, { k: "gender", label: "For", opts: ["men", "women"] }, { k: "shape", label: "Placeholder shape", opts: ["top", "set", "bottom", "wrap", "long"] }, { k: "photo_url", label: "Tile photo", photo: true }]} blank={{ gender: "men", shape: "top" }} />,
    Fabrics: <Crud key="f" table="fabrics" title="Fabric" fields={[{ k: "name", label: "Fabric name" }, { k: "season", label: "Season", opts: ["Summer", "Spring", "Autumn", "Winter"] }]} blank={{ season: "Summer" }} /> };
  return (
    <div className="adm">
      <div className="admtop"><b className="wide">Naqsh admin</b><a href="/" target="_blank">View site</a><button className="lnk" onClick={() => sb.auth.signOut()}>Sign out</button></div>
      <div className="chips">{Object.keys(TABS).map((t) => <button key={t} className={"chip wide" + (t === tab ? " on" : "")} onClick={() => setTab(t)}>{t}</button>)}</div>
      {TABS[tab]}
    </div>
  );
}
function Login() {
  const [e, setE] = useState(""), [p, setP] = useState(""), [m, setM] = useState("");
  return (
    <div className="adm login"><h1 className="h wide">Admin</h1>
      <form className="form" onSubmit={async (ev) => { ev.preventDefault(); const { error } = await sb.auth.signInWithPassword({ email: e, password: p }); if (error) setM(error.message); }}>
        <input type="email" required placeholder="Email" value={e} onChange={(x) => setE(x.target.value)} /><input type="password" required placeholder="Password" value={p} onChange={(x) => setP(x.target.value)} />
        {m && <p className="err">{m}</p>}<button className="btn fill wide">Sign in</button></form></div>
  );
}
function Dashboard() {
  const [o] = useRows(() => sb.from("orders").select("id,order_no,name,status,total,created_at").order("created_at", { ascending: true }).limit(5000));
  if (!o) return <p>Loading...</p>;
  const n = (s) => o.filter((x) => x.status === s).length, sum = (l) => l.reduce((a, b) => a + b.total, 0);
  const done = o.filter((x) => x.status === "delivered"), open = o.filter((x) => ["new", "confirmed", "shipped"].includes(x.status));
  const days = [...Array(14)].map((_, i) => { const d = new Date(Date.now() - (13 - i) * 864e5), k = d.toISOString().slice(0, 10); return { l: d.getDate(), v: sum(done.filter((x) => x.created_at.slice(0, 10) === k)) }; });
  const max = Math.max(1, ...days.map((d) => d.v));
  return (
    <div>
      <div className="cards">{[["All orders", o.length], ["New", n("new")], ["Confirmed", n("confirmed")], ["Shipped", n("shipped")], ["Delivered", n("delivered")], ["Cancelled", n("cancelled")]].map(([a, b]) => <div key={a} className="acard"><span>{a}</span><b>{b}</b></div>)}</div>
      <div className="cards"><div className="acard"><span>Earned (delivered orders)</span><b>{pkr(sum(done))}</b></div><div className="acard"><span>Waiting to be delivered</span><b>{pkr(sum(open))}</b></div></div>
      <h2 className="sub wide">Earnings, last 14 days</h2>
      <div className="gbars">{days.map((d, i) => <div key={i} className="gb" title={pkr(d.v)}><i style={{ height: (d.v / max) * 100 + "%" }} /><span>{d.l}</span></div>)}</div>
      <h2 className="sub wide">Oldest orders waiting (do these first)</h2>
      {open.slice(0, 8).map((x) => <div key={x.id} className="arow"><span>{x.order_no} · {x.name}</span><span>{new Date(x.created_at).toLocaleDateString()} · {x.status} · {pkr(x.total)}</span></div>)}
      {!open.length && <p>No orders waiting.</p>}
    </div>
  );
}
function Orders() {
  const [f, setF] = useState("open"), [rows, reload] = useRows(() => sb.from("orders").select("*, order_items(*)").order("created_at", { ascending: true }).limit(500));
  if (!rows) return <p>Loading...</p>;
  const list = rows.filter((o) => f === "all" || (f === "open" ? ["new", "confirmed", "shipped"].includes(o.status) : o.status === f));
  const setStatus = async (id, status) => { await sb.from("orders").update({ status }).eq("id", id); reload(); };
  return (
    <div>
      <div className="chips">{["open", "all", ...STATUS].map((s) => <button key={s} className={"chip wide" + (f === s ? " on" : "")} onClick={() => setF(s)}>{s}</button>)}</div>
      <p className="count">{list.length} orders, oldest first</p>
      {list.map((o) => (
        <div key={o.id} className="aorder">
          <div className="arow"><b>{o.order_no}</b><span>{new Date(o.created_at).toLocaleString()}</span>
            <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)}>{STATUS.map((s) => <option key={s}>{s}</option>)}</select><b>{pkr(o.total)}</b></div>
          <p>{o.name} · {o.phone} · {o.email}<br />{o.address}, {o.city}, {o.province} {o.postal}<br />Payment: {o.payment} · <a href={"https://wa.me/" + (o.phone || "").replace(/\D/g, "").replace(/^0/, "92")} target="_blank">WhatsApp customer</a></p>
          {o.order_items.map((i) => <div key={i.id} className="arow">{i.photo && <img src={i.photo} alt="" />}<span>{i.name} ({[i.color, i.size].filter(Boolean).join(" / ")})</span><span>x{i.qty} · {pkr(i.price * i.qty)}</span></div>)}
        </div>
      ))}
    </div>
  );
}
function Products() {
  const [rows, reload] = useRows(() => sb.from("products").select("*, brands(name), categories(name,gender), stock(size,qty)").order("created_at", { ascending: false })), [edit, setEdit] = useState(null);
  if (edit) return <ProductForm p={edit} done={() => { setEdit(null); reload(); }} />;
  if (!rows) return <p>Loading...</p>;
  const bump = async (p, s, d) => { await sb.from("stock").update({ qty: Math.max(0, s.qty + d) }).eq("product_id", p.id).eq("size", s.size); reload(); };
  return (
    <div>
      <button className="btn fill wide" onClick={() => setEdit({})}>Add product</button>
      {rows.map((p) => (
        <div key={p.id} className="arow prow">
          {p.photos[0] ? <img src={p.photos[0]} alt="" /> : <span className="noimg" />}
          <span><b>{p.name}</b><br />{p.brands?.name} · {p.categories?.gender} {p.categories?.name} · {pkr(p.price)}{!p.active && " · HIDDEN"}</span>
          <span className="stk">{p.stock.map((s) => <span key={s.size}>{s.size} <button onClick={() => bump(p, s, -1)}>-</button>{s.qty}<button onClick={() => bump(p, s, 1)}>+</button></span>)}</span>
          <span><button className="lnk" onClick={() => setEdit(p)}>Edit</button> <button className="lnk" onClick={async () => { if (confirm("Delete " + p.name + "?")) { await sb.from("products").delete().eq("id", p.id); reload(); } }}>Delete</button></span>
        </div>
      ))}
    </div>
  );
}
function ProductForm({ p, done }) {
  const [cats] = useRows(() => sb.from("categories").select("*").order("name")), [brands] = useRows(() => sb.from("brands").select("*").order("name")), [fabs] = useRows(() => sb.from("fabrics").select("*").order("name"));
  const [v, setV] = useState({ gender: p.categories?.gender || "men", category_id: p.category_id || "", brand_id: p.brand_id || "", fabric_id: p.fabric_id || "", stitch: p.stitch || "Stitched", name: p.name || "", description: p.description || "", price: p.price || "", was_price: p.was_price || "", is_new: !!p.is_new, active: p.active ?? true,
    colors: (p.colors || []).map((c) => c.name + ":" + c.hex).join(", "), photos: p.photos || [], stock: p.stock || [] }), [msg, setMsg] = useState(""), [busy, setBusy] = useState(false);
  const set = (k, x) => setV((o) => ({ ...o, [k]: x })), setS = (i, k, x) => set("stock", v.stock.map((s, j) => (j === i ? { ...s, [k]: x } : s)));
  if (!cats || !brands || !fabs) return <p>Loading...</p>;
  const save = async () => {
    if (!v.name || !v.category_id || !v.brand_id || !v.price) return setMsg("Please fill name, category, brand and price.");
    if (v.photos.length < 2 || v.photos.length > 3) return setMsg("Please add 2 or 3 photos (the first one is the front).");
    setBusy(true);
    const row = { category_id: v.category_id, brand_id: v.brand_id, fabric_id: v.fabric_id || null, stitch: v.stitch, name: v.name, description: v.description, price: +v.price, was_price: v.was_price ? +v.was_price : null, is_new: v.is_new, active: v.active, photos: v.photos,
      colors: v.colors.split(",").map((c) => c.split(":")).filter((c) => c[0].trim()).map(([n, h]) => ({ name: n.trim(), hex: (h || "#2b2f36").trim() })) };
    let id = p.id, r;
    if (id) r = await sb.from("products").update(row).eq("id", id);
    else { row.slug = slugify(brands.find((b) => b.id === v.brand_id)?.name + " " + v.name) + "-" + Math.random().toString(36).slice(2, 6); r = await sb.from("products").insert(row).select("id").single(); id = r.data?.id; }
    if (r.error) { setBusy(false); return setMsg(r.error.message); }
    const st = v.stock.filter((s) => s.size.trim()).map((s) => ({ product_id: id, size: s.size.trim(), qty: Math.max(0, +s.qty || 0) }));
    if (st.length) await sb.from("stock").delete().eq("product_id", id).not("size", "in", `(${st.map((s) => '"' + s.size + '"').join(",")})`); else await sb.from("stock").delete().eq("product_id", id);
    if (st.length) await sb.from("stock").upsert(st);
    done();
  };
  return (
    <div className="form pform">
      <h2 className="h wide">{p.id ? "Edit product" : "Add product"}</h2>
      <label>For<select value={v.gender} onChange={(e) => { set("gender", e.target.value); set("category_id", ""); }}><option>men</option><option>women</option></select></label>
      <label>Category<select value={v.category_id} onChange={(e) => set("category_id", e.target.value)}><option value="">Choose...</option>{cats.filter((c) => c.gender === v.gender).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
      <label>Brand<select value={v.brand_id} onChange={(e) => set("brand_id", e.target.value)}><option value="">Choose...</option>{brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
      <label>Fabric<select value={v.fabric_id} onChange={(e) => set("fabric_id", e.target.value)}><option value="">Choose...</option>{fabs.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.season})</option>)}</select></label>
      <label>Stitching<select value={v.stitch} onChange={(e) => set("stitch", e.target.value)}><option>Stitched</option><option>Unstitched</option></select></label>
      <label>Title<input value={v.name} onChange={(e) => set("name", e.target.value)} /></label>
      <label>Description<textarea rows={4} value={v.description} onChange={(e) => set("description", e.target.value)} /></label>
      <label>Price (Rs)<input type="number" value={v.price} onChange={(e) => set("price", e.target.value)} /></label>
      <label>Old price for Sale (optional)<input type="number" value={v.was_price} onChange={(e) => set("was_price", e.target.value)} /></label>
      <label>Colours, like: Ink Blue:#1f2f4f, Ivory:#efe9dc<input value={v.colors} onChange={(e) => set("colors", e.target.value)} /></label>
      <label className="chk"><input type="checkbox" checked={v.is_new} onChange={(e) => set("is_new", e.target.checked)} />Show in New Arrivals</label>
      <label className="chk"><input type="checkbox" checked={v.active} onChange={(e) => set("active", e.target.checked)} />Visible on the website</label>
      <h3 className="sub wide">Sizes and stock</h3>
      {v.stock.map((s, i) => <div key={i} className="arow"><input value={s.size} placeholder="Size" onChange={(e) => setS(i, "size", e.target.value)} /><button type="button" onClick={() => setS(i, "qty", Math.max(0, (+s.qty || 0) - 1))}>-</button><input type="number" value={s.qty} onChange={(e) => setS(i, "qty", e.target.value)} /><button type="button" onClick={() => setS(i, "qty", (+s.qty || 0) + 1)}>+</button><button type="button" className="lnk" onClick={() => set("stock", v.stock.filter((_, j) => j !== i))}>Remove</button></div>)}
      <div className="chips"><button type="button" className="chip" onClick={() => set("stock", [...v.stock, { size: "", qty: 0 }])}>Add size</button><button type="button" className="chip" onClick={() => set("stock", ["S", "M", "L", "XL"].map((s) => ({ size: s, qty: 0 })))}>S M L XL</button><button type="button" className="chip" onClick={() => set("stock", [{ size: "One size", qty: 0 }])}>One size</button></div>
      <h3 className="sub wide">Photos (2 to 3, first = front)</h3>
      <div className="arow">{v.photos.map((u, i) => <span key={u} className="ph"><img src={u} alt="" /><button type="button" className="lnk" onClick={() => set("photos", v.photos.filter((_, j) => j !== i))}>Remove</button></span>)}</div>
      {v.photos.length < 3 && <input type="file" accept="image/*" multiple onChange={async (e) => { try { const urls = []; for (const f of [...e.target.files].slice(0, 3 - v.photos.length)) urls.push(await upload(f, "products")); set("photos", [...v.photos, ...urls]); } catch (x) { setMsg(x.message); } }} />}
      {msg && <p className="err">{msg}</p>}
      <div className="btns"><button type="button" className="btn wide" onClick={done}>Cancel</button><button type="button" className="btn fill wide" disabled={busy} onClick={save}>Save product</button></div>
    </div>
  );
}
function Crud({ table, title, fields, blank }) {
  const [rows, reload] = useRows(() => sb.from(table).select("*").order("name")), [v, setV] = useState(blank), [msg, setMsg] = useState("");
  if (!rows) return <p>Loading...</p>;
  const set = (k, x) => setV((o) => ({ ...o, [k]: x }));
  const save = async () => {
    if (!v.name) return setMsg("Please enter a name.");
    const row = Object.fromEntries(fields.map((f) => [f.k, v[f.k] || null]));
    if (!v.id && (table === "brands" || table === "categories")) row.slug = slugify(v.name);
    const r = v.id ? await sb.from(table).update(row).eq("id", v.id) : await sb.from(table).insert(row);
    if (r.error) return setMsg(r.error.message);
    setV(blank); setMsg(""); reload();
  };
  return (
    <div>
      <div className="form pform"><h2 className="sub wide">{v.id ? "Edit " : "Add "}{title}</h2>
        {fields.map((f) => <label key={f.k}>{f.label}
          {f.opts ? <select value={v[f.k] || ""} onChange={(e) => set(f.k, e.target.value)}>{f.opts.map((o) => <option key={o}>{o}</option>)}</select>
            : f.photo ? <><input type="file" accept="image/*" onChange={async (e) => { try { set(f.k, await upload(e.target.files[0], table)); } catch (x) { setMsg(x.message); } }} />{v[f.k] && <img className="thumb" src={v[f.k]} alt="" />}</>
            : <input value={v[f.k] || ""} onChange={(e) => set(f.k, e.target.value)} />}</label>)}
        {msg && <p className="err">{msg}</p>}
        <div className="btns">{v.id && <button className="btn wide" onClick={() => setV(blank)}>Cancel</button>}<button className="btn fill wide" onClick={save}>Save</button></div></div>
      {rows.map((r) => (
        <div key={r.id} className="arow">{r.photo_url && <img src={r.photo_url} alt="" />}<span><b>{r.name}</b>{r.gender && ` · ${r.gender}`}{r.season && ` · ${r.season}`}{r.active === false && " · HIDDEN"}</span>
          <span><button className="lnk" onClick={() => setV(r)}>Edit</button>{" "}
            {"active" in r && <button className="lnk" onClick={async () => { await sb.from(table).update({ active: !r.active }).eq("id", r.id); reload(); }}>{r.active ? "Hide from website" : "Show on website"}</button>}{" "}
            <button className="lnk" onClick={async () => { if (!confirm("Delete " + r.name + "?")) return; const x = await sb.from(table).delete().eq("id", r.id); if (x.error) setMsg("Cannot delete: products use it. Hide it instead."); else reload(); }}>Delete</button></span></div>
      ))}
    </div>
  );
}
