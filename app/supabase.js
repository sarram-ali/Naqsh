import { createClient } from "@supabase/supabase-js";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL, key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
// sb is null when the keys are missing: the site then runs in demo mode with the demo products from app/catalog.js.
export const sb = url && key ? createClient(url, key, { global: { fetch: (u, o) => fetch(u, { ...o, cache: "no-store" }) } }) : null;
