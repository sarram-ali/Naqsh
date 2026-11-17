"use client";
import { usePathname } from "next/navigation";
// Hides the website footer and Back link on the admin pages.
export default function Hide({ children }) { return usePathname().startsWith("/admin") ? null : children; }
