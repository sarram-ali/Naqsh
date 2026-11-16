"use client";
import { usePathname, useRouter } from "next/navigation";
// Text-style Back link on the right, shown on every page except Home.
export default function BackLink() {
  const path = usePathname(), router = useRouter();
  if (path === "/") return null;
  return <div className="backrow"><button className="shop wide" onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}>Back</button></div>;
}
